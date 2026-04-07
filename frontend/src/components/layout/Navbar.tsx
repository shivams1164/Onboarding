// Layout component: Navbar
"use client";
import React, { useState } from "react";
import { Search, Menu, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/FormElements";
import { useTheme } from "@/components/theme/ThemeProvider";

interface NavbarProps {
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-700 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="flex min-h-[96px] items-center gap-3 px-3 py-3 sm:px-4 md:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>

        {/* Search bar */}
        <div className="min-w-0 flex-1 md:mx-6 md:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <Input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 bg-gray-50 border-gray-300 focus:bg-white dark:bg-gray-800 dark:border-gray-600 dark:focus:bg-gray-800"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </div>
  );
};
