"use client";

import { Button, FileInput } from "flowbite-react";
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

export default function GalleryManagement() {
  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      setGallery(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchGallery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!image) {
      setError("Pilih gambar terlebih dahulu.");
      return;
    }
    try {
      const imageUrl = await uploadImage(image);
      await addDoc(collection(db, "gallery"), {
        src: imageUrl,
        alt: `Galeri ${Date.now()}`,
      });
      setSuccess("Image added successfully!");
      setImage(null);
      const querySnapshot = await getDocs(collection(db, "gallery"));
      setGallery(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (err: any) {
      setError(err.message || "Failed to add image.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "gallery", id));
      setGallery(gallery.filter((item) => item.id !== id));
      setSuccess("Image deleted successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to delete image.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Kelola Galeri
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            Tambah Gambar
          </label>
          <FileInput
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <Button type="submit" color="blue" className="w-full">
          Tambah Gambar
        </Button>
      </form>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
              className="object-cover rounded-lg"
            />
            <Button
              color="red"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleDelete(item.id)}
            >
              Hapus
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
