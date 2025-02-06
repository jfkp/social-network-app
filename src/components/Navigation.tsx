"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, PlusSquare, Search } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/create", icon: PlusSquare, label: "Create" },
    { href: `/profile/${user.uid}`, icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="max-w-2xl mx-auto flex justify-around py-3">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center ${
              pathname === href ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
} 