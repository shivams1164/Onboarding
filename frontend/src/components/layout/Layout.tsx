// Layout component: Main Layout wrapper
"use client";
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  onSearch?: (query: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true, onSearch }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      <div className="flex flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} onSearch={onSearch} />

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
