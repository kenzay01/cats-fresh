"use client";

import { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import { usePathname } from "next/navigation";
import { getImageForProduct } from "@/hooks/getImageForProduct";
import type { Product } from "@/types/product";
import Image from "next/image";

export default function ProductPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop() || null;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const locale = useCurrentLanguage() as Locale;
  const { dict } = useDictionary(locale);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      const foundProduct = data.products.find((p: Product) => p.id === id);
      setProduct(foundProduct || null);
    } catch (error) {
      console.error("Помилка завантаження товару:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const calculatePrice = (product: Product, quantity: number) => {
    const isWholesale = quantity >= 6;
    const unitPrice = isWholesale ? product.price.from_6 : product.price.single;
    return {
      unitPrice: Math.round(unitPrice),
      totalPrice: Math.round(unitPrice * quantity),
      isWholesale,
    };
  };

  const handleBuyClick = () => {
    if (!product) return;
    const { totalPrice } = calculatePrice(product, quantity);
    const productName = product.name[locale];
    console.log(
      `Замовлення: ${productName}, Кількість: ${quantity}, Загальна сума: ${totalPrice} грн`
    );
    // const message = `Привіт! Хочу замовити:\n${productName}\nКількість: ${quantity} шт.\nЗагальна сума: ${totalPrice} грн`;
    // const telegramUrl = `https://t.me/your_bot?start=${encodeURIComponent(
    //   message
    // )}`;
    // window.open(telegramUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-b from-[var(--color-cream)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          Завантаження товару...
        </div>
      </div>
    );
  }

  if (!product || !dict) {
    return (
      <div className="py-16 bg-gradient-to-b from-[var(--color-cream)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          Товар не знайдено
        </div>
      </div>
    );
  }

  const { unitPrice, totalPrice, isWholesale } = calculatePrice(
    product,
    quantity
  );

  return (
    <section className="pt-8 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          <div className="relative w-full h-80 sm:h-96 lg:h-auto lg:w-1/2 lg:min-h-[400px]  bg-gradient-to-br from-[var(--color-lime-green)]/10 to-[var(--color-burnt-orange)]/10">
            <Image
              src={getImageForProduct(product.id)}
              alt={product.name[locale]}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain lg:object-cover"
              priority
            />
            {isWholesale && (
              <div className="absolute top-4 right-4 bg-[var(--color-burnt-orange)] text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                {dict?.product_page?.wholesale_active ||
                  "🎉 Оптова знижка активна!"}
              </div>
            )}
          </div>

          <div className="p-8 flex-1/2 flex flex-col justify-between">
            <h1 className="text-3xl font-bold text-[var(--color-forest-green)] mb-4">
              {product.name[locale]}
            </h1>
            <p className="text-[var(--color-forest-green)]/80 mb-8 text-lg">
              {product.description[locale]}
            </p>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-[var(--color-forest-green)] mb-2">
                {dict?.product_page?.amount || "Кількість"}
              </label>
              <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2 w-40">
                <button
                  onClick={() => updateQuantity(quantity - 1)}
                  className="w-8 h-8 rounded-full font-bold text-[var(--color-forest-green)] bg-[var(--color-lime-green)] hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-lg font-semibold text-[var(--color-forest-green)] min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full  font-bold text-[var(--color-forest-green)] bg-[var(--color-lime-green)] hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] transition-colors"
                >
                  +
                </button>
              </div>
              <div className="text-xs text-[var(--color-forest-green)]/60 mt-1">
                {quantity >= 6
                  ? dict?.product_page?.wholesale_active ||
                    "🎉 Оптова знижка активна!"
                  : dict?.product_page?.text_discount ||
                    "Від 6 шт. - оптова ціна"}
              </div>
            </div>

            <div className="mb-8 p-4 bg-gradient-to-r from-[var(--color-lime-green)]/10 to-[var(--color-burnt-orange)]/10 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[var(--color-forest-green)]">
                  {dict?.product_page?.price_per_unit || "Ціна за шт:"}
                </span>
                <span className="text-lg font-bold text-[var(--color-forest-green)]">
                  {unitPrice} грн
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                <span className="text-sm font-semibold text-[var(--color-forest-green)]">
                  {dict?.product_page?.total_price.replace(
                    "{quantity}",
                    quantity.toString()
                  ) || `Разом (${quantity} шт):`}
                </span>
                <span className="text-xl font-bold text-[var(--color-burnt-orange)]">
                  {totalPrice} грн
                </span>
              </div>
            </div>

            <button
              onClick={handleBuyClick}
              className="w-full py-3 rounded-lg font-semibold text-[var(--color-forest-green)] bg-[var(--color-lime-green)] hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] hover:shadow-lg transition-all duration-300"
            >
              {dict?.product_page?.buy_now || "Купити зараз"}
            </button>
            <p className="text-[var(--color-forest-green)]/80 text-sm mt-4 text-center">
              {dict?.product_page?.info_text ||
                "Отримуйте інфо про знижки та нові товари в нашому боті"}
            </p>
          </div>
        </div>

        {/* <div className="mt-12 bg-[var(--color-lime-green)] rounded-2xl p-8 text-[var(--color-forest-green)] text-center">
          <h3 className="text-2xl font-bold mb-4">
            🎯 Купуй більше — плати менше!
          </h3>
          <p className="text-lg mb-4">
            Оптові замовлення від 6 штук з автоматичною знижкою
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto ">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">1-5 шт</div>
              <div className="text-sm">Звичайна ціна</div>
            </div>
            <div className="bg-white/30 rounded-lg p-4 border-2 border-white">
              <div className="text-2xl font-bold">6+ шт</div>
              <div className="text-sm">Оптова знижка ✨</div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
