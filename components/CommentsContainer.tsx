"use client";

import { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
// import testPic from "@/public/images/cats-fresh.png";
import comment1 from "@/public/comments/comment1.jpg";
import comment2 from "@/public/comments/comment2.jpg";
import comment3 from "@/public/comments/comment3.jpg";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
export default function CommentsContainer() {
  const locale = useCurrentLanguage() as Locale;
  const { dict } = useDictionary(locale);

  const comments = [
    {
      id: 1,
      name: "Наталія Мельник",
      text: "Вітаю! Вперше замовила цей наповнювач і чесно, була вражена, навіть при тому що раніше користувалася саме преміум пакетами. Комкується чудово і дійсно легко прибирати, а це прям мій головний біль був завжди з деревними. Тепер я ваш постійний клієнт🤗",
      rating: 5,
      image: comment1,
    },
    {
      id: 2,
      name: "Марія Юрченко",
      text: "Я б поставила 5/5, одразу вже замовила оптом після першої проби. Хотіла б відзначити ще компактність і зручність, перший раз пробувала саме у вакуумній упаковці, не рветься, не сиплеться. Ну і ще не мало важливо, що ціна дуже приємна і вистачає довше ніж деякі по 5 кг. Дякую команді Кетс Фреш.",
      rating: 5,
      image: comment2,
    },
    {
      id: 3,
      name: "Наталія Ткачук",
      text: "Дуже задоволена покупкою. Кішка швидко звикла до нового наповнювача, і швидко вбирає запахи.",
      rating: 5,
      image: comment3,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const slidesToShow = isDesktop ? 3 : 1;
  const maxIndex = comments.length - slidesToShow;

  const nextSlide = () => {
    setCurrentIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="bg-white pb-8" id="comments">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-forest-green)] lg:mb-4 text-center">
          {dict?.comments?.title || "Відгуки наших клієнтів"}
        </h1>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out py-8"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / slidesToShow)
                }%)`,
              }}
            >
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`${
                    isDesktop ? "w-1/3" : "w-full"
                  } flex-shrink-0 px-2 lg:px-8`}
                >
                  <CommentItem
                    name={comment.name}
                    text={comment.text}
                    rating={comment.rating}
                    image={comment.image}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons - hidden on mobile if only one slide visible */}
          {comments.length > slidesToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-3 lg:left-4 top-1/2 transform -translate-y-1/2 bg-[var(--color-lime-green)] text-[var(--color-forest-green)] p-2 lg:p-3 rounded-full shadow-lg hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] transition-colors duration-300 z-10 border-2 border-[var(--color-forest-green)]"
                aria-label="Попередній відгук"
              >
                <FaChevronLeft size={isDesktop ? 20 : 16} />
              </button>

              <button
                onClick={nextSlide}
                className="absolute -right-3 lg:right-4 top-1/2 transform -translate-y-1/2 bg-[var(--color-lime-green)] text-[var(--color-forest-green)] p-2 lg:p-3 rounded-full shadow-lg hover:bg-[var(--color-burnt-orange)] hover:text-[var(--color-cream)] transition-colors duration-300 z-10 border-2 border-[var(--color-forest-green)]"
                aria-label="Наступний відгук"
              >
                <FaChevronRight size={isDesktop ? 20 : 16} />
              </button>
              <div className="flex justify-center mt-6 lg:mt-8 space-x-2">
                {Array.from({ length: maxIndex + 1 }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-colors duration-300 ${
                      currentIndex === index
                        ? "bg-[var(--color-burnt-orange)]"
                        : "bg-[var(--color-lime-green)]"
                    }`}
                    aria-label={`Перейти до відгуку ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
