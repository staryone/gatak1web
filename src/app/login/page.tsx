"use client";

import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

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
    <div
      className={`flex items-center justify-center min-h-screen ${poppins.className}`}
    >
      <div className="relative w-full h-screen">
        <Image
          src="https://images.unsplash.com/photo-1671884424297-5a04eb26d1af?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3"
          alt="Background Image"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white bg-opacity-90 dark:bg-gray-900 rounded-2xl shadow-xl p-8 transition-all duration-300">
            <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-6">
              Selamat Datang 👋
            </h2>
            {error && (
              <p className="text-red-500 text-lg text-center mb-4">{error}</p>
            )}
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-xl">
              Masuk ke akun Anda untuk mengakses Dusun Gatak 1
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xl font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-xl font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2 w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 text-xl font-semibold transition duration-300"
              >
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
