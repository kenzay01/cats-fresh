"use client";
import MainBanner from "@/components/MainBanner";
import ProductsSection from "@/components/ProductsSection";
import WhyCatsFresh from "@/components/WhyCatsFresh";
export default function HomePage() {
  return (
    <div>
      <MainBanner />
      <WhyCatsFresh />
      <ProductsSection />
    </div>
  );
}
