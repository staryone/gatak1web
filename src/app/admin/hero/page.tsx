"use client";

import {
  Button,
  Label,
  TextInput,
  FileInput,
  Textarea,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";

export default function HeroManagement() {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const docRef = doc(db, "siteConfig", "hero");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setSubtitle(data.subtitle || "");
          setDescription(data.description || "");
          setImageUrl(data.imageUrl || "");
          setImagePublicId(data.imagePublicId || "");
        }
      } catch (err: any) {
        toast.error(err.message || "Gagal memuat data hero.");
      }
    };
    fetchHeroData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    try {
      let newImageUrl = imageUrl;
      let newImagePublicId = imagePublicId;
      if (image) {
        if (imagePublicId) {
          await fetch("/api/cloudinary/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId: imagePublicId }),
          });
        }
        newImageUrl = await uploadImage(image);
        newImagePublicId = newImageUrl.split("/").pop()?.split(".")[0] || "";
      }
      await setDoc(doc(db, "siteConfig", "hero"), {
        imageUrl: newImageUrl,
        imagePublicId: newImagePublicId,
        title,
        subtitle,
        description,
      });
      toast.success("Hero berhasil diperbarui!");
      setImage(null);
      setImageUrl(newImageUrl);
      setImagePublicId(newImagePublicId);
      setModalOpen(false);
    } catch (err: any) {
      console.error("Update hero error:", err);
      toast.error(err.message || "Gagal memperbarui hero.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Kelola Hero
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="image"
                className="text-gray-700 dark:text-gray-300 font-medium"
              />
              {imageUrl && !image && (
                <div className="mt-2 mb-4">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    width={200}
                    height={100}
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <FileInput
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="mt-1 rounded-lg border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <Label
                htmlFor="title"
                className="text-gray-700 dark:text-gray-300 font-medium"
              />
              <TextInput
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul hero"
                className="mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="subtitle"
                className="text-gray-700 dark:text-gray-300 font-medium"
              />
              <TextInput
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Masukkan subjudul hero"
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
                placeholder="Masukkan deskripsi hero"
                className="mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                rows={6}
                required
              />
            </div>
            <Button
              type="submit"
              color="blue"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </div>

        {/* Confirmation Modal */}
        <Modal
          show={modalOpen}
          onClose={() => setModalOpen(false)}
          size="md"
          popup
        >
          <ModalHeader className="text-xl font-semibold text-gray-900 dark:text-white">
            Konfirmasi Simpan
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300">
              Apakah Anda yakin ingin menyimpan perubahan pada hero?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="blue"
              onClick={confirmSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? "Menyimpan..." : "Ya, Simpan"}
            </Button>
            <Button
              color="gray"
              onClick={() => setModalOpen(false)}
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
