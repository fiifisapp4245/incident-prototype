"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu } from "lucide-react";

const nav = [
  { label: "Overview", href: "/" },
  { label: "Analytics", href: "#" },
  { label: "History", href: "#" },
];

const langs = ["EN", "SO", "DE"];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-stretch"
      style={{
        background: "rgba(10,10,15,0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Logo block */}
      <div
        className="flex items-center gap-4 px-8 shrink-0"
        style={{ borderRight: "1px solid var(--border)" }}
      >
        <div
          className="w-10 h-10 rounded flex items-center justify-center font-bold text-white text-xl select-none shrink-0"
          style={{ background: "var(--magenta)", fontFamily: "var(--font-syne)", fontWeight: 800 }}
        >
          T
        </div>
        <div className="flex flex-col leading-none">
          <span
            className="text-[15px] text-white leading-tight"
            style={{ fontFamily: "var(--font-syne)", fontWeight: 700 }}
          >
            Incident Perceptor
          </span>
          <span
            className="text-[10px] leading-tight mt-0.5"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
          >
            AI-Enhanced Monitoring
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-stretch gap-0 px-6">
        {nav.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" || pathname.startsWith("/incident") : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex items-center px-6 text-[13px] transition-colors"
              style={{
                fontFamily: "var(--font-dm-mono)",
                color: isActive ? "var(--text)" : "var(--text-muted)",
              }}
            >
              {item.label}
              {/* Active bottom bar */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-6 right-6 h-[2px] rounded-t"
                  style={{ background: "var(--magenta)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right side */}
      <div
        className="ml-auto flex items-center gap-2 px-8"
        style={{ borderLeft: "1px solid var(--border)" }}
      >
        {/* Language switcher */}
        <div
          className="flex items-center rounded overflow-hidden mr-3"
          style={{ border: "1px solid var(--border2)" }}
        >
          {langs.map((lang, i) => (
            <button
              key={lang}
              className="px-3 py-1.5 text-[11px] transition-colors"
              style={{
                fontFamily: "var(--font-dm-mono)",
                color: lang === "EN" ? "#fff" : "var(--text-muted)",
                background: lang === "EN" ? "var(--magenta)" : "transparent",
                borderRight: i < langs.length - 1 ? "1px solid var(--border2)" : "none",
              }}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* User icon */}
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
          style={{ border: "1px solid var(--border2)" }}
        >
          <User size={16} style={{ color: "var(--text-muted)" }} />
        </button>

        {/* Menu icon */}
        <button
          className="w-9 h-9 rounded flex items-center justify-center transition-colors hover:bg-white/5 ml-1"
        >
          <Menu size={16} style={{ color: "var(--text-muted)" }} />
        </button>
      </div>
    </header>
  );
}
