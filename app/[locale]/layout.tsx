import { Inter } from "next/font/google";
// import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
// import { Locale } from "@/i18n/config";
import { Metadata } from "next";
// import LanguageSwitcher from "@/components/LanguageSwitcher";
import ClientHeaderWrapper from "@/components/ClientHeaderWrapped";
import ClientFooterWrapper from "@/components/ClientFooterWrapped";
import "../globals.css";
// import { usePathname } from "next/navigation";
const inter = Inter({ subsets: ["latin", "cyrillic"] });

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Метадані потрібно робити динамічними, якщо залежать від locale
export async function generateMetadata(): Promise<Metadata> {
  // const { locale } = await params;

  return {
    title: "Cats Fresh",
    description: "Cats Fresh - Комкуючий наповнювач з тофу",
    // Можете додати специфічні для локалі метадані
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <ClientHeaderWrapper />
        <main>{children}</main>
        <ClientFooterWrapper />
      </body>
    </html>
  );
}
