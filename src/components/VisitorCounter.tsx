"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function VisitorCounter() {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [dailyVisitors, setDailyVisitors] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const visitorRef = doc(db, "visitors", "stats");
    const today = new Date().toISOString().split("T")[0];

    const fetchAndUpdate = async () => {
      const snap = await getDoc(visitorRef);
      let total = 0,
        daily = 0;

      if (snap.exists()) {
        const data = snap.data();
        total = data.total || 0;
        daily = data[today] || 0;
      }

      if (!sessionStorage.getItem("visited")) {
        await updateDoc(visitorRef, {
          total: total + 1,
          [today]: daily + 1,
          lastVisit: today,
        });
        sessionStorage.setItem("visited", "true");
        setTotalVisitors(total + 1);
        setDailyVisitors(daily + 1);
      } else {
        setTotalVisitors(total);
        setDailyVisitors(daily);
      }
    };

    fetchAndUpdate();
  }, []);

  return (
    <div className={`fixed bottom-6 left-6 ${poppins.className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:block bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-2xl flex flex-col gap-2 mt-2 md:mt-0`}
        style={{ minWidth: "200px" }}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a2 2 0 00-2-2h-3m-6 4H6v-2a2 2 0 012-2h3m-3-4H6V8a2 2 0 012-2h3m6 4h5V8a2 2 0 00-2-2h-3m-6 4H6"
            />
          </svg>
          <p className="text-sm font-semibold">
            Total Pengunjung: <span className="font-bold">{totalVisitors}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm font-semibold">
            Pengunjung Hari Ini:{" "}
            <span className="font-bold">{dailyVisitors}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
