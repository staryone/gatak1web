"use client";

import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function SiteConfigManagement() {
  const [aboutContent, setAboutContent] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [headName, setHeadName] = useState("");
  const [headContact, setHeadContact] = useState("");
  const [northBoundary, setNorthBoundary] = useState("");
  const [southBoundary, setSouthBoundary] = useState("");
  const [eastBoundary, setEastBoundary] = useState("");
  const [westBoundary, setWestBoundary] = useState("");
  const [villageArea, setVillageArea] = useState("");
  const [population, setPopulation] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aboutRef = doc(db, "siteConfig", "about");
        const profilRef = doc(db, "siteConfig", "profil-dusun");
        const [aboutSnap, profilSnap] = await Promise.all([
          getDoc(aboutRef),
          getDoc(profilRef),
        ]);
        if (aboutSnap.exists()) {
          setAboutContent(aboutSnap.data().content || "");
        }
        if (profilSnap.exists()) {
          const data = profilSnap.data();
          setVision(data.vision || "");
          setMission(data.mission || "");
          setHeadName(data.headName || "");
          setHeadContact(data.headContact || "");
          setNorthBoundary(data.northBoundary || "");
          setSouthBoundary(data.southBoundary || "");
          setEastBoundary(data.eastBoundary || "");
          setWestBoundary(data.westBoundary || "");
          setVillageArea(data.villageArea || "");
          setPopulation(data.population || "");
        }
      } catch {
        toast.error("Gagal memuat data.");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    try {
      await Promise.all([
        setDoc(doc(db, "siteConfig", "about"), { content: aboutContent }),
        setDoc(doc(db, "siteConfig", "profil-dusun"), {
          vision,
          mission,
          headName,
          headContact,
          northBoundary,
          southBoundary,
          eastBoundary,
          westBoundary,
          villageArea,
          population,
        }),
      ]);
      toast.success("Data berhasil diperbarui!");
      setModalOpen(false);
    } catch {
      toast.error("Gagal memperbarui data.");
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
          Kelola Profil Dusun
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Tentang Dusun
              </h3>
              <label
                htmlFor="aboutContent"
                className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Konten
              </label>
              <textarea
                id="aboutContent"
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                placeholder="Masukkan konten tentang dusun"
                className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                rows={6}
                required
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Visi dan Misi Dusun
              </h3>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="vision"
                    className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Visi
                  </label>
                  <textarea
                    id="vision"
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    placeholder="Masukkan visi dusun"
                    className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="mission"
                    className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Misi
                  </label>
                  <textarea
                    id="mission"
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="Masukkan misi dusun"
                    className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                    rows={4}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Detail Kepala Dukuh
              </h3>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="headName"
                    className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Nama
                  </label>
                  <input
                    id="headName"
                    type="text"
                    value={headName}
                    onChange={(e) => setHeadName(e.target.value)}
                    placeholder="Masukkan nama kepala dukuh"
                    className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="headContact"
                    className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Kontak
                  </label>
                  <input
                    id="headContact"
                    type="text"
                    value={headContact}
                    onChange={(e) => setHeadContact(e.target.value)}
                    placeholder="Masukkan nomor kontak kepala dukuh (contoh: +6281234567890)"
                    className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Batas Padukuhan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="northBoundary"
                    className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Utara
                  </label>
                  <input
                    id="northBoundary"
                    type="text"
                    value={northBoundary}
                    onChange={(e) => setNorthBoundary(e.target.value)}
                    placeholder="Masukkan batas utara"
                    className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="southBoundary"
                    className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Selatan
                  </label>
                  <input
                    id="southBoundary"
                    type="text"
                    value={southBoundary}
                    onChange={(e) => setSouthBoundary(e.target.value)}
                    placeholder="Masukkan batas selatan"
                    className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="eastBoundary"
                    className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Timur
                  </label>
                  <input
                    id="eastBoundary"
                    type="text"
                    value={eastBoundary}
                    onChange={(e) => setEastBoundary(e.target.value)}
                    placeholder="Masukkan batas timur"
                    className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="westBoundary"
                    className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Barat
                  </label>
                  <input
                    id="westBoundary"
                    type="text"
                    value={westBoundary}
                    onChange={(e) => setWestBoundary(e.target.value)}
                    placeholder="Masukkan batas barat"
                    className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Padukuhan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="villageArea"
                    className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Luas Padukuhan (m²)
                  </label>
                  <input
                    id="villageArea"
                    type="number"
                    value={villageArea}
                    onChange={(e) => setVillageArea(e.target.value)}
                    placeholder="Masukkan luas padukuhan"
                    className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="population"
                    className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Jumlah Penduduk
                  </label>
                  <input
                    id="population"
                    type="number"
                    value={population}
                    onChange={(e) => setPopulation(e.target.value)}
                    placeholder="Masukkan jumlah penduduk"
                    className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 text-xl font-semibold transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Semua"}
            </button>
          </form>
        </div>

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
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Konfirmasi Simpan
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-xl mb-6">
              Apakah Anda yakin ingin menyimpan perubahan?
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
