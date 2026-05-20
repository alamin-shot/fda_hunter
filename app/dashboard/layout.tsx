"use client";
import React, { useState } from "react";
import { Urbanist } from "next/font/google";
import Sidebar from "@/_components/shared/Sidebar";
import Header from "@/_components/shared/Header";
import PrivateRoute from "@/_components/PrivateRoute";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <PrivateRoute>
      <div>
        <div className="flex h-dvh md:h-screen w-full overflow-y-hidden">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <div
            className={`
        flex-1 flex flex-col h-full min-h-0 min-w-0 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "md:ml-0" : "md:ml-0"}
      `}
          >
            <Header onMenuClick={() => setIsSidebarOpen(true)} />

            <main className="flex-1 overflow-auto min-w-0 min-h-0 p-6 bg-[#181a25]">
              {children}
            </main>
          </div>

          {/* Overlay with fade effect */}
          <div
            className={`
          fixed inset-0 bg-black transition-opacity duration-300 md:hidden
          ${isSidebarOpen ? "opacity-50 z-30" : "opacity-0 -z-10"}
        `}
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      </div>
    </PrivateRoute>
  );
}
