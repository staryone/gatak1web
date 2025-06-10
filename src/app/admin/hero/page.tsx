"use client";

import { Button, Label, TextInput, FileInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";

export default function HeroManagement() {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image);
      }
      await setDoc(doc(db, "siteConfig", "hero"), {
        imageUrl,
        title,
        subtitle,
        description,
      });
      setSuccess("Hero updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update hero.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Kelola Hero
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="image" className="text-gray-900 dark:text-white" />
          <FileInput
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="title" className="text-gray-900 dark:text-white" />
          <TextInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul hero"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="subtitle" className="text-gray-900 dark:text-white" />
          <TextInput
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Masukkan subjudul hero"
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
            placeholder="Masukkan deskripsi hero"
            className="mt-1"
            rows={6}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <Button type="submit" color="blue" className="w-full">
          Simpan
        </Button>
      </form>
    </div>
  );
}
