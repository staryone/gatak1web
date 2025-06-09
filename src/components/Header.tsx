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
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
          src="/next.svg"
          height={40}
          width={80}
          className="mr-3 h-6 sm:h-9"
          alt="Gatak 1 Logo"
        />
        <div className="flex dark:text-white flex-col">
          <span>Dusun Gatak 1</span>
          <span className="text-sm font-light">Kalurahan Ngestirejo</span>
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
          <NavbarLink as="button" onClick={handleLogout} className="text-xl">
            Logout
          </NavbarLink>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}
