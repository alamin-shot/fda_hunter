// components/searchbar.tsx
"use client";

import { cn } from "@/lib/utils";
import SearchIcon from "../icons/common/SearchIcon";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  className = "",
  size = "md",
  disabled = false,
}: SearchBarProps) {
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10",
    lg: "h-12 text-lg",
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <button
        onClick={handleSearchClick}
        disabled={disabled}
        className="absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-400"
        type="button"
      >
        <SearchIcon className="h-4 w-4" />
      </button>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border border-[#687588] bg-transparent px-5 py-6 text-white",
          "placeholder:text-[#fff]",
          "focus:border-[#00F474] focus:outline-none focus:ring-1 focus:ring-[#00F474]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}
