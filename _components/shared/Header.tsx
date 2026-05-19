import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import profileImg from '@/public/profilePic.png'
import MessageIcon from "../icons/header/MessageIcon";
import DropdowonIcon from "../icons/header/DropdownIcon";
import PrivateRoute from "../PrivateRoute";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
 

    const routeToTitle: { [key: string]: string } = {
    "/dashboard": "Overview",
    "/dashboard/predictions": "Predictions",
    "/dashboard/subscriptions": "Subscriptions",
    '/dashboard/users':"Users",
    "/dashboard/settings": "Settings",
  };
  
   // Dynamically change the title based on the base route
  const pageTitle: string = routeToTitle[pathname] || "Dashboard"; // Default to "Dashboard"

 
  const isNotificationActive = pathname === "/dashboard/notification" || 
                              pathname.startsWith("/dashboard/notification/");

  return (
    <PrivateRoute>
      <header className="bg-[#181a25]  ">
        <div className="flex items-center justify-between py-5.5 px-6 border-b border-[#323B49]">
          {/* left content  */}
          <div className=" flex items-center gap-4">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 md:hidden cursor-pointer"
              onClick={onMenuClick}
            >
              <Menu />
            </button>
            <h2 className=" text-white text-2xl font-semibold cursor-pointer">
          {pageTitle}
            </h2>
          </div>
         {/* right content */}
          <div className=" flex items-center gap-4">
            <MessageIcon/>
            <div className=" flex items-center gap-2">
                <Image src={profileImg} alt="profile img"/>
              <DropdowonIcon/>
            </div>
          </div>
        </div>
      </header>
    </PrivateRoute>
  );
}
