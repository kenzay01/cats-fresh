"use client";

import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";

export default function NotFound() {
  const locale = useCurrentLanguage() as Locale;
  const { dict } = useDictionary(locale);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-cream)] to-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--color-forest-green)] mb-4">
          {dict?.notFound?.title || "404 - Сторінка не знайдена"}
        </h1>
        {/* <p className="text-lg text-[var(--color-forest-green)]/80 mb-6">
          {dict?.notFound?.description ||
            "На жаль, товар не знайдено. Перевірте URL або поверніться на головну сторінку."}
        </p> */}
        <a
          href={`/${locale}`}
          className="inline-block py-2 px-4 bg-[var(--color-lime-green)] text-white rounded-lg hover:bg-[var(--color-forest-green)] transition-colors"
        >
          {dict?.notFound?.back || "Повернутися на головну"}
        </a>
      </div>
    </div>
  );
}
