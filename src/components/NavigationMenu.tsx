"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const navItems = [
  { href: "/", label: "Calendar" },
  { href: "/standings", label: "Standings" },
];

export default function NavigationMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentPageLabel = useMemo(() => {
    return navItems.find((item) => item.href === pathname)?.label ?? "Menu";
  }, [pathname]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-colors duration-200"
        style={{
          borderColor: "var(--border-subtle)",
          backgroundColor: "var(--bg-surface)",
          color: "var(--text-primary)",
        }}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        <span>{currentPageLabel}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-30 mt-2 w-44 rounded-lg border p-1 shadow-lg"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                style={{
                  color: isActive ? "white" : "var(--text-primary)",
                  backgroundColor: isActive ? "var(--accent-primary)" : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
