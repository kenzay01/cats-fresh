"use client";

import Image from "next/image";
import Link from "next/link";
import picBanner from "@/public/main-banner.png";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";

export default function MainBanner() {
  const locale = useCurrentLanguage() as Locale;
  const { dict } = useDictionary(locale);

  return (
    <section className="relative w-full py-10 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-0">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-forest-green)] mb-6 text-center lg:text-left">
          {dict?.banner.title ||
            "Cats Fresh - Натуральний наповнювач для котячого туалету"}
        </h1>
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 lg:max-w-lg">
            <div className="relative">
              <Image
                src={picBanner}
                alt={
                  dict?.banner.title ||
                  "Cats Fresh - Натуральний наповнювач для котячого туалету"
                }
                width={600}
                height={400}
                className="w-full h-[475px] rounded-3xl shadow-2xl object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="eager"
                quality={50}
              />
            </div>
          </div>

          {/* Right side - All other content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-xl md:text-2xl text-[var(--color-burnt-orange)] mb-6">
              {dict?.banner.subtitle ||
                "Комфорт і свіжість від природи для вашого улюбленця"}
            </h2>

            <p className="text-lg text-[var(--color-forest-green)] mb-4">
              {dict?.banner.description ||
                "Екологічний наповнювач Cats Fresh забезпечує максимальний комфорт для вашої кішки та легкість у прибиранні для вас."}
            </p>

            {/* Advantages */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-[var(--color-forest-green)] mb-4">
                {dict?.banner.advantages_title || "Переваги Cats Fresh"}
              </h3>
              <ul className="text-lg text-[var(--color-forest-green)] space-y-2">
                {dict?.banner.advantages.map(
                  (advantage: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-center justify-center lg:justify-start"
                    >
                      <span className="mr-2 text-[var(--color-lime-green)] font-bold">
                        ✓
                      </span>
                      {advantage}
                    </li>
                  )
                )}
              </ul>
            </div>
            <Link
              href="#why-cats-fresh"
              className="inline-block bg-[var(--color-lime-green)] text-[var(--color-forest-green)] font-semibold px-6 py-3 rounded-md hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] transition-colors duration-300 mb-10"
            >
              {dict?.banner.cta || "Дізнатися більше"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
