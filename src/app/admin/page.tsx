"use client";

import { useState } from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function AdminDashboard() {
  const [activePanels, setActivePanels] = useState<string[]>([]);

  const togglePanel = (panelId: string) => {
    setActivePanels((prev) =>
      prev.includes(panelId)
        ? prev.filter((id) => id !== panelId)
        : [...prev, panelId]
    );
  };

  return (
    <div
      className={`container mx-auto p-6 bg-gray-50 min-h-screen ${poppins.className}`}
    >
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Dashboard Admin Website Padukuhan Gatak 1
      </h1>
      <p className="text-center text-gray-600 mb-8 text-xl">
        Kalian bisa mengatur website melalui dashboard ini
      </p>

      <div className="space-y-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <button
            onClick={() => togglePanel("header")}
            className="w-full text-left text-2xl font-semibold text-green-700 hover:text-green-800 focus:outline-none p-4 rounded-t-lg"
          >
            Header
            <span className="float-right">
              {activePanels.includes("header") ? "−" : "+"}
            </span>
          </button>
          {activePanels.includes("header") && (
            <div className="p-4">
              <div className=" text-gray-700 text-lg">
                Header untuk mengatur header di halaman utama, seperti logo dan
                judul.
              </div>
              <Image
                src={"/header.png"}
                alt="gambar header"
                width={480}
                height={480}
              ></Image>
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <button
            onClick={() => togglePanel("hero")}
            className="w-full text-left text-2xl font-semibold text-green-700 hover:text-green-800 focus:outline-none p-4 rounded-t-lg"
          >
            Hero
            <span className="float-right">
              {activePanels.includes("hero") ? "−" : "+"}
            </span>
          </button>
          {activePanels.includes("hero") && (
            <div className="p-4">
              <div className="text-gray-700 text-lg">
                Hero untuk mengatur Hero di halaman utama. Hero itu adalah
                bagian besar di atas halaman yang menarik perhatian, biasanya
                ada gambar atau teks besar.
              </div>
              <Image
                src={"/hero.png"}
                alt="gambar header"
                width={480}
                height={480}
              ></Image>
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <button
            onClick={() => togglePanel("profil")}
            className="w-full text-left text-2xl font-semibold text-green-700 hover:text-green-800 focus:outline-none p-4 rounded-t-lg"
          >
            Profil Padukuhan
            <span className="float-right">
              {activePanels.includes("profil") ? "−" : "+"}
            </span>
          </button>
          {activePanels.includes("profil") && (
            <div className="p-4 text-gray-700 text-lg">
              Profil Padukuhan untuk mengatur sejarah padukuhan, visi, dan misi
              padukuhan, menjelaskan tujuan dan arah masa depan.
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <button
            onClick={() => togglePanel("berita")}
            className="w-full text-left text-2xl font-semibold text-green-700 hover:text-green-800 focus:outline-none p-4 rounded-t-lg"
          >
            Berita
            <span className="float-right">
              {activePanels.includes("berita") ? "−" : "+"}
            </span>
          </button>
          {activePanels.includes("berita") && (
            <div className="p-4 text-gray-700 text-lg">
              Berita untuk menambah, mengedit, menghapus berita tentang
              padukuhan, seperti pengumuman atau update terbaru.
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <button
            onClick={() => togglePanel("umkm")}
            className="w-full text-left text-2xl font-semibold text-green-700 hover:text-green-800 focus:outline-none p-4 rounded-t-lg"
          >
            UMKM
            <span className="float-right">
              {activePanels.includes("umkm") ? "−" : "+"}
            </span>
          </button>
          {activePanels.includes("umkm") && (
            <div className="p-4 text-gray-700 text-lg">
              UMKM untuk menambah, mengedit, menghapus UMKM tentang padukuhan,
              seperti daftar usaha kecil di wilayah tersebut.
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <button
            onClick={() => togglePanel("galeri")}
            className="w-full text-left text-2xl font-semibold text-green-700 hover:text-green-800 focus:outline-none p-4 rounded-t-lg"
          >
            Galeri
            <span className="float-right">
              {activePanels.includes("galeri") ? "−" : "+"}
            </span>
          </button>
          {activePanels.includes("galeri") && (
            <div className="p-4 text-gray-700 text-lg">
              Galeri untuk menambah, menghapus foto-foto tentang padukuhan,
              seperti gambar kegiatan atau pemandangan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
