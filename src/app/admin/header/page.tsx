"use client";

import { Button, Label, TextInput, FileInput } from "flowbite-react";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";

export default function HeaderManagement() {
  const [logo, setLogo] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      let logoUrl = "";
      if (logo) {
        const logoRef = ref(storage, `header/logo-${Date.now()}`);
        await uploadBytes(logoRef, logo);
        logoUrl = await getDownloadURL(logoRef);
      }
      await setDoc(doc(db, "siteConfig", "header"), {
        logoUrl,
        title,
        subtitle,
      });
      setSuccess("Header updated successfully!");
    } catch {
      setError("Failed to update header.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Kelola Header
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="logo" className="text-gray-900 dark:text-white" />
          <FileInput
            id="logo"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="title" className="text-gray-900 dark:text-white" />
          <TextInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul header"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="subtitle" className="text-gray-900 dark:text-white" />
          <TextInput
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Masukkan subjudul header"
            className="mt-1"
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
