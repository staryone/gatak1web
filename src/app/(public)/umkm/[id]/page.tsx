"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Poppins } from "next/font/google";
import { useParams } from "next/navigation";
import Image from "next/image";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function DetailUMKM() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        if (!id) {
          router.push("/not-found");
          return;
        }
        const umkmRef = doc(db, "umkm", id as string);
        const umkmSnap = await getDoc(umkmRef);
        if (!umkmSnap.exists()) {
          router.push("/not-found");
          return;
        }
        const data = umkmSnap.data();
        setName(data.name || "");
        setDescription(data.description || "");
        setPhone(data.phone || "");
        setSocialMedia(data.socialMedia || "");
        setImageUrl(data.imageUrl || "");
        setCreatedAt(data.createdAt || new Date().toISOString());
      } catch (err) {
        console.error("Failed to fetch UMKM:", err);
        router.push("/not-found");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, router]);

  if (!id) return null;

  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-green-50 ${poppins.className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-[80vh] bg-green-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
        </div>
      ) : (
        <div className="w-full mt-25 mb-10 max-w-4xl p-6 bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-green-700">
              {name || "UMKM Tidak Ditemukan"}
            </h1>
            <div className="flex items-center text-gray-600 text-sm mt-2">
              <span>
                {createdAt
                  ? new Date(createdAt).toLocaleDateString("id-ID")
                  : "Tanggal Tidak Diketahui"}
              </span>
            </div>
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="mb-6 relative w-full h-64 rounded-lg overflow-hidden">
              <Image src={imageUrl} alt={name} fill className="object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="text-gray-700 text-lg leading-relaxed">
            <p>{description || "Deskripsi tidak tersedia."}</p>
          </div>

          {/* Contact Info */}
          <div className="mt-6 text-gray-600 text-sm">
            <p>
              <span className="font-medium">Kontak:</span>{" "}
              {phone || "Tidak tersedia"}
            </p>
            <p>
              <span className="font-medium">Media Sosial:</span>{" "}
              {socialMedia || "Tidak tersedia"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
