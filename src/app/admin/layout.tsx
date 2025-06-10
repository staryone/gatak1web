"use client";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import {
  HiHome,
  HiPhotograph,
  HiDocumentText,
  HiUser,
  HiArrowSmRight,
  HiShoppingBag,
  HiMenuAlt2,
} from "react-icons/hi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleOutsideClick = (e) => {
    if (isOpen && !e.target.closest(".sidebar")) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="flex min-h-screen bg-gray-100 dark:bg-gray-900"
      onClick={handleOutsideClick}
    >
      <button
        className={`md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md transition-opacity duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={() => setIsOpen(true)}
      >
        <HiMenuAlt2 size={24} />
      </button>
      <Sidebar
        className={`sidebar fixed w-64 h-screen bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem as={Link} href="/" className="text-lg">
              <Image src="/next.svg" alt="" width={400} height={200} />
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin"
              icon={HiHome}
              active={pathname === "/admin"}
              className="text-lg"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/header"
              icon={HiDocumentText}
              active={pathname === "/admin/header"}
              className="text-lg"
              onClick={() => setIsOpen(false)}
            >
              Header
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/hero"
              icon={HiPhotograph}
              active={pathname === "/admin/hero"}
              className="text-lg"
              onClick={() => setIsOpen(false)}
            >
              Hero
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/about"
              icon={HiDocumentText}
              active={pathname === "/admin/about"}
              className="text-lg"
              onClick={() => setIsOpen(false)}
            >
              Tentang Dusun
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/profil-dusun"
              icon={HiUser}
              active={pathname === "/admin/profil-dusun"}
              className="text-lg"
              onClick={() => setIsOpen(false)}
            >
              Profil Dusun
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/news"
              icon={HiDocumentText}
              active={pathname === "/admin/news"}
              className="text-lg"
              onClick={() => setIsOpen(false)}
            >
              Berita
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/umkm"
              icon={HiShoppingBag}
              active={pathname === "/admin/umkm"}
              className="text-lg"
              onClick={() => setIsOpen(false)}
            >
              UMKM
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/gallery"
              icon={HiPhotograph}
              active={pathname === "/admin/gallery"}
              className="text-lg"
              onClick={() => setIsOpen(false)}
            >
              Galeri
            </SidebarItem>
            <SidebarItem
              as="button"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              icon={HiArrowSmRight}
              className="text-lg"
            >
              Logout
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>
      <div
        className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
          isOpen ? "ml-0" : "md:ml-64"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
