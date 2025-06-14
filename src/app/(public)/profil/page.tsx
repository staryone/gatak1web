"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function ProfilPadukuhan() {
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
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`min-h-screen bg-green-50 p-6 ${poppins.className}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 mt-20">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Profil Padukuhan
          </h1>
          <p className="text-lg text-gray-600">
            Informasi lengkap tentang Padukuhan kami
          </p>
        </div>

        {/* Tentang Desa Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Tentang Desa
          </h2>
          <p className="text-lg text-gray-700">
            {aboutContent || "Data tentang desa belum tersedia."}
          </p>
        </section>

        {/* Visi dan Misi Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Visi dan Misi
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Visi</h3>
              <p className="text-lg text-gray-700">
                {vision || "Visi belum tersedia."}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Misi</h3>
              <p className="text-lg text-gray-700">
                {mission || "Misi belum tersedia."}
              </p>
            </div>
          </div>
        </section>

        {/* Kepala Dukuh Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Kepala Dukuh
          </h2>
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              <span className="font-medium">Nama:</span>{" "}
              {headName || "Belum tersedia"}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Kontak:</span>{" "}
              {headContact || "Belum tersedia"}
            </p>
          </div>
        </section>

        {/* Batas Desa Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Batas Desa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-lg text-gray-700">
                <span className="font-medium">Utara:</span>{" "}
                {northBoundary || "Belum tersedia"}
              </p>
            </div>
            <div>
              <p className="text-lg text-gray-700">
                <span className="font-medium">Timur:</span>{" "}
                {eastBoundary || "Belum tersedia"}
              </p>
            </div>
            <div>
              <p className="text-lg text-gray-700">
                <span className="font-medium">Selatan:</span>{" "}
                {southBoundary || "Belum tersedia"}
              </p>
            </div>
            <div>
              <p className="text-lg text-gray-700">
                <span className="font-medium">Barat:</span>{" "}
                {westBoundary || "Belum tersedia"}
              </p>
            </div>
          </div>
        </section>

        {/* Luas Desa Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Luas Desa
          </h2>
          <p className="text-lg text-gray-700">{villageArea || "0"} m²</p>
        </section>

        {/* Jumlah Penduduk Section */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Jumlah Penduduk
          </h2>
          <p className="text-lg text-gray-700">{population || "0"} Jiwa</p>
        </section>

        {/* Peta Lokasi Section */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Peta Lokasi Desa
          </h2>
          <div className="relative w-full h-64">
            <iframe
              src="https://www.google.com/maps/d/u/0/embed?mid=10t-KmGcm11P72lNIObK48hAP0J140b0&ehbc=2E312F&noprof=1"
              width="100%"
              height="100%"
              className="rounded-lg"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
}
