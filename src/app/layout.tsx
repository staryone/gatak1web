import type { Metadata } from "next";
import "./globals.css";
import FooterMain from "@/components/FooterMain";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Website Dusun Gatak 1",
  description: "Website profil dusun gatak 1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={poppins.className}>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: poppins.style.fontFamily,
                fontSize: "1.2rem", // Equivalent to text-xl
                fontWeight: "normal",
              },
            }}
          />
          {children}
          <FooterMain />
        </AuthProvider>
      </body>
    </html>
  );
}
