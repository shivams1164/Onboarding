// Layout component: Main Layout wrapper
"use client";
import React, { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  onSearch?: (query: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true, onSearch }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-dvh bg-gray-50 dark:bg-gray-950">
      {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      <div className={`flex min-w-0 flex-1 flex-col ${showSidebar ? "md:pl-64" : ""}`}>
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} onSearch={onSearch} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto w-full max-w-7xl p-4 sm:p-5 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
