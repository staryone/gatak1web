import type { Metadata } from "next";
import "./globals.css";
import { ThemeModeScript } from "flowbite-react";
import FooterMain from "@/components/FooterMain";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

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
      <head>
        <ThemeModeScript />
      </head>
      <body>
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
          <FooterMain />
        </AuthProvider>
      </body>
    </html>
  );
}
