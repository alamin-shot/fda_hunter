'use client'
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemType {
  name: string;
  href: string;
}

const sidebarItems: SidebarItemType[] = [
  {
    name: "General",
    href: "/dashboard/settings",
  },
  {
    name: "Password",
    href: "/dashboard/settings/password",
  },
  {
    name: "Notifications",
    href: "/dashboard/settings/notification",
  } 
];

export default function SettingsSidebar() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string>("");

  useEffect(() => {
    if (!pathname) {
      setActiveItem("/dashboard/settings");
      return;
    }

    // Sort items by length (longest first) to ensure exact matches are checked first
    const sortedItems = [...sidebarItems].sort((a, b) => b.href.length - a.href.length);
    
    // Find the first exact match or startsWith match
    const matchingItem = sortedItems.find(item => 
      pathname === item.href || 
      (pathname.startsWith(item.href) && 
       (pathname === item.href || pathname.charAt(item.href.length) === '/'))
    );

    setActiveItem(matchingItem?.href || "/dashboard/settings");
  }, [pathname]);

  const isActiveItem = (itemHref: string) => {
    return activeItem === itemHref;
  };

  return (
    <div className="bg-[#0E121B] py-6 px-4 rounded-[24px] xl:min-w-58 h-full xl:min-h-[80vh]">
      <nav className="flex flex-row xl:flex-col gap-4 xl:gap-6 whitespace-nowrap overflow-x-auto scrollbar-hide">
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 py-2 px-3 rounded-lg transition-colors duration-200 ${
              isActiveItem(item.href)
                ? "bg-[#181B25] border border-[#323B49] text-white font-semibold text-sm"
                : "hover:bg-[#181B25] text-[#99A0AE]"
            }`}
          >
            <h3 className="text-base font-medium">{item.name}</h3>
          </Link>
        ))}
      </nav>
    </div>
  );
}
