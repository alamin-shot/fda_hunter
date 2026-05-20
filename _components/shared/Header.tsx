"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, ChevronDown, Settings, LogOut } from "lucide-react";
import profileImg from "@/public/profilePic.png";
import { dashboardApi } from "@/services/dashboardApi";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const routeToTitle: { [key: string]: string } = {
    "/dashboard": "Overview",
    "/dashboard/predictions": "Predictions",
    "/dashboard/subscriptions": "Subscriptions",
    "/dashboard/users": "Users",
    "/dashboard/settings": "Settings",
  };

  const pageTitle: string = routeToTitle[pathname] || "Dashboard";

  // Fetch profile for avatar
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await dashboardApi.getProfile();
        if (response.status && response.data.avatar) {
          setAvatar(response.data.avatar);
        }
      } catch {}
    };
    fetchProfile();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-[#181a25]">
      <div className="flex items-center justify-between py-5.5 px-6 border-b border-[#323B49]">
        {/* Left content */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden cursor-pointer"
            onClick={onMenuClick}
          >
            <Menu />
          </button>
          <h2 className="text-white text-2xl font-semibold cursor-pointer">
            {pageTitle}
          </h2>
        </div>

        {/* Right content */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="h-9 w-9 rounded-full overflow-hidden bg-[#323B49]">
                <Image
                  src={avatar || profileImg}
                  alt="profile"
                  width={36}
                  height={36}
                  className="object-cover"
                  unoptimized={!!avatar}
                />
              </div>
              <ChevronDown className="text-white w-4 h-4" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-[#1A1F2E] border border-[#323B49] rounded-lg shadow-xl z-50 py-2">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/dashboard/settings");
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white hover:bg-[#252a3a] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-[#252a3a] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
