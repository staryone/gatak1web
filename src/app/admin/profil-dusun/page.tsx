"use client";

import {
  Button,
  Label,
  Textarea,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function SiteConfigManagement() {
  const [aboutContent, setAboutContent] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aboutRef = doc(db, "siteConfig", "about");
        const profilRef = doc(db, "siteConfig", "profil-dusun");
        const [aboutSnap, profilSnap] = await Promise.all([
          getDoc(aboutRef),
          getDoc(profilRef),
        ]);
        if (aboutSnap.exists()) {
          setAboutContent(aboutSnap.data().content || "");
        }
        if (profilSnap.exists()) {
          const data = profilSnap.data();
          setVision(data.vision || "");
          setMission(data.mission || "");
        }
      } catch (err: any) {
        toast.error(err.message || "Gagal memuat data.");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    try {
      await Promise.all([
        setDoc(doc(db, "siteConfig", "about"), { content: aboutContent }),
        setDoc(doc(db, "siteConfig", "profil-dusun"), { vision, mission }),
      ]);
      toast.success("Data berhasil diperbarui!");
      setModalOpen(false);
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || "Gagal memperbarui data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Kelola Profil Dusun
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Tentang Dusun
              </h3>
              <div>
                <Label
                  htmlFor="aboutContent"
                  className="text-gray-700 dark:text-gray-300 font-medium"
                />
                <Textarea
                  id="aboutContent"
                  value={aboutContent}
                  onChange={(e) => setAboutContent(e.target.value)}
                  placeholder="Masukkan konten tentang dusun"
                  className="mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  rows={6}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Visi dan Misi Dusun
              </h3>
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="vision"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  />
                  <Textarea
                    id="vision"
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    placeholder="Masukkan visi dusun"
                    className="mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="mission"
                    className="text-gray-700 dark:text-gray-300 font-medium"
                  />
                  <Textarea
                    id="mission"
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="Masukkan misi dusun"
                    className="mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={4}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              color="blue"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Semua"}
            </Button>
          </form>
        </div>

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
              Apakah Anda yakin ingin menyimpan perubahan?
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
