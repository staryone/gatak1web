"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Poppins } from "next/font/google";
import {
  HiHome,
  HiPhotograph,
  HiDocumentText,
  HiUser,
  HiArrowSmRight,
  HiShoppingBag,
  HiMenuAlt2,
} from "react-icons/hi";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLogoutModalOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen && !(e.target as Element).closest(".sidebar")) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 ${poppins.className}`}
      onClick={handleOutsideClick}
    >
      <button
        className={`md:hidden fixed top-4 left-4 z-50 p-3 bg-green-700 text-white rounded-md transition-opacity duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={() => setIsOpen(true)}
      >
        <HiMenuAlt2 size={24} />
      </button>
      <aside
        className={`sidebar fixed w-64 h-screen bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center">
            <Image src="/next.svg" alt="Logo" width={40} height={40} />
            <span className="ml-3 text-xl font-bold text-green-700 dark:text-green-300">
              Dusun Gatak 1
            </span>
          </Link>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className={`flex items-center p-3 text-xl font-semibold hover:bg-green-100 dark:hover:bg-gray-700 rounded ${
                  pathname === "/admin"
                    ? "bg-green-200 dark:bg-gray-600 text-green-800 dark:text-green-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <HiHome className="mr-3" size={24} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/header"
                className={`flex items-center p-3 text-xl font-semibold hover:bg-green-100 dark:hover:bg-gray-700 rounded ${
                  pathname === "/admin/header"
                    ? "bg-green-200 dark:bg-gray-600 text-green-800 dark:text-green-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <HiDocumentText className="mr-3" size={24} />
                Header
              </Link>
            </li>
            <li>
              <Link
                href="/admin/hero"
                className={`flex items-center p-3 text-xl font-semibold hover:bg-green-100 dark:hover:bg-gray-700 rounded ${
                  pathname === "/admin/hero"
                    ? "bg-green-200 dark:bg-gray-600 text-green-800 dark:text-green-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <HiPhotograph className="mr-3" size={24} />
                Hero
              </Link>
            </li>
            <li>
              <Link
                href="/admin/profil"
                className={`flex items-center p-3 text-xl font-semibold hover:bg-green-100 dark:hover:bg-gray-700 rounded ${
                  pathname === "/admin/profil"
                    ? "bg-green-200 dark:bg-gray-600 text-green-800 dark:text-green-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <HiUser className="mr-3" size={24} />
                Profil
              </Link>
            </li>
            <li>
              <Link
                href="/admin/berita"
                className={`flex items-center p-3 text-xl font-semibold hover:bg-green-100 dark:hover:bg-gray-700 rounded ${
                  pathname === "/admin/berita"
                    ? "bg-green-200 dark:bg-gray-600 text-green-800 dark:text-green-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <HiDocumentText className="mr-3" size={24} />
                Berita
              </Link>
            </li>
            <li>
              <Link
                href="/admin/umkm"
                className={`flex items-center p-3 text-xl font-semibold hover:bg-green-100 dark:hover:bg-gray-700 rounded ${
                  pathname === "/admin/umkm"
                    ? "bg-green-200 dark:bg-gray-600 text-green-800 dark:text-green-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <HiShoppingBag className="mr-3" size={24} />
                UMKM
              </Link>
            </li>
            <li>
              <Link
                href="/admin/gallery"
                className={`flex items-center p-3 text-xl font-semibold hover:bg-green-100 dark:hover:bg-gray-700 rounded ${
                  pathname === "/admin/gallery"
                    ? "bg-green-200 dark:bg-gray-600 text-green-800 dark:text-green-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <HiPhotograph className="mr-3" size={24} />
                Galeri
              </Link>
            </li>
            <li>
              <button
                onClick={() => setLogoutModalOpen(true)}
                className={`flex items-center p-3 w-full text-xl font-semibold hover:bg-green-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300`}
              >
                <HiArrowSmRight className="mr-3" size={24} />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main
        className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
          isOpen ? "ml-0" : "md:ml-64"
        }`}
      >
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          logoutModalOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setLogoutModalOpen(false)}
        ></div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto z-10">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Konfirmasi Logout
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-xl mb-6">
            Apakah Anda yakin ingin keluar?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-xl font-semibold transition duration-300"
            >
              Ya, Keluar
            </button>
            <button
              onClick={() => setLogoutModalOpen(false)}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 text-xl font-semibold"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
