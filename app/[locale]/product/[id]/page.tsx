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
  const [editingQuantity, setEditingQuantity] = useState(false);
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
    let unitPrice;
    let discountLevel = "none";

    if (quantity >= 80 && product.price.from_80) {
      unitPrice = product.price.from_80;
      discountLevel = "high";
    } else if (quantity >= 8) {
      unitPrice = product.price.from_8;
      discountLevel = "medium";
    } else {
      unitPrice = product.price.single;
      discountLevel = "none";
    }

    return {
      unitPrice: Math.round(unitPrice),
      totalPrice: Math.round(unitPrice * quantity),
      discountLevel,
    };
  };

  const getDiscountInfo = (discountLevel: string) => {
    switch (discountLevel) {
      case "high":
        return {
          badge: dict?.product_page?.badge_max || "🔥 Мега знижка!",
          badgeColor: "bg-gradient-to-r from-red-500 to-orange-500",
          text:
            dict?.product_page?.mega_discount ||
            "Від 80 шт. - максимальна знижка!",
          textColor: "text-red-600",
        };
      case "medium":
        return {
          badge: dict?.product_page?.wholesale_active,
          badgeColor: "bg-[var(--color-burnt-orange)]",
          text:
            dict?.product_page?.wholesale_active || "🎉 Оптова знижка активна!",
          textColor: "text-[var(--color-burnt-orange)]",
        };
      default:
        return {
          badge: null,
          badgeColor: "",
          text:
            dict?.product_page?.text_discount ||
            "Від 8 шт. - оптова ціна, від 80 шт. - максимальна знижка",
          textColor: "text-[var(--color-forest-green)]/60",
        };
    }
  };

  const handleBuyClick = async () => {
    if (!product || isOrdering) return;

    setIsOrdering(true);

    const { totalPrice } = calculatePrice(product, quantity);
    const lang = locale === "uk" ? "uk" : "ru";

    console.log(
      `Замовлення: ${product.name[locale]}, Кількість: ${quantity}, Ціна: ${totalPrice} грн, Мова: ${lang}`
    );

    const telegramUrl = `https://t.me/CatsFreshBot?start=cats${product.idNumber}-${quantity}-${totalPrice}-${lang}shop`;
    window.open(telegramUrl, "_blank");

    setIsOrdering(false);
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
    return <NotFound />;
  }

  const { unitPrice, totalPrice, discountLevel } = calculatePrice(
    product,
    quantity
  );

  const discountInfo = getDiscountInfo(discountLevel);
  const productImages = getImagesForProduct(product.id);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          <div className="relative lg:w-1/2">
            <ImageGallery
              images={productImages}
              productName={product.name[locale]}
            />
            {discountInfo.badge && (
              <div
                className={`absolute top-4 right-4 ${discountInfo.badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold z-20 shadow-lg animate-pulse`}
              >
                {discountInfo.badge}
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
                    {editingQuantity ? (
                      <input
                        type="number"
                        min={1}
                        value={quantity === 0 ? "" : quantity}
                        onChange={(e) => {
                          const val =
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value, 10);
                          setQuantity(isNaN(val) ? 0 : val);
                        }}
                        onBlur={() => {
                          if (!quantity || quantity < 1) setQuantity(1);
                          setEditingQuantity(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (!quantity || quantity < 1) setQuantity(1);
                            setEditingQuantity(false);
                          }
                        }}
                        autoFocus
                        className="w-12 text-center bg-transparent border-b border-[var(--color-lime-green)] focus:outline-none focus:border-[var(--color-burnt-orange)] transition-colors"
                        style={{ appearance: "textfield" }}
                      />
                    ) : (
                      <span
                        className="text-lg font-semibold text-[var(--color-forest-green)] min-w-[2rem] text-center cursor-pointer select-none"
                        onClick={() => setEditingQuantity(true)}
                        title="Змінити кількість"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            setEditingQuantity(true);
                        }}
                        role="button"
                        aria-label="Змінити кількість"
                      >
                        {quantity}
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => updateQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full font-bold text-[var(--color-forest-green)] bg-[var(--color-lime-green)] hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] transition-colors"
                  >
                    +
                  </button>
                </div>
                <div
                  className={`text-xs mt-1 font-medium ${discountInfo.textColor}`}
                >
                  {discountInfo.text}
                </div>
              </div>

              <div
                className={`mb-8 p-4 rounded-lg ${
                  discountLevel === "high"
                    ? "bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200"
                    : discountLevel === "medium"
                    ? "bg-gradient-to-r from-[var(--color-lime-green)]/10 to-[var(--color-burnt-orange)]/10"
                    : "bg-gray-50"
                }`}
              >
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
                  <span
                    className={`text-xl font-bold ${
                      discountLevel === "high"
                        ? "text-red-600"
                        : "text-[var(--color-burnt-orange)]"
                    }`}
                  >
                    {totalPrice} грн
                  </span>
                </div>

                {/* Додаткова інформація про економію */}
                {/* {discountLevel !== "none" && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      {discountLevel === "high" && (
                        <span className="text-red-600 font-semibold">
                          💰 Максимальна економія! Найкраща ціна за шт.
                        </span>
                      )}
                      {discountLevel === "medium" && (
                        <span className="text-[var(--color-burnt-orange)] font-semibold">
                          💡 Оптова ціна активна! Ще більша знижка від 80 шт.
                        </span>
                      )}
                    </div>
                  </div>
                )} */}
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
