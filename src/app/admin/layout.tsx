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
} from "react-icons/hi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar className="fixed w-64 h-screen bg-white dark:bg-gray-800 shadow-lg">
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem
              as={Link}
              href="/admin"
              icon={HiHome}
              active={pathname === "/admin"}
              className="text-lg"
            >
              Dashboard
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/header"
              icon={HiDocumentText}
              active={pathname === "/admin/header"}
              className="text-lg"
            >
              Header
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/hero"
              icon={HiPhotograph}
              active={pathname === "/admin/hero"}
              className="text-lg"
            >
              Hero
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/about"
              icon={HiDocumentText}
              active={pathname === "/admin/about"}
              className="text-lg"
            >
              Tentang Dusun
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/profil-dusun"
              icon={HiUser}
              active={pathname === "/admin/profil-dusun"}
              className="text-lg"
            >
              Profil Dusun
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/news"
              icon={HiDocumentText}
              active={pathname === "/admin/news"}
              className="text-lg"
            >
              Berita
            </SidebarItem>
            <SidebarItem
              as={Link}
              href="/admin/gallery"
              icon={HiPhotograph}
              active={pathname === "/admin/gallery"}
              className="text-lg"
            >
              Galeri
            </SidebarItem>
            <SidebarItem
              as="button"
              onClick={handleLogout}
              icon={HiArrowSmRight}
              className="text-lg"
            >
              Logout
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>
      <div className="flex-1 ml-64 p-6">{children}</div>
    </div>
  );
}
