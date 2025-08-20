"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  WalletIcon,
  ChartBarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/home",
      icon: HomeIcon,
    },
    {
      name: "Transaksi",
      href: "/transactions",
      icon: WalletIcon,
    },
    {
      name: "Anggaran",
      href: "/budgets",
      icon: ChartBarIcon,
    },
    {
      name: "Profil",
      href: "/profile",
      icon: UserIcon,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
