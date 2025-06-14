import Header from "@/components/Header";
import VisitorCounter from "@/components/VisitorCounter";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <VisitorCounter />
    </>
  );
}
