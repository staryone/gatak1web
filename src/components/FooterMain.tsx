"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function FooterMain() {
  return (
    <footer
      className={`w-full bg-green-700 text-white py-6 ${poppins.className}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="mb-4 md:mb-0">
          <p className="text-xl font-bold">&copy; Gatak 1™ 2025</p>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          <Link
            href="/profil"
            className="hover:text-green-200 text-xl font-bold"
          >
            Profil
          </Link>
          <Link
            href="/berita"
            className="hover:text-green-200 text-xl font-bold"
          >
            Berita
          </Link>
          <Link
            href="/galeri"
            className="hover:text-green-200 text-xl font-bold"
          >
            Galeri
          </Link>
          <Link
            href="/profil"
            className="hover:text-green-200 text-xl font-bold"
          >
            Kontak
          </Link>
        </div>
      </div>
    </footer>
  );
}
