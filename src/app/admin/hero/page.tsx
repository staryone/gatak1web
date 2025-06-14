"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";
import toast from "react-hot-toast";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

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
    <div
      className={`p-6 bg-gray-50 dark:bg-gray-900 min-h-screen ${poppins.className}`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Kelola Hero
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="image"
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Gambar
              </label>
              {imageUrl && !image && (
                <div className="mt-2 mb-4">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    width={300}
                    height={150}
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              />
            </div>
            <div>
              <label
                htmlFor="title"
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Judul
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul hero"
                className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subtitle"
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Subjudul
              </label>
              <input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Masukkan subjudul hero"
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
                placeholder="Masukkan deskripsi hero"
                className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                rows={6}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 text-xl font-semibold transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        </div>

        {/* Confirmation Modal */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            modalOpen ? "" : "hidden"
          }`}
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setModalOpen(false)}
          ></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto z-10">
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
              Konfirmasi Simpan
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-xl mb-6">
              Apakah Anda yakin ingin menyimpan perubahan pada hero?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmSubmit}
                disabled={loading}
                className="bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 text-xl font-semibold transition duration-300 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Ya, Simpan"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
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
