"use client";

import Image from "next/image";
import { Card, Button } from "flowbite-react";
import Link from "next/link";
import Header from "@/components/Header";

const newsItems = [
  {
    id: 1,
    title: "Jadwal Penyaluran BLT Triwulan 3 UB. Juli 2024",
    description:
      "Diberitahukan kepada warga Desa Tumbang Tariok selaku penerima manfaat BLTDD agar dapat hadir pada: Hari: kamis Tanggal: 25 Juni 2024 Pukul: 08.00...",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    author: "Admin",
    date: "24 Jul 2024",
  },
  {
    id: 2,
    title: "Pengumuman Rapat Warga Bulanan",
    description:
      "Rapat warga bulanan akan diadakan pada tanggal 10 Juli 2024 pukul 19.00 di balai desa. Hadirilah untuk diskusi penting...",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3",
    author: "Admin",
    date: "20 Jun 2025",
  },
  {
    id: 3,
    title: "Pelatihan Pertanian Organik",
    description:
      "Pelatihan pertanian organik akan dimulai pada 15 Juli 2024 pukul 09.00 di lapangan desa. Pendaftaran terbuka untuk semua warga...",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3",
    author: "Admin",
    date: "18 Jun 2025",
  },
];

// Dummy data for gallery section
const galleryItems = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Galeri 1",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Galeri 2",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Galeri 3",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Galeri 4",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Galeri 5",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Galeri 6",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Hero Section */}
      <div className="relative flex items-center justify-center h-screen w-screen">
        <div className="h-screen w-screen relative z-0">
          <Image
            src="https://images.unsplash.com/photo-1671884424297-5a04eb26d1af?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="gambar dusun gatak 1"
            fill={true}
            className="object-cover"
          />
        </div>
        <div className="absolute text-center z-10 px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl shadow-xl">
            Selamat Datang
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white drop-shadow-2xl mt-2 shadow-xl">
            Website Resmi Dusun Gatak 1
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white drop-shadow-2xl mt-1 shadow-xl">
            Sumber informasi terbaru tentang masyarakat di Dusun Gatak 1
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
            Dusun Gatak 1 adalah komunitas yang kaya akan budaya dan tradisi,
            terletak di jantung wilayah yang dikelilingi oleh keindahan alam.
            Kami berkomitmen untuk memajukan kesejahteraan masyarakat melalui
            kerja sama dan inovasi.
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
                <Card imgSrc={item.image} className="max-h-full">
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
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button as={Link} href="#" color="blue" size="lg">
              Lihat Berita Lebih Banyak
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
            <Button as={Link} href="#" color="blue" size="lg">
              Lihat Foto Lebih Banyak
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
