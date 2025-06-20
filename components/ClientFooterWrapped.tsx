"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
export default function ClientHeaderWrapper() {
  const pathname = usePathname();

  const currentLanguage = useCurrentLanguage();
  // console.log(pathname);
  return pathname !== `/${currentLanguage}/adminBoard` ? <Footer /> : null;
}
