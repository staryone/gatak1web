"use client";

import Image from "next/image";
import { Card, Button } from "flowbite-react";
import Link from "next/link";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [hero, setHero] = useState({
    imageUrl: "",
    title: "",
    subtitle: "",
    description: "",
  });
  const [about, setAbout] = useState({ content: "" });
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [umkms, setUMKMs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hero
        const heroDoc = await getDoc(doc(db, "siteConfig", "hero"));
        if (heroDoc.exists()) setHero(heroDoc.data());

        // Fetch about
        const aboutDoc = await getDoc(doc(db, "siteConfig", "about"));
        if (aboutDoc.exists()) setAbout(aboutDoc.data());

        // Fetch news
        const newsSnapshot = await getDocs(collection(db, "news"));
        setNewsItems(
          newsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        // Fetch gallery
        const gallerySnapshot = await getDocs(collection(db, "gallery"));
        setGalleryItems(
          gallerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        // Fetch UMKM
        const umkmSnapshot = await getDocs(collection(db, "umkm"));
        setUMKMs(
          umkmSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Hero Section */}
      <div className="relative flex items-center justify-center h-screen w-screen">
        <div className="h-screen w-screen relative z-0">
          <Image
            src={
              hero.imageUrl ||
              "https://images.unsplash.com/photo-1671884424297-5a04eb26d1af?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.1.0"
            }
            alt="gambar dusun gatak 1"
            fill={true}
            className="object-cover"
          />
        </div>
        <div className="absolute text-center z-10 px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl shadow-xl">
            {hero.title || "Selamat Datang"}
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white drop-shadow-2xl mt-2 shadow-xl">
            {hero.subtitle || "Website Resmi Dusun Gatak 1"}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white drop-shadow-2xl mt-1 shadow-xl">
            {hero.description ||
              "Sumber informasi terbaru tentang masyarakat di Dusun Gatak 1"}
          </p>
        </div>
      </div>

      {/* About and Vision-Mission Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Tentang Dusun Gatak 1
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 text-center mb-8">
            {about.content ||
              "Dusun Gatak 1 adalah komunitas yang kaya akan budaya dan tradisi, terletak di jantung wilayah yang dikelilingi oleh keindahan alam. Kami berkomitmen untuk memajukan kesejahteraan masyarakat melalui kerja sama dan inovasi."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Visi
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Menjadikan Dusun Gatak 1 sebagai komunitas yang harmonis,
                sejahtera, dan berwawasan lingkungan yang berkelanjutan.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Misi
              </h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>
                  Meningkatkan kualitas hidup masyarakat melalui pendidikan dan
                  ekonomi.
                </li>
                <li>Melestarikan budaya dan tradisi lokal.</li>
                <li>Mengembangkan infrastruktur yang ramah lingkungan.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Peta Dusun Gatak 1
          </h2>
          <div className="relative w-full h-64 sm:h-80 lg:h-96">
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Berita Dusun
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item) => (
              <Link href={`/news/${item.id}`} key={item.id} className="block">
                <Card className="h-[350px] flex flex-col">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={400}
                      height={200}
                      className="object-cover w-full h-40"
                    />
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-grow">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-gray-500 text-xs mt-auto">
                      <span>{item.author}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button as={Link} href="/berita" color="blue" size="lg">
              Lihat Berita Lebih Banyak
            </Button>
          </div>
        </div>
      </section>

      {/* UMKM Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
            UMKM Dusun Gatak 1
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {umkms.map((item) => (
              <Card key={item.id} className="h-[350px] flex flex-col">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={400}
                    height={200}
                    className="object-cover w-full h-40"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-grow">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button as={Link} href="/umkm" color="blue" size="lg">
              Lihat UMKM Lebih Banyak
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Galeri Dusun
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <Image
                key={item.id}
                src={item.src}
                alt={item.alt}
                width={400}
                height={300}
                className="object-cover rounded-lg"
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button as={Link} href="/galeri" color="blue" size="lg">
              Lihat Foto Lebih Banyak
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
