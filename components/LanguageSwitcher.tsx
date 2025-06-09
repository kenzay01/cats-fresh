"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames } from "@/i18n/config";
import { useEffect } from "react";

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const pathname = usePathname();

  useEffect(() => {
    localStorage.setItem("preferredLocale", currentLocale);
    document.cookie = `preferredLocale=${currentLocale}; path=/; max-age=31536000`;
  }, [currentLocale]);

  const getLocalizedPath = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="relative inline-flex bg-cream border-2 border-[var(--color-forest-green)] rounded-md p-1 shadow-md">
      <div
        className={`absolute top-1.75 h-8 bg-[var(--color-lime-green)] rounded-md transition-all duration-300 ease-in-out ${
          currentLocale === locales[0]
            ? "left-1 w-12"
            : `left-[calc(50%+0.125rem)] w-12`
        }`}
      />
      {locales.map((locale) => (
        <Link
          key={locale}
          href={getLocalizedPath(locale)}
          className={`relative z-10 px-3 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
            locale === currentLocale
              ? "text-[var(--color-forest-green)]"
              : "text-[var(--color-lime-green)] hover:text-[var(--color-burnt-orange)]"
          }`}
        >
          {localeNames[locale]}
        </Link>
      ))}
    </div>
  );
}
