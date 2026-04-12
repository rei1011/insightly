"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "報酬一覧" },
  { href: "/ranking", label: "年収ランキング" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[var(--foreground)]/10 bg-white dark:bg-black">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-8 sm:px-16">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`py-4 text-sm font-medium transition-colors border-b-2 ${
                isActive
                  ? "border-[var(--foreground)] text-[var(--foreground)]"
                  : "border-transparent text-[var(--foreground)]/50 hover:text-[var(--foreground)]/80"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
