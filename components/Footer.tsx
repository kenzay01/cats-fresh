"use client";

import {
  // FaFacebook,
  FaInstagram,
  FaTelegram,
  FaPhone,
  // FaEnvelope,
} from "react-icons/fa6";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";

export default function Footer() {
  const locale = useCurrentLanguage() as Locale;
  const { dict } = useDictionary(locale);

  return (
    <footer className="bg-[var(--color-forest-green)] text-[var(--color-cream)] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                Cats Fresh
              </h3>
              <p className="text-lg text-[var(--color-lime-green)]">
                100% {dict?.banner.advantages[0]}{" "}
                {/* Екологічно чистий склад */}
              </p>
            </div>

            <div className="space-y-2 text-sm lg:text-base">
              {/* <p>ТОВ `КетсФреш Україна`</p> */}
              <p>м. Київ, Деревообробна 3</p>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <FaPhone className="text-[var(--color-lime-green)]" />
                <a
                  href="tel:+380996054426"
                  className="hover:text-[var(--color-lime-green)] transition-colors"
                >
                  +38 (099) 605-44-26
                </a>
              </div>
              {/* <div className="flex items-center justify-center lg:justify-start gap-2">
                <FaEnvelope className="text-[var(--color-lime-green)]" />
                <a
                  href="mailto:info@test.ua"
                  className="hover:text-[var(--color-lime-green)] transition-colors"
                >
                  info@test.ua
                </a>
              </div> */}
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center lg:text-end">
            <h4 className="text-xl font-semibold mb-6">
              {dict?.footer?.social_media?.title ||
                "Слідкуйте за нами в соціальних мережах!"}
            </h4>

            <div className="flex justify-center lg:justify-end gap-4 mb-6">
              {/* <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--color-lime-green)] text-[var(--color-forest-green)] p-3 rounded-full hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] transition-colors duration-300 shadow-lg"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a> */}

              <a
                href="https://www.instagram.com/cats.freshua?igsh=aTVzMzd4bHM4bWky&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--color-lime-green)] text-[var(--color-forest-green)] p-3 rounded-full hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] transition-colors duration-300 shadow-lg"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>

              <a
                href="https://t.me/CatsFreshBot"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--color-lime-green)] text-[var(--color-forest-green)] p-3 rounded-full hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] transition-colors duration-300 shadow-lg"
                aria-label="Telegram"
              >
                <FaTelegram size={24} />
              </a>
            </div>

            <p className="text-sm lg:text-base text-[var(--color-lime-green)]">
              {dict?.footer?.social_media?.feedback ||
                "Ваша думка важлива для нас - будь ласка, надішліть нам ваші пропозиції"}
            </p>
          </div>

          {/* Legal Links */}
          {/* <div className="text-center lg:text-right">
            <h4 className="text-xl font-semibold mb-6">
              {dict?.footer?.legal?.title || "Правова інформація"}
            </h4>

            <div className="space-y-3">
              <div>
                <Link
                  href="#"
                  className="text-sm lg:text-base hover:text-[var(--color-lime-green)] transition-colors underline underline-offset-4"
                >
                  {dict?.footer?.legal?.terms || "Загальні умови та положення"}
                </Link>
              </div>

              <div>
                <Link
                  href="#"
                  className="text-sm lg:text-base hover:text-[var(--color-lime-green)] transition-colors underline underline-offset-4"
                >
                  {dict?.footer?.legal?.privacy || "Політика конфіденційності"}
                </Link>
              </div>
            </div>
          </div> */}
        </div>

        <div className="border-t border-[var(--color-lime-green)] opacity-30 my-8"></div>

        <div className="text-center">
          <p className="text-sm lg:text-base">
            {dict?.footer?.copyright ||
              `Всі права захищені © ${new Date().getFullYear()} Cats Fresh`}
          </p>
        </div>
      </div>
    </footer>
  );
}
