// Layout component: Navbar
"use client";
import React, { useState } from "react";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/FormElements";

interface NavbarProps {
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Mobile menu button */}
        <button onClick={onMenuClick} className="md:hidden text-gray-600 hover:text-gray-900">
          <Menu size={24} />
        </button>

        {/* Search bar */}
        <div className="flex-1 mx-4 md:mx-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 bg-gray-50 border-gray-300 focus:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
