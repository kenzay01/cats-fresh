"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import fullLogo from "@/public/full_logo.png";
import shortLogo from "@/public/short_logo.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { IoMenu, IoClose } from "react-icons/io5";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useCurrentLanguage() as Locale;
  const { dict } = useDictionary(locale);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToElement = (targetId: string) => {
    const target = document.querySelector(targetId);
    if (target && headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      const targetPosition = (target as HTMLElement).offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "#");
    const isHomePage = pathname === `/${locale}` || pathname === "/";

    if (isHomePage) {
      scrollToElement(targetId);
    } else {
      router.push(`/${locale}${href}`);
    }

    closeMobileMenu();
  };

  useEffect(() => {
    const handleHashScroll = () => {
      if (window.location.hash) {
        setTimeout(() => {
          scrollToElement(window.location.hash);
        }, 100);
      }
    };
    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);

    return () => {
      window.removeEventListener("hashchange", handleHashScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (isMobileMenuOpen && window.innerWidth >= 1024) {
        closeMobileMenu();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  if (!dict) {
    return (
      <header className="sticky top-0 bg-gradient-to-r from-[var(--color-forest-green)] to-[#2d5123] shadow-lg ">
        <div className="h-1 bg-gradient-to-r from-[var(--color-burnt-orange)] via-[var(--color-lime-green)] to-[var(--color-burnt-orange)]"></div>
        <div className="h-26 w-full"></div>
      </header>
    );
  }

  const navLinks = [
    { name: dict.nav.why_brand, href: `#why-cats-fresh` },
    { name: dict.nav.products, href: `#products` },
    { name: dict.nav.comments, href: `#comments` },
    // { name: dict.nav.contact, href: `#contact` },
  ];

  return (
    <header
      ref={headerRef}
      className="sticky top-0 bg-gradient-to-r from-[var(--color-forest-green)] to-[#2d5123] shadow-xl z-50"
    >
      <div className="h-1 bg-gradient-to-r from-[var(--color-burnt-orange)] via-[var(--color-lime-green)] to-[var(--color-burnt-orange)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href={`/${locale}`} className="flex items-center">
              <Image
                src={fullLogo}
                width={175}
                height={75}
                alt="Main logo"
                className="hidden md:block w-56 h-auto drop-shadow-md"
              />
              <Image
                src={shortLogo}
                width={100}
                height={50}
                alt="Short logo"
                className="block md:hidden w-20 h-auto drop-shadow-md pl-4"
              />
            </Link>
          </div>

          <div className="flex items-center justify-end w-full gap-4">
            <nav className="hidden lg:block">
              <ul className="flex space-x-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-[var(--color-cream)] hover:text-[var(--color-lime-green)] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-black/10"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher currentLocale={locale} />

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={toggleMobileMenu}
                  className="text-[var(--color-cream)] hover:text-[var(--color-lime-green)] hover:bg-black/10 p-2 rounded-md transition-colors duration-200"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">
                    {isMobileMenuOpen ? "Close main menu" : "Open main menu"}
                  </span>
                  {isMobileMenuOpen ? (
                    <IoClose className="h-6 w-6" />
                  ) : (
                    <IoMenu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4" id="mobile-menu">
            <div className="px-2 pt-2 bg-black/10 rounded-lg mt-2 backdrop-blur-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[var(--color-cream)] hover:text-[var(--color-lime-green)] block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-lime-green)]/30 to-transparent"></div>
    </header>
  );
}
