"use client";

import {
  Button,
  Label,
  TextInput,
  Textarea,
  Card,
  FileInput,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import Image from "next/image";

export default function NewsManagement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const querySnapshot = await getDocs(collection(db, "news"));
      setNews(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchNews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `news/news-image-${Date.now()}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }
      await addDoc(collection(db, "news"), {
        title,
        description,
        imageUrl,
        author: "Admin",
        date: new Date().toISOString().split("T")[0],
      });
      setSuccess("News post added successfully!");
      setTitle("");
      setDescription("");
      setImage(null);
      const querySnapshot = await getDocs(collection(db, "news"));
      setNews(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err: any) {
      setError(err.message || "Failed to add news post.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "news", id));
      setNews(news.filter((item) => item.id !== id));
      setSuccess("News post deleted successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to delete news post.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Kelola Berita
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <Label htmlFor="title" className="text-gray-900 dark:text-white" />
          <TextInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul berita"
            className="mt-1"
          />
        </div>
        <div>
          <Label
            htmlFor="description"
            className="text-gray-900 dark:text-white"
          />
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Masukkan deskripsi berita"
            className="mt-1"
            rows={6}
          />
        </div>
        <div>
          <Label htmlFor="image" className="text-gray-900 dark:text-white" />
          <FileInput
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <Button type="submit" color="blue" className="w-full">
          Tambah Berita
        </Button>
      </form>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Daftar Berita
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <Card key={item.id} className="h-[350px] flex flex-col">
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={400}
                height={200}
                className="object-cover w-full h-40"
              />
            )}
            <div className="p-4 flex flex-col flex-grow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h4>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-grow">
                {item.description}
              </p>
              <div className="flex items-center justify-between text-gray-500 text-xs mt-auto">
                <span>{item.author}</span>
                <span>{item.date}</span>
              </div>
              <Button
                color="red"
                size="sm"
                className="mt-2"
                onClick={() => handleDelete(item.id)}
              >
                Hapus
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
