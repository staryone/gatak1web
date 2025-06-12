"use client";

import {
  Button,
  Label,
  TextInput,
  FileInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";

export default function HeaderManagement() {
  const [logo, setLogo] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPublicId, setLogoPublicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const docRef = doc(db, "siteConfig", "header");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setSubtitle(data.subtitle || "");
          setLogoUrl(data.logoUrl || "");
          setLogoPublicId(data.logoPublicId || "");
        }
      } catch (err: any) {
        toast.error(err.message || "Gagal memuat data header.");
      }
    };
    fetchHeaderData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    try {
      let newLogoUrl = logoUrl;
      let newLogoPublicId = logoPublicId;
      if (logo) {
        if (logoPublicId) {
          await fetch("/api/cloudinary/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId: logoPublicId }),
          });
        }
        newLogoUrl = await uploadImage(logo);
        newLogoPublicId = newLogoUrl.split("/").pop()?.split(".")[0] || "";
      }
      await setDoc(doc(db, "siteConfig", "header"), {
        logoUrl: newLogoUrl,
        logoPublicId: newLogoPublicId,
        title,
        subtitle,
      });
      toast.success("Header berhasil diperbarui!");
      setLogo(null);
      setLogoUrl(newLogoUrl);
      setLogoPublicId(newLogoPublicId);
      setModalOpen(false);
    } catch (err: any) {
      console.error("Update header error:", err);
      toast.error(err.message || "Gagal memperbarui header.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Kelola Header
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="logo"
                className="text-gray-700 dark:text-gray-300 font-medium"
              />
              {logoUrl && !logo && (
                <div className="mt-2 mb-4">
                  <Image
                    src={logoUrl}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
              <FileInput
                id="logo"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                className="mt-1 rounded-lg border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <Label
                htmlFor="title"
                className="text-gray-700 dark:text-gray-300 font-medium"
              />
              <TextInput
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul header"
                className="mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="subtitle"
                className="text-gray-700 dark:text-gray-300 font-medium"
              />
              <TextInput
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Masukkan subjudul header"
                className="mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <Button
              type="submit"
              color="blue"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </div>

        {/* Confirmation Modal */}
        <Modal
          show={modalOpen}
          onClose={() => setModalOpen(false)}
          size="md"
          popup
        >
          <ModalHeader className="text-xl font-semibold text-gray-900 dark:text-white">
            Konfirmasi Simpan
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-300">
              Apakah Anda yakin ingin menyimpan perubahan pada header?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="blue"
              onClick={confirmSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? "Menyimpan..." : "Ya, Simpan"}
            </Button>
            <Button
              color="gray"
              onClick={() => setModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
