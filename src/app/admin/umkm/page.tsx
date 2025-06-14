"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";
import toast from "react-hot-toast";
import { HiPencil, HiTrash } from "react-icons/hi";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function UMKMManagement() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [umkms, setUMKMs] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteImagePublicId, setDeleteImagePublicId] = useState<string | null>(
    null
  );
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSocialMedia, setEditSocialMedia] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");

  useEffect(() => {
    const fetchUMKMs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "umkm"));
        setUMKMs(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch {
        toast.error("Gagal memuat UMKM.");
      }
    };
    fetchUMKMs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = "";
      let imagePublicId = "";
      if (image) {
        imageUrl = await uploadImage(image);
        imagePublicId = imageUrl.split("/").pop()?.split(".")[0] || "";
      }
      await addDoc(collection(db, "umkm"), {
        name,
        description,
        phone,
        socialMedia,
        imageUrl,
        imagePublicId,
        createdAt: new Date().toISOString(),
      });
      toast.success("UMKM berhasil ditambahkan!");
      setName("");
      setDescription("");
      setPhone("");
      setSocialMedia("");
      setImage(null);
      const querySnapshot = await getDocs(collection(db, "umkm"));
      setUMKMs(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch {
      toast.error("Gagal menambah UMKM.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: DocumentData) => {
    setEditId(item.id);
    setEditName(item.name);
    setEditDescription(item.description);
    setEditPhone(item.phone || "");
    setEditSocialMedia(item.socialMedia || "");
    setEditImageUrl(item.imageUrl || "");
    setEditImage(null);
    setModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setLoading(true);
    try {
      let imageUrl = editImageUrl;
      let imagePublicId =
        umkms.find((item) => item.id === editId)?.imagePublicId || "";
      if (editImage) {
        if (imagePublicId) {
          await fetch("/api/cloudinary/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId: imagePublicId }),
          });
        }
        imageUrl = await uploadImage(editImage);
        imagePublicId = imageUrl.split("/").pop()?.split(".")[0] || "";
      }
      await updateDoc(doc(db, "umkm", editId), {
        name: editName,
        description: editDescription,
        phone: editPhone,
        socialMedia: editSocialMedia,
        imageUrl,
        imagePublicId,
      });
      toast.success("UMKM berhasil diperbarui!");
      setModalOpen(false);
      const querySnapshot = await getDocs(collection(db, "umkm"));
      setUMKMs(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch {
      toast.error("Gagal memperbarui UMKM.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (id: string, imagePublicId?: string) => {
    setDeleteId(id);
    setDeleteImagePublicId(imagePublicId || null);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      if (deleteImagePublicId) {
        const response = await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: deleteImagePublicId }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Gagal menghapus gambar Cloudinary"
          );
        }
      }
      await deleteDoc(doc(db, "umkm", deleteId));
      setUMKMs(umkms.filter((item) => item.id !== deleteId));
      toast.success("UMKM dan gambar berhasil dihapus!");
      setDeleteModalOpen(false);
    } catch {
      toast.error("Gagal menghapus UMKM.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-6 bg-gray-50 dark:bg-gray-900 min-h-screen ${poppins.className}`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Kelola UMKM
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nama
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama UMKM"
                className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Deskripsi
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masukkan deskripsi UMKM"
                className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                rows={6}
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Telepon
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Masukkan nomor telepon (contoh: +6281234567890)"
                className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                type="tel"
              />
            </div>
            <div>
              <label
                htmlFor="socialMedia"
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Sosial Media
              </label>
              <input
                id="socialMedia"
                value={socialMedia}
                onChange={(e) => setSocialMedia(e.target.value)}
                placeholder="Masukkan link sosial media (contoh: https://instagram.com/username)"
                className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Gambar
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 text-xl font-semibold transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Menambahkan..." : "Tambah UMKM"}
            </button>
          </form>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Daftar UMKM
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {umkms.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={400}
                  height={200}
                  className="object-cover w-full h-48 rounded-t-xl"
                />
              )}
              <div className="p-4 flex flex-col">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {item.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-2 line-clamp-3 flex-grow">
                  {item.description}
                </p>
                {item.phone && (
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
                    <strong>Telepon:</strong> {item.phone}
                  </p>
                )}
                {item.socialMedia && (
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                    <strong>Sosial Media:</strong>{" "}
                    <a
                      href={item.socialMedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {item.socialMedia}
                    </a>
                  </p>
                )}
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-base mb-4">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-xl font-semibold transition duration-300 flex items-center justify-center"
                  >
                    <HiPencil className="mr-2" size={20} /> Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteConfirm(item.id, item.imagePublicId)
                    }
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-xl font-semibold transition duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    <HiTrash className="mr-2" size={20} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            modalOpen ? "" : "hidden"
          }`}
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(false);
            }}
          ></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-scroll w-full h-full max-h-lvh max-w-lg mx-auto z-10 md:max-w-2xl sm:max-w-sm">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Edit UMKM
            </h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label
                  htmlFor="editName"
                  className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Nama
                </label>
                <input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Masukkan nama UMKM"
                  className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editDescription"
                  className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Deskripsi
                </label>
                <textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Masukkan deskripsi UMKM"
                  className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                  rows={6}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editPhone"
                  className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Telepon
                </label>
                <input
                  id="editPhone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="Masukkan nomor telepon (contoh: +6281234567890)"
                  className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                  type="tel"
                />
              </div>
              <div>
                <label
                  htmlFor="editSocialMedia"
                  className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Sosial Media
                </label>
                <input
                  id="editSocialMedia"
                  value={editSocialMedia}
                  onChange={(e) => setEditSocialMedia(e.target.value)}
                  placeholder="Masukkan link sosial media (contoh: https://instagram.com/username)"
                  className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="editImage"
                  className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Gambar
                </label>
                {editImageUrl && !editImage && (
                  <div className="mt-2 mb-4">
                    <Image
                      src={editImageUrl}
                      alt="Preview"
                      width={300}
                      height={150}
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  id="editImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 text-xl font-semibold transition duration-300 disabled:opacity-50 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditId(null);
                    setEditName("");
                    setEditDescription("");
                    setEditPhone("");
                    setEditSocialMedia("");
                    setEditImage(null);
                    setEditImageUrl("");
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 text-xl font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            deleteModalOpen ? "" : "hidden"
          }`}
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setDeleteModalOpen(false)}
          ></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto z-10">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-xl mb-6">
              Apakah Anda yakin ingin menghapus UMKM ini?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-xl font-semibold transition duration-300 disabled:opacity-50"
              >
                {loading ? "Menghapus..." : "Ya, Hapus"}
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 text-xl font-semibold"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
