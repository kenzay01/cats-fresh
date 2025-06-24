"use client";

import { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import Link from "next/link";
import type { Product } from "@/types/product";
import Image from "next/image";
import { getImageForProduct } from "@/hooks/getImagesForProduct";

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useCurrentLanguage() as Locale;
  const { dict } = useDictionary(locale);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Помилка завантаження товарів:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (originalPrice: number, discountPrice: number) => {
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const sampleProduct = products[0];
  const getPricingInfo = () => {
    if (!sampleProduct) return null;

    const singlePrice = sampleProduct.price.single;
    const from8Price = sampleProduct.price.from_8;
    const from80Price = sampleProduct.price.from_80;

    const discount8 = calculateDiscount(singlePrice, from8Price);
    const discount80 = calculateDiscount(singlePrice, from80Price);

    return {
      single: Math.round(singlePrice),
      from8: Math.round(from8Price),
      from80: Math.round(from80Price),
      discount8,
      discount80,
    };
  };

  const pricingInfo = getPricingInfo();

  if (loading) {
    return (
      <section
        id="products"
        className="py-16 bg-gradient-to-b from-[var(--color-cream)] to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">{dict?.products.loading}</div>
        </div>
      </section>
    );
  }

  if (!dict) {
    return null;
  }

  return (
    <section
      id="products"
      className="py-6 bg-gradient-to-b from-[var(--color-cream)] to-white pb-12"
    >
      <div className="max-w-7xl mx-auto pb-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-forest-green)] mb-2">
            {dict.products?.title}
          </h2>
          <p className="text-lg text-[var(--color-forest-green)] max-w-2xl mx-auto">
            {dict.products?.subtitle}
          </p>
        </div>

        <div
          className={`grid gap-8 ${
            products.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[var(--color-lime-green)] rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative h-64 bg-gradient-to-br from-[var(--color-lime-green)]/10 to-[var(--color-burnt-orange)]/10">
                <div className="flex items-center justify-center h-full text-[var(--color-forest-green)]">
                  <Image
                    src={getImageForProduct(product.id)}
                    alt={product.name[locale]}
                    width={300}
                    height={200}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-[var(--color-forest-green)] mb-2">
                  {product.name[locale]}
                </h3>
                <p className="text-[var(--color-forest-green)]/80 mb-8 whitespace-pre-line">
                  {product.description[locale]}
                </p>
                <Link href={`/product/${product.id}`}>
                  <button className="w-full py-3 rounded-lg font-semibold text-[var(--color-lime-green)] bg-[var(--color-forest-green)] hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] hover:shadow-lg transition-all duration-300">
                    {dict?.products?.buy || "Купити"}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 bg-[var(--color-lime-green)] p-8 text-[var(--color-forest-green)] text-center">
        <h3 className="text-2xl font-bold mb-4">
          {dict?.products?.promotion?.title || "🎯 Купуй більше — плати менше!"}
        </h3>
        <p className="text-lg mb-4">
          {dict?.products?.promotion?.description ||
            "Оптові замовлення від 8 штук з автоматичною знижкою"}
        </p>

        {pricingInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {/* Звичайна ціна */}
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">1 шт</div>
              <div className="text-lg font-semibold mb-1">
                {pricingInfo.single} грн/шт
              </div>
              <div className="text-sm">
                {dict?.products?.promotion?.standard_price || "Звичайна ціна"}
              </div>
            </div>

            {/* Оптова ціна */}
            <div className="bg-white/30 rounded-lg p-4 border-2 border-[var(--color-cream)]">
              <div className="text-2xl font-bold">8+ шт</div>
              <div className="text-lg font-semibold mb-1">
                {pricingInfo.from8} грн/шт
              </div>
              <div className="text-sm flex items-center justify-center gap-1">
                <span className="bg-[var(--color-burnt-orange)] text-white px-2 py-1 rounded text-xs font-bold">
                  -{pricingInfo.discount8}%
                </span>
                <span>{dict?.products?.promotion.wholesale_discount}</span>
              </div>
            </div>

            {/* Максимальна знижка */}
            <div className="bg-white/40 rounded-lg p-4 border-2 border-[var(--color-burnt-orange)] relative overflow-hidden">
              <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                🔥 ТОП
              </div>
              <div className="text-2xl font-bold">80+ шт</div>
              <div className="text-lg font-semibold mb-1">
                {pricingInfo.from80} грн/шт
              </div>
              <div className="text-sm flex items-center justify-center gap-1">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                  -{pricingInfo.discount80}%
                </span>
                <span className="font-semibold">
                  {dict?.product_page.badge_max}
                </span>
              </div>
            </div>
          </div>
        )}

        <p className="text-2xl font-bold underline-offset-2 underline decoration-[var(--color-burnt-orange)]">
          {dict?.products?.promotion?.promotion_accent ||
            "Найвигідніша пропозиція на ринку!"}
        </p>
      </div>
    </section>
  );
}
