"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu } from "lucide-react";
import { useLanguage, useT } from "@/contexts/LanguageContext";
import { LangCode } from "@/lib/translations";

const langOptions: LangCode[] = ["EN" as unknown as LangCode, "SO" as unknown as LangCode, "DE" as unknown as LangCode];
const LANGS: { code: LangCode; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "so", label: "SO" },
  { code: "de", label: "DE" },
];

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const t = useT();

  const nav = [
    { label: t.overview,  href: "/" },
    { label: t.analytics, href: "#" },
    { label: t.history,   href: "#" },
  ];

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
            {t.appName}
          </span>
          <span
            className="text-[10px] leading-tight mt-0.5"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
          >
            {t.aiMonitoring}
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
          {LANGS.map((l, i) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="px-3 py-1.5 text-[11px] transition-colors"
              style={{
                fontFamily: "var(--font-dm-mono)",
                color: lang === l.code ? "#fff" : "var(--text-muted)",
                background: lang === l.code ? "var(--magenta)" : "transparent",
                borderRight: i < LANGS.length - 1 ? "1px solid var(--border2)" : "none",
              }}
            >
              {l.label}
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
