"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerData, setHeaderData] = useState({
    logoUrl: "/next.svg",
    title: "Dusun Gatak 1",
    subtitle: "Kalurahan Ngestirejo",
  });
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchHeaderData = async () => {
      const headerDoc = await getDoc(doc(db, "siteConfig", "header"));
      if (headerDoc.exists()) {
        setHeaderData(headerDoc.data());
      }
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
    <Navbar
      fluid
      rounded
      className={`z-10 fixed w-full transition-all duration-300 px-4 sm:px-6 lg:px-8 ${
        isScrolled ? "bg-white shadow-md dark:bg-gray-800" : "bg-transparent"
      }`}
    >
      <NavbarBrand
        as={Link}
        href="https://gatak1.web.id"
        className="text-2xl font-semibold"
      >
        <Image
          src={headerData.logoUrl}
          height={40}
          width={80}
          className="mr-3 h-6 sm:h-9"
          alt="Gatak 1 Logo"
        />
        <div className="flex dark:text-white flex-col">
          <span>{headerData.title}</span>
          <span className="text-sm font-light">{headerData.subtitle}</span>
        </div>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink
          as={Link}
          href="/"
          active={pathname === "/"}
          className="text-xl"
        >
          Home
        </NavbarLink>
        <NavbarLink
          as={Link}
          href="/profil-dusun"
          active={pathname === "/profil-dusun"}
          className="text-xl"
        >
          Profil Dusun
        </NavbarLink>
        <NavbarLink
          as={Link}
          href="/berita"
          active={pathname === "/berita"}
          className="text-xl"
        >
          Berita
        </NavbarLink>
        <NavbarLink
          as={Link}
          href="/galeri"
          active={pathname === "/galeri"}
          className="text-xl"
        >
          Galeri
        </NavbarLink>
        <NavbarLink
          as={Link}
          href="/umkm"
          active={pathname === "/umkm"}
          className="text-xl"
        >
          UMKM
        </NavbarLink>
        {!loading && !user && (
          <NavbarLink
            as={Link}
            href="/login"
            active={pathname === "/login"}
            className="text-xl"
          >
            Login
          </NavbarLink>
        )}
        {!loading && user && (
          <NavbarLink as={Link} href="/admin" className="text-xl">
            Dashboard
          </NavbarLink>
        )}
        {!loading && user && (
          <NavbarLink as="button" onClick={handleLogout} className="text-xl">
            Logout
          </NavbarLink>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}
