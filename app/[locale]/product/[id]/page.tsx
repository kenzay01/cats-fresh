"use client";

import { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import { usePathname } from "next/navigation";
import { getImagesForProduct } from "@/hooks/getImagesForProduct";
import type { Product } from "@/types/product";
import ImageGallery from "@/components/ImageGallery";
import NotFound from "../not-found";

export default function ProductPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop() || null;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
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

  const handleBuyClick = async () => {
    if (!product || isOrdering) return;

    setIsOrdering(true);

    // try {
    const { totalPrice } = calculatePrice(product, quantity);
    const lang = locale === "uk" ? "uk" : "ru"; // Перетворення локалі в формат ru/uk

    console.log(
      `Замовлення: ${product.name[locale]}, Кількість: ${quantity}, Ціна: ${totalPrice} грн, Мова: ${lang}`
    );
    // const response = await fetch("/api/send-telegram", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     productId: product.id,
    //     amount: quantity,
    //     price: totalPrice,
    //     lang: lang,
    //   }),
    // });

    // if (response.ok) {
    //   // Якщо API відправив успішно, перенаправляємо на Telegram
    const telegramUrl = `https://t.me/CatsFreshBot?start=cats${product.idNumber}-${quantity}-${totalPrice}-${lang}shop`;
    window.open(telegramUrl, "_blank");
    // } else {
    //   console.error("Помилка при відправці замовлення");
    //   // Можна додати показ помилки користувачу
    // }
    // } catch (error) {
    //   console.error("Помилка при відправці замовлення:", error);
    //   // Можна додати показ помилки користувачу
    // } finally {
    setIsOrdering(false);
    // }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-b from-[var(--color-cream)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {dict?.products.loading || "Завантаження товару..."}
        </div>
      </div>
    );
  }

  if (!product || !dict) {
    // return (
    //   <div className="py-16 bg-gradient-to-b from-[var(--color-cream)] to-white">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    //       {dict?.notFound.title || "Товар не знайдено"}
    //     </div>
    //   </div>
    // );
    return <NotFound />;
  }

  const { unitPrice, totalPrice, isWholesale } = calculatePrice(
    product,
    quantity
  );

  const productImages = getImagesForProduct(product.id);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Замінюємо одне зображення на галерею */}
          <div className="relative lg:w-1/2">
            <ImageGallery
              images={productImages}
              productName={product.name[locale]}
            />
            {isWholesale && (
              <div className="absolute top-4 right-4 bg-[var(--color-burnt-orange)] text-white px-3 py-1 rounded-full text-sm font-semibold z-20">
                {dict?.product_page?.wholesale_active ||
                  "🎉 Оптова знижка активна!"}
              </div>
            )}
          </div>

          <div className="p-8 lg:w-1/2 flex flex-col justify-between">
            <div>
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
                    className="w-8 h-8 rounded-full font-bold text-[var(--color-forest-green)] bg-[var(--color-lime-green)] hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] transition-colors"
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
            </div>

            <div>
              <button
                onClick={handleBuyClick}
                disabled={isOrdering}
                className="w-full py-3 rounded-lg font-semibold text-[var(--color-forest-green)] bg-[var(--color-lime-green)] hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOrdering
                  ? "Обробка замовлення..."
                  : dict?.product_page?.buy_now || "Купити зараз"}
              </button>
              <p className="text-[var(--color-forest-green)]/80 text-sm mt-4 text-center">
                {dict?.product_page?.info_text ||
                  "Отримуйте інфо про знижки та нові товари в нашому боті"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
