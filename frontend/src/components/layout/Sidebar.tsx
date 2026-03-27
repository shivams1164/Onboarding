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
        <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-30 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-4 md:justify-center">
          <h1 className="text-xl font-bold">HRMS</h1>
          <button onClick={onClose} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
