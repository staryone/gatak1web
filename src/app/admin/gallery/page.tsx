"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";
import toast from "react-hot-toast";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function GalleryManagement() {
  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteImagePublicId, setDeleteImagePublicId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gallery"));
        setGallery(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch {
        toast.error("Gagal memuat galeri.");
      }
    };
    fetchGallery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error("Pilih gambar terlebih dahulu.");
      return;
    }
    setLoading(true);
    try {
      const imageUrl = await uploadImage(image);
      const imagePublicId = imageUrl.split("/").pop()?.split(".")[0] || "";
      await addDoc(collection(db, "gallery"), {
        src: imageUrl,
        imagePublicId,
        alt: `Galeri ${Date.now()}`,
      });
      toast.success("Gambar berhasil ditambahkan!");
      setImage(null);
      const querySnapshot = await getDocs(collection(db, "gallery"));
      setGallery(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch {
      toast.error("Gagal menambah gambar.");
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
      await deleteDoc(doc(db, "gallery", deleteId));
      setGallery(gallery.filter((item) => item.id !== deleteId));
      toast.success("Gambar berhasil dihapus!");
      setDeleteModalOpen(false);
    } catch {
      toast.error("Gagal menghapus gambar.");
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
          Kelola Galeri
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="image"
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tambah Gambar
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
              {loading ? "Menambahkan..." : "Tambah Gambar"}
            </button>
          </form>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Daftar Gambar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="relative group">
              <Image
                src={item.src}
                alt={item.alt}
                width={400}
                height={300}
                className="object-cover w-full h-64 rounded-lg transition-opacity duration-300"
              />
              <button
                onClick={() => handleDeleteConfirm(item.id, item.imagePublicId)}
                disabled={loading}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-opacity duration-300 opacity-100 group-hover:opacity-100 disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          ))}
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
              Apakah Anda yakin ingin menghapus gambar ini?
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
