"use client";

import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch {
      setError("Login gagal. Periksa email atau password Anda.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
          Selamat Datang 👋
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Masuk ke akun Anda untuk mengakses Dusun Gatak 1
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            />
            <TextInput
              id="email"
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2"
              shadow
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            />
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2"
              shadow
            />
          </div>
          <Button
            type="submit"
            color="blue"
            className="w-full font-semibold text-base"
          >
            Masuk
          </Button>
        </form>
      </div>
    </div>
  );
}
