// sidebar.tsx (updated)
import React, { useState } from "react";
import Link from "next/link";
import { X, Users } from "lucide-react";
import Image from "next/image";
import logo from "@/public/sideber/images/logo.png";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DashboardIcon from "../icons/sidebar/DashboardIcon";
import StaticsIcon from "../icons/sidebar/StaticsIcon";
import WalletIcon from "../icons/sidebar/WalletIcon";
import UsersIcon from "../icons/sidebar/UsersIcon";
import SettingsIcon from "../icons/sidebar/SettingsIcon";
import LogoutIcon from "../icons/sidebar/LogoutIcon";
 
import { useAuth } from "@/context/AuthContext";
import LogoutConfirmation from "../LogOutConfirmation";
import PrivateRoute from "../PrivateRoute";

const menuItems = [
  { title: "Dashboard", icon: DashboardIcon, href: "/dashboard" },
  { title: "Predictions", icon: StaticsIcon, href: "/dashboard/predictions" },
  {
    title: "Subscriptions",
    icon: WalletIcon,
    href: "/dashboard/subscriptions",
  },
  {
    title: "Users",
    icon: UsersIcon,
    href: "/dashboard/users",
  },
];

// Define sub-items for each main menu item if needed
const subItems: Record<string, any[]> = {
  Dashboard: [],
  "Order List": [
    { path: "/dashboard/order-list/sub-item1" },
    { path: "/dashboard/order-list/sub-item2" },
  ],
  "Order Management": [
    { path: "/dashboard/order-management/sub-item1" },
    { path: "/dashboard/order-management/sub-item2" },
  ],
  "Test Management": [
    { path: "/dashboard/test-management/sub-item1" },
    { path: "/dashboard/test-management/sub-item2" },
  ],
  Payments: [
    { path: "/dashboard/payments/sub-item1" },
    { path: "/dashboard/payments/sub-item2" },
  ],
  Analytics: [
    { path: "/dashboard/analytics/sub-item1" },
    { path: "/dashboard/analytics/sub-item2" },
  ],
};

// Bottom menu items
const bottomMenuItems = [
  { title: "Settings", icon: SettingsIcon, href: "/dashboard/settings" },
  { title: "Logout", icon: LogoutIcon, href: "#", isAction: true },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();

  const isMenuItemActive = (itemHref: string) => {
    if (itemHref === "/dashboard") {
      // For dashboard, only match exact path or with trailing slash
      return pathname === "/dashboard" || pathname === "/dashboard/";
    } else {
      // For other items, match if pathname starts with the href
      return pathname.startsWith(itemHref);
    }
  };

  const isActiveParent = (parentPath: string) => {
    if (pathname === parentPath) return true;

    // Find the menu item by path
    const menuItem = menuItems.find((item) => item.href === parentPath);
    if (!menuItem) return false;

    const menuName = menuItem.title;
    const subPaths = subItems[menuName];

    if (!subPaths || subPaths.length === 0) return false;

    // If the value is an object, flatten all inner arrays
    const flatSubPaths = Array.isArray(subPaths)
      ? subPaths
      : Object.values(subPaths).flat();

    return flatSubPaths.some(
      (sub: any) =>
        pathname.startsWith(`${sub.path}`) || pathname.includes(sub.path)
    );
  };

  // Combined active check - checks both direct match and sub-items
  const isItemActive = (itemHref: string, itemTitle: string) => {
    return isMenuItemActive(itemHref) || isActiveParent(itemHref);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    onClose(); // Close sidebar on mobile
  };

  const handleConfirmLogout = async () => {
    try {
      setShowLogoutModal(false);
      await logout(); // Call the logout function from AuthContext
      // Note: The logout function already handles redirection and localStorage cleanup
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleBottomItemClick = (item: (typeof bottomMenuItems)[0]) => {
    if (item.isAction && item.title === "Logout") {
      handleLogoutClick();
      return;
    }
    onClose(); // Close sidebar on mobile after clicking
  };

  return (
     
    <PrivateRoute>

      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
          w-65 flex flex-col bg-[#181a25] border-r border-[#323B49]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-5 px-6 border-b border-[#323B49]">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="cursor-pointer" onClick={onClose}>
              <h1 className="text-3xl font-bold text-white">LOGO</h1>
            </Link>
          </div>

          {/* Close (mobile only) */}
          <button
            className="p-2 rounded-lg hover:bg-gray-700 md:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="text-white" />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="grow overflow-y-auto pt-10">
          <div className="px-2 space-y-3">
            {menuItems.map((item, index) => {
              const isActive = isItemActive(item.href, item.title);
              const isHovered = hoveredItem === item.title;

              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredItem(item.title)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`group flex items-center py-3 px-4 gap-3 rounded-xl transition-all duration-200 text-base hover:bg-[#00F474]/70 ${
                    isActive ? "bg-[#00F474]" : ""
                  }`}
                >
                  <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                    <item.icon active={isActive || isHovered} />
                  </div>
                  <h3
                    className={`font-medium overflow-hidden whitespace-nowrap inline-block text-base font-sans group-hover:text-[#1D1F2C] ${
                      isActive ? "text-[#1D1F2C] font-medium" : "text-[#E9E9EA]"
                    }`}
                  >
                    {item.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom items - Settings and Logout */}
        <div className="mt-auto pt-3 space-y-3 px-2 pb-10">
          {bottomMenuItems.map((item, index) => {
            const isActive =
              !item.isAction && isItemActive(item.href, item.title);
            const isHovered = hoveredItem === item.title;

            if (item.isAction) {
              // Render as button for actions like Logout
              return (
                <button
                  key={index}
                  onClick={() => handleBottomItemClick(item)}
                  onMouseEnter={() => setHoveredItem(item.title)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`group flex items-center py-3 px-4 gap-3 rounded-xl transition-all duration-200 text-base hover:bg-[#00F474]/70 w-full ${
                    isActive ? "bg-[#00F474]" : ""
                  }`}
                >
                  <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                    <item.icon active={isHovered} />
                  </div>
                  <h3
                    className={`font-medium overflow-hidden whitespace-nowrap inline-block text-base font-sans group-hover:text-[#1D1F2C] ${
                      isHovered
                        ? "text-[#1D1F2C] font-medium"
                        : "text-[#E9E9EA]"
                    }`}
                  >
                    {item.title}
                  </h3>
                </button>
              );
            }

            // Render as link for navigation items
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => handleBottomItemClick(item)}
                onMouseEnter={() => setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`group flex items-center py-3 px-4 gap-3 rounded-xl transition-all duration-200 text-base hover:bg-[#00F474]/70 ${
                  isActive ? "bg-[#00F474]" : ""
                }`}
              >
                <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                  <item.icon active={isActive || isHovered} />
                </div>
                <h3
                  className={`font-medium overflow-hidden whitespace-nowrap inline-block text-base font-sans group-hover:text-[#1D1F2C] ${
                    isActive ? "text-[#1D1F2C] font-medium" : "text-[#E9E9EA]"
                  }`}
                >
                  {item.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </PrivateRoute>
  
  );
}
