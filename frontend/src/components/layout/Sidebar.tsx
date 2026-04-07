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
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-[2px] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 flex h-dvh w-[82vw] max-w-xs flex-col bg-gray-900 text-white shadow-2xl transition-transform duration-300 dark:bg-gray-950 md:w-64 md:border-r md:border-gray-800 md:shadow-none md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex min-h-[96px] items-center justify-between border-b border-gray-800 px-4 py-4 md:justify-start md:px-6 dark:border-gray-700">
          <h1 className="text-xl font-bold tracking-wide">HRMS</h1>
          <button onClick={onClose} className="min-h-11 min-w-11 rounded-lg md:hidden" aria-label="Close menu">
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
                className={`flex min-h-11 items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
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
