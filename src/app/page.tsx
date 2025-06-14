"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Poppins } from "next/font/google";
import VisitorCounter from "@/components/VisitorCounter";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function Home() {
  const [hero, setHero] = useState<DocumentData>({
    imageUrl: "",
    title: "",
    subtitle: "",
    description: "",
  });
  const [newsItems, setNewsItems] = useState<DocumentData[]>([]);
  const [galleryItems, setGalleryItems] = useState<DocumentData[]>([]);
  const [umkms, setUMKMs] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [heroDoc, newsSnapshot, gallerySnapshot, umkmSnapshot] =
          await Promise.all([
            getDoc(doc(db, "siteConfig", "hero")),
            getDocs(collection(db, "news")),
            getDocs(collection(db, "gallery")),
            getDocs(collection(db, "umkm")),
          ]);

        if (heroDoc.exists()) setHero(heroDoc.data());
        setNewsItems(
          newsSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .slice(0, 3)
        );
        setGalleryItems(
          gallerySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .slice(0, 3)
        );
        setUMKMs(
          umkmSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .slice(0, 3)
        );
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen bg-gray-50 ${poppins.className}`}
    >
      <Header />
      {loading ? (
        <div className="flex items-center justify-center h-[80vh] bg-green-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative w-full h-[80vh]">
            <Image
              src={
                hero.imageUrl ||
                "https://images.unsplash.com/photo-1671884424297-5a04eb26d1af?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3"
              }
              alt="Hero Image"
              fill
              className="object-cover brightness-75"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
              <div>
                <h1 className="text-5xl font-bold">
                  {hero.title || "Selamat Datang"}
                </h1>
                <h2 className="text-3xl mt-2">
                  {hero.subtitle || "Website Informasi Padukuhan Gatak 1"}
                </h2>
                <p className="mt-4 text-xl">
                  {hero.description ||
                    "Sumber informasi terbaru tentang informasi di Padukuhan Gatak 1"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-green-700 text-white p-2 flex justify-end space-x-4 h-8"></div>

          {/* Explore Section */}
          <section className="py-12 px-4 bg-white">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-green-700 mb-6">
                Jelajahi Padukuhan
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Melalui website ini Anda dapat menjelajahi segala hal yang
                terkait dengan Padukuhan, penduduk, peta, umkm Padukuhan, dan
                berita tentang Padukuhan.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-center items-center">
                  <Image
                    src="https://img.icons8.com/ios-filled/50/006400/building.png"
                    alt="Profil"
                    width={50}
                    height={50}
                  />
                  <h3 className="text-2xl font-semibold mt-2">
                    Profil Padukuhan
                  </h3>
                </div>
                <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-center items-center">
                  <Image
                    src="https://img.icons8.com/ios-filled/50/006400/news.png"
                    alt="Berita"
                    width={50}
                    height={50}
                  />
                  <h3 className="text-2xl font-semibold mt-2">Berita</h3>
                </div>
                <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-center items-center">
                  <Image
                    src="https://img.icons8.com/ios-filled/50/006400/shopping-bag.png"
                    alt="umkm"
                    width={50}
                    height={50}
                  />
                  <h3 className="text-2xl font-semibold mt-2">UMKM</h3>
                </div>
                <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-center items-center">
                  <Image
                    src="https://img.icons8.com/ios-filled/50/006400/gallery.png"
                    alt="PPID"
                    width={50}
                    height={50}
                  />
                  <h3 className="text-2xl font-semibold mt-2">Galeri</h3>
                </div>
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="py-12 px-4 bg-gray-100">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-green-700 mb-6">
                Peta Padukuhan
              </h2>
              <p className="text-gray-600 mb-4 text-lg">
                Menampilkan Peta Padukuhan Gatak 1
              </p>
              <div className="relative w-full h-80 rounded-lg overflow-hidden shadow">
                <iframe
                  src="https://www.google.com/maps/d/u/0/embed?mid=10t-KmGcm11P72lNIObK48hAP0J140b0&ehbc=2E312F&noprof=1"
                  width="100%"
                  height="100%"
                  className="rounded-lg"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </section>

          {/* News Section */}
          <section className="py-12 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold text-green-700 mb-6">
                Berita Padukuhan
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Menampilkan informasi terbaru tentang peristiwa, berita terkini,
                dan artikel-artikel jurnalistik di Padukuhan Gatak 1
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {newsItems.length > 0 ? (
                  newsItems.map((item) => (
                    <Link
                      href={`/berita/${item.id}`}
                      key={item.id}
                      className="block"
                    >
                      <div className="bg-gray-100 rounded-lg shadow p-4">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={400}
                            height={200}
                            className="w-full h-40 object-cover rounded-t-lg"
                          />
                        )}
                        <h3 className="text-xl font-semibold mt-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-lg mt-2 line-clamp-2">
                          {item.description}...
                        </p>
                        <div className="text-gray-500 text-base mt-2">
                          {item.date} | {item.author}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-xl">
                    Belum ada data tersedia
                  </p>
                )}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/berita"
                  className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 text-xl"
                >
                  Lihat Berita Lainnya
                </Link>
              </div>
            </div>
          </section>

          {/* UMKM Section */}
          <section className="py-12 px-4 bg-gray-100">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold text-green-700 mb-6">
                UMKM Padukuhan
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Menampilkan berbagai usaha mikro, kecil, dan menengah yang
                beroperasi di Padukuhan Gatak 1
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {umkms.length > 0 ? (
                  umkms.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-100 rounded-lg shadow p-4"
                    >
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={400}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                      )}
                      <h3 className="text-2xl font-semibold mt-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-lg mt-2 line-clamp-2">
                        {item.description}...
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-xl">
                    Belum ada data tersedia
                  </p>
                )}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/umkm"
                  className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 text-xl"
                >
                  Lihat UMKM Lainnya
                </Link>
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section className="py-12 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold text-green-700 mb-6">
                Galeri Padukuhan
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Menampilkan kegiatan-kegiatan yang berlangsung di Padukuhan
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {galleryItems.length > 0 ? (
                  galleryItems.map((item) => (
                    <Image
                      key={item.id}
                      src={item.src}
                      alt={item.alt}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-lg shadow"
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-xl">
                    Belum ada data tersedia
                  </p>
                )}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/galeri"
                  className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 text-xl"
                >
                  Lihat Foto Lebih Banyak
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
      <VisitorCounter />
    </div>
  );
}
