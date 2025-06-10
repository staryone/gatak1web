"use client";

import {
  Button,
  Label,
  TextInput,
  Textarea,
  Card,
  FileInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";
import { HiPencil, HiTrash } from "react-icons/hi";

export default function UMKMManagement() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [umkms, setUMKMs] = useState<any[]>([]);
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
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");

  useEffect(() => {
    const fetchUMKMs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "umkm"));
        setUMKMs(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err: any) {
        toast.error(err.message || "Gagal memuat UMKM.");
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
        imageUrl,
        imagePublicId,
        createdAt: new Date().toISOString(),
      });
      toast.success("UMKM berhasil ditambahkan!");
      setName("");
      setDescription("");
      setImage(null);
      const querySnapshot = await getDocs(collection(db, "umkm"));
      setUMKMs(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (err: any) {
      console.error("Add UMKM error:", err);
      toast.error(err.message || "Gagal menambah UMKM.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setEditName(item.name);
    setEditDescription(item.description);
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
        imageUrl,
        imagePublicId,
      });
      toast.success("UMKM berhasil diperbarui!");
      setModalOpen(false);
      const querySnapshot = await getDocs(collection(db, "umkm"));
      setUMKMs(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (err: any) {
      console.error("Update UMKM error:", err);
      toast.error(err.message || "Gagal memperbarui UMKM.");
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
    } catch (err: any) {
      console.error("Delete UMKM error:", err);
      toast.error(err.message || "Gagal menghapus UMKM.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Kelola UMKM
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="text-gray-700 dark:text-gray-300 font-medium"
              />
              <TextInput
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama UMKM"
                className="mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="description"
                className="text-gray-700 dark:text-gray-300 font-medium"
              />
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masukkan deskripsi UMKM"
                className="mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                rows={6}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="image"
                className="text-gray-700 dark:text-gray-300 font-medium"
              />
              <FileInput
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="mt-1 rounded-lg"
              />
            </div>
            <Button
              type="submit"
              color="blue"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Menambahkan..." : "Tambah UMKM"}
            </Button>
          </form>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Daftar UMKM
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {umkms.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800 border-none"
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
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {item.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs mb-4">
                  <span>{item.createdAt.split("T")[0]}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    color="blue"
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    onClick={() => handleEdit(item)}
                  >
                    <HiPencil className="mr-2" /> Edit
                  </Button>
                  <Button
                    color="red"
                    size="sm"
                    className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    onClick={() =>
                      handleDeleteConfirm(item.id, item.imagePublicId)
                    }
                    disabled={loading}
                  >
                    <HiTrash className="mr-2" /> Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Edit Modal */}
        <Modal
          show={modalOpen}
          onClose={() => setModalOpen(false)}
          size="lg"
          popup
        >
          <ModalHeader className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit UMKM
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <Label
                  htmlFor="editName"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                />
                <TextInput
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Masukkan nama UMKM"
                  className="mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="editDescription"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                />
                <Textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Masukkan deskripsi UMKM"
                  className="mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  rows={6}
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="editImage"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                />
                {editImageUrl && !editImage && (
                  <div className="mt-2 mb-4">
                    <Image
                      src={editImageUrl}
                      alt="Preview"
                      width={200}
                      height={100}
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <FileInput
                  id="editImage"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  className="mt-1 rounded-lg"
                />
              </div>
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  color="blue"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
                <Button
                  color="gray"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setModalOpen(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          show={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          size="md"
          popup
        >
          <ModalHeader className="text-xl font-semibold text-gray-900 dark:text-white">
            Konfirmasi Hapus
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300">
              Apakah Anda yakin ingin menghapus UMKM ini?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="red"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              {loading ? "Menghapus..." : "Ya, Hapus"}
            </Button>
            <Button
              color="gray"
              onClick={() => setDeleteModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
