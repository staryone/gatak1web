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

export default function HeaderManagement() {
  const [logo, setLogo] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPublicId, setLogoPublicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const docRef = doc(db, "siteConfig", "header");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setSubtitle(data.subtitle || "");
          setLogoUrl(data.logoUrl || "");
          setLogoPublicId(data.logoPublicId || "");
        }
      } catch {
        toast.error("Gagal memuat data header.");
      }
    };
    fetchHeaderData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    try {
      let newLogoUrl = logoUrl;
      let newLogoPublicId = logoPublicId;
      if (logo) {
        if (logoPublicId) {
          await fetch("/api/cloudinary/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId: logoPublicId }),
          });
        }
        newLogoUrl = await uploadImage(logo);
        newLogoPublicId = newLogoUrl.split("/").pop()?.split(".")[0] || "";
      }
      await setDoc(doc(db, "siteConfig", "header"), {
        logoUrl: newLogoUrl,
        logoPublicId: newLogoPublicId,
        title,
        subtitle,
      });
      toast.success("Header berhasil diperbarui!");
      setLogo(null);
      setLogoUrl(newLogoUrl);
      setLogoPublicId(newLogoPublicId);
      setModalOpen(false);
    } catch {
      toast.error("Gagal memperbarui header.");
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
          Kelola Header
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="logo"
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Logo
              </label>
              {logoUrl && !logo && (
                <div className="mt-2 mb-4">
                  <Image
                    src={logoUrl}
                    alt="Preview"
                    width={150}
                    height={150}
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
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
                placeholder="Masukkan judul header"
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
                placeholder="Masukkan subjudul header"
                className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
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
              Apakah Anda yakin ingin menyimpan perubahan pada header?
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
