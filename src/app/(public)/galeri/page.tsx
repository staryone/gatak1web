"use client";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function Galeri() {
  const [galeriItems, setGaleriItems] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<DocumentData | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const galeriDatas = await getDocs(collection(db, "gallery"));
        setGaleriItems(
          galeriDatas.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        console.error("Failed to fetch data: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(galeriItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = galeriItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openModal = (item: DocumentData) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className={`flex flex-col justify-center min-h-screen bg-green-50 ${poppins.className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-[80vh] bg-green-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
        </div>
      ) : (
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto mt-12">
            <h2 className="text-4xl font-bold text-green-700 mb-6">
              Galeri Padukuhan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openModal(item)}
                    className="cursor-pointer"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-lg shadow"
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-xl">
                  Belum ada data tersedia
                </p>
              )}
            </div>
            {totalPages > 0 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-700 text-white hover:bg-green-800"
                  }`}
                >
                  Sebelum
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-green-700 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-700 text-white hover:bg-green-800"
                  }`}
                >
                  Sesudah
                </button>
              </div>
            )}
          </div>
        </section>
      )}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div className="relative bg-white rounded-lg p-4 max-w-3xl w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                className="w-6 h-6 font-extrabold text-red-600 bg-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={800}
              height={600}
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
