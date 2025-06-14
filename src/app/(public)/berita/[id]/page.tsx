"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Poppins } from "next/font/google";
import { useParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function DetailBerita() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        if (!id) {
          return;
        }
        const newsRef = doc(db, "news", id as string);
        const newsSnap = await getDoc(newsRef);
        if (!newsSnap.exists()) {
          return;
        }
        const data = newsSnap.data();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setImageUrl(data.imageUrl || "");
        setAuthor(data.author || "Admin");
        setDate(data.date || new Date().toISOString().split("T")[0]);
        setViewCount(data.viewCount || 0);

        // Increment view count
        await updateDoc(newsRef, { viewCount: (data.viewCount || 0) + 1 });
      } catch {
        toast.error("Failed to fetch news");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  if (!id) return null;

  return (
    <div
      className={`flex items-center justify-center min-h-screen min-w-screen bg-green-50 ${poppins.className}`}
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
              {title || "Berita not found"}
            </h1>
            <div className="flex items-center text-gray-600 text-sm mt-2">
              <span>{date || "unkown"}</span>
              <span className="mx-2">•</span>
              <span>Ditulis oleh {author || "unkown"}</span>
              <span className="mx-2">•</span>
              <span>Dilihat {viewCount} kali</span>
            </div>
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="mb-6 relative w-full h-64 rounded-lg overflow-hidden">
              <Image src={imageUrl} alt={title} fill className="object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="text-gray-700 text-lg leading-relaxed">
            {description || "Deskripsi not found."}
          </div>
        </div>
      )}
    </div>
  );
}
