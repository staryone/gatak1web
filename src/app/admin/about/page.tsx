"use client";

import { Button, Label, Textarea } from "flowbite-react";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AboutManagement() {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await setDoc(doc(db, "siteConfig", "about"), { content });
      setSuccess("About content updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update about content.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Kelola Tentang Dusun
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="content" className="text-gray-900 dark:text-white" />
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Masukkan konten tentang dusun"
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
