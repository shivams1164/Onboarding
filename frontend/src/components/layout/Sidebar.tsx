// Layout component: Sidebar
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Home, X } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/employees", label: "Employees", icon: Users },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-[2px] md:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-30 flex h-screen w-[82vw] max-w-xs flex-col bg-gray-900 text-white shadow-2xl transition-transform duration-300 md:relative md:translate-x-0 dark:bg-gray-950 md:w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-4 md:justify-center dark:border-gray-700">
          <h1 className="text-xl font-bold">HRMS</h1>
          <button onClick={onClose} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4 pb-6">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};
