"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { Poppins } from "next/font/google";
import toast from "react-hot-toast";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerData, setHeaderData] = useState<DocumentData>({
    logoUrl: "/logo.png",
    title: "Padukuhan Gatak 1",
    subtitle: "Kalurahan Ngestirejo",
  });
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const headerDoc = await getDoc(doc(db, "siteConfig", "header"));
        if (headerDoc.exists()) {
          setHeaderData(headerDoc.data());
        }
      } catch {
        toast.error("Error fetching data");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchHeaderData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("idToken");
      setLogoutModalOpen(false);
      toast.success("Berhasil logout");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`hidden lg:flex fixed w-full z-10 text-white transition-all duration-300 ${
          isScrolled || isLoadingData || pathname !== "/"
            ? "bg-green-700 shadow-md"
            : "bg-transparent"
        } ${poppins.className}`}
      >
        <div className="flex items-center justify-between px-6 py-2 w-full">
          <Link href="/" className="flex items-center">
            <Image src={headerData.logoUrl} height={40} width={40} alt="Logo" />
            <div className="ml-3">
              <span className="text-xl font-bold">{headerData.title}</span>
              <span className="block text-lg font-light">
                {headerData.subtitle}
              </span>
            </div>
          </Link>
          <div className="flex space-x-6">
            <Link
              href="/"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/" ? "underline decoration-3" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/profil"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/profil" ? "underline decoration-3" : ""
              }`}
            >
              Profil
            </Link>
            <Link
              href="/berita"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/berita" ? "underline decoration-3" : ""
              }`}
            >
              Berita
            </Link>
            <Link
              href="/galeri"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/galeri" ? "underline decoration-3" : ""
              }`}
            >
              Galeri
            </Link>
            <Link
              href="/umkm"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/umkm" ? "underline decoration-3" : ""
              }`}
            >
              UMKM
            </Link>
            {!loading && !user && (
              <Link
                href="/login"
                className={`hover:text-green-200 text-xl font-bold ${
                  pathname === "/login" ? "underline decoration-3" : ""
                }`}
              >
                Login
              </Link>
            )}
            {!loading && user && (
              <Link
                href="/admin"
                className="hover:text-green-200 text-xl font-bold"
              >
                Dashboard
              </Link>
            )}
            {!loading && user && (
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="hover:text-green-200 text-xl font-bold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
        className={`lg:hidden fixed w-full z-10 text-white transition-all duration-300 ${
          isScrolled || isMenuOpen || isLoadingData || pathname !== "/"
            ? "bg-green-700 shadow-md"
            : "bg-transparent"
        } ${poppins.className}`}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <Link href="/" className="flex items-center">
            <Image src={headerData.logoUrl} height={40} width={40} alt="Logo" />
            <div className="ml-3">
              <span className="text-lg font-bold">{headerData.title}</span>
              <span className="block text-sm font-light">
                {headerData.subtitle}
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden flex flex-col items-start px-4 py-2 space-y-2">
            <Link
              href="/"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/" ? "underline decoration-2" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/profil"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/profil" ? "underline decoration-2" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profil
            </Link>
            <Link
              href="/berita"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/berita" ? "underline decoration-2" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Berita
            </Link>
            <Link
              href="/galeri"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/galeri" ? "underline decoration-2" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Galeri
            </Link>
            <Link
              href="/umkm"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/umkm" ? "underline decoration-2" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              UMKM
            </Link>
            {!loading && !user && (
              <Link
                href="/login"
                className={`hover:text-green-200 text-xl font-bold ${
                  pathname === "/login" ? "underline decoration-2" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
            {!loading && user && (
              <Link
                href="/admin"
                className="hover:text-green-200 text-xl font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {!loading && user && (
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="hover:text-green-200 text-xl font-bold"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

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
    </>
  );
}
