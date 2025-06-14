"use client";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function Berita() {
  const [newsItems, setNewsItems] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const newsDatas = await getDocs(collection(db, "news"));

        setNewsItems(
          newsDatas.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        console.error("Failed to fetch data: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = newsItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
              Berita Padukuhan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
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
            {/* untuk tombol pagination taruh sini */}
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
    </div>
  );
}
