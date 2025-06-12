"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerData, setHeaderData] = useState({
    logoUrl: "/next.svg",
    title: "Dusun Gatak 1",
    subtitle: "Kalurahan Ngestirejo",
  });
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
      const headerDoc = await getDoc(doc(db, "siteConfig", "header"));
      if (headerDoc.exists()) setHeaderData(headerDoc.data());
    };
    fetchHeaderData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("idToken");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`hidden lg:flex fixed w-full z-10 text-white transition-all duration-300 ${
          isScrolled ? "bg-green-700 shadow-md" : "bg-transparent"
        } ${poppins.className}`}
      >
        <div className="flex items-center justify-between px-6 py-2 w-full">
          <div className="flex items-center">
            <Image src={headerData.logoUrl} height={40} width={40} alt="Logo" />
            <div className="ml-3">
              <span className="text-xl font-bold">{headerData.title}</span>
              <span className="block text-lg font-light">
                {headerData.subtitle}
              </span>
            </div>
          </div>
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
              href="/profil-dusun"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/profil-dusun" ? "underline decoration-3" : ""
              }`}
            >
              Profil Dusun
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
                onClick={handleLogout}
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
          isScrolled || isMenuOpen ? "bg-green-700 shadow-md" : "bg-transparent"
        } ${poppins.className}`}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <Image src={headerData.logoUrl} height={40} width={40} alt="Logo" />
            <div className="ml-3">
              <span className="text-xl font-bold">{headerData.title}</span>
              <span className="block text-lg font-light">
                {headerData.subtitle}
              </span>
            </div>
          </div>
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
              href="/profil-dusun"
              className={`hover:text-green-200 text-xl font-bold ${
                pathname === "/profil-dusun" ? "underline decoration-2" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profil Dusun
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
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="hover:text-green-200 text-xl font-bold"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
