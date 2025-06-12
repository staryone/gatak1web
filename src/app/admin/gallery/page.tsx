"use client";

import {
  Button,
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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";

export default function GalleryManagement() {
  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<any[]>([]);
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
      } catch (err: any) {
        toast.error(err.message || "Gagal memuat galeri.");
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
    } catch (err: any) {
      console.error("Add image error:", err);
      toast.error(err.message || "Gagal menambah gambar.");
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
    } catch (err: any) {
      console.error("Delete image error:", err);
      toast.error(err.message || "Gagal menghapus gambar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Kelola Galeri
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tambah Gambar
              </label>
              <FileInput
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="mt-1 rounded-lg border-gray-300 dark:border-gray-600"
              />
            </div>
            <Button
              type="submit"
              color="blue"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Menambahkan..." : "Tambah Gambar"}
            </Button>
          </form>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Daftar Gambar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="relative">
              <Image
                src={item.src}
                alt={item.alt}
                width={400}
                height={300}
                className="object-cover w-full h-64 rounded-lg"
              />
              <Button
                color="red"
                size="sm"
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                onClick={() => handleDeleteConfirm(item.id, item.imagePublicId)}
                disabled={loading}
              >
                Hapus
              </Button>
            </div>
          ))}
        </div>

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
              Apakah Anda yakin ingin menghapus gambar ini?
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
