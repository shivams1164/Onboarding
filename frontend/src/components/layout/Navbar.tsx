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
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3 px-3 py-3 md:px-6">
        {/* Mobile menu button */}
        <button onClick={onMenuClick} className="md:hidden shrink-0 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" aria-label="Open menu">
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
          onClick={toggleTheme}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </div>
  );
};
