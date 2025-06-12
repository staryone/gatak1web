"use client";

import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Dashboard Admin Website Dusun Gatak 1
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Kalian bisa mengatur website melalui dashboard ini
      </p>

      <Accordion collapseAll>
        <AccordionPanel>
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <AccordionTitle>Header</AccordionTitle>
            <AccordionContent>
              <p className="text-gray-700">
                Header untuk mengatur header di halaman utama, seperti logo dan
                judul.
              </p>
            </AccordionContent>
          </div>
        </AccordionPanel>

        <AccordionPanel>
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <AccordionTitle>Hero</AccordionTitle>
            <AccordionContent>
              <p className="text-gray-700">
                Hero untuk mengatur Hero di halaman utama. Hero itu adalah
                bagian besar di atas halaman yang menarik perhatian, biasanya
                ada gambar atau teks besar.
              </p>
            </AccordionContent>
          </div>
        </AccordionPanel>

        <AccordionPanel>
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <AccordionTitle>Profil Dusun</AccordionTitle>
            <AccordionContent>
              <p className="text-gray-700">
                Profil Dusun untuk mengatur sejarah dusun, visi, dan misi dusun,
                menjelaskan tujuan dan arah masa depan.
              </p>
            </AccordionContent>
          </div>
        </AccordionPanel>

        <AccordionPanel>
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <AccordionTitle>Berita</AccordionTitle>
            <AccordionContent>
              <p className="text-gray-700">
                Berita untuk menambah, mengedit, menghapus berita tentang dusun,
                seperti pengumuman atau update terbaru.
              </p>
            </AccordionContent>
          </div>
        </AccordionPanel>

        <AccordionPanel>
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <AccordionTitle>UMKM</AccordionTitle>
            <AccordionContent>
              <p className="text-gray-700">
                UMKM untuk menambah, mengedit, menghapus UMKM tentang dusun,
                seperti daftar usaha kecil di wilayah tersebut.
              </p>
            </AccordionContent>
          </div>
        </AccordionPanel>

        <AccordionPanel>
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <AccordionTitle>Galeri</AccordionTitle>
            <AccordionContent>
              <p className="text-gray-700">
                Galeri untuk menambah, menghapus foto-foto tentang dusun,
                seperti gambar kegiatan atau pemandangan.
              </p>
            </AccordionContent>
          </div>
        </AccordionPanel>
      </Accordion>
    </div>
  );
}
