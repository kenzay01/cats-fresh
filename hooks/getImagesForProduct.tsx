// import catsFresh1 from "@/public/images/cats-fresh-1.png";

import catsFresh1 from "@/public/images/cats-fresh.png";
import catsFresh2 from "@/public/images/cats-fresh2.png";
import catsFresh3 from "@/public/images/cats-fresh3.png";
import catsFresh4 from "@/public/images/cats-fresh4.png";
import type { StaticImageData } from "next/image";

const imageList: { [key: string]: string | StaticImageData } = {
  "cats-fresh": catsFresh1,
};

export function getImageForProduct(key: string): string | StaticImageData {
  return imageList[key];
}

const productImages: Record<string, StaticImageData[]> = {
  "cats-fresh": [catsFresh1, catsFresh2, catsFresh3, catsFresh4],
};

/**
 * Хук для отримання масиву зображень конкретного продукту
 * @param productId - ID продукту
 * @returns масив URL зображень для продукту
 */
export function getImagesForProduct(productId: string): StaticImageData[] {
  // Повертаємо зображення для конкретного продукту або порожній масив
  const images = productImages[productId] || [];

  // Якщо зображень немає, повертаємо дефолтне зображення
  if (images.length === 0) {
    return [
      catsFresh1, // Дефолтне зображення
    ];
  }

  return images;
}

/**
 * Хук для отримання головного зображення продукту (перше в масиві)
 * @param productId - ID продукту
 * @returns URL головного зображення
 */
export function getMainImageForProduct(productId: string): StaticImageData {
  const images = getImagesForProduct(productId);
  return images[0] || catsFresh1;
}

/**
 * Хук для перевірки чи є у продукту кілька зображень
 * @param productId - ID продукту
 * @returns true якщо у продукту більше одного зображення
 */
export function hasMultipleImages(productId: string): boolean {
  const images = getImagesForProduct(productId);
  return images.length > 1;
}

/**
 * Альтернативний варіант - динамічне завантаження зображень з файлової системи
 * Використовуйте цю функцію, якщо хочете автоматично знаходити всі зображення в папці продукту
 */
export function getImagesForProductDynamic(productId: string): string[] {
  // Цей варіант працює тільки на сервері або з використанням API
  // Для клієнтської частини краще використовувати статичний об'єкт вище

  const baseImagePath = `/images/products/${productId}/`;
  const imageExtensions = ["jpg", "jpeg", "png", "webp"];
  const possibleImageNames = [
    "main",
    "front",
    "back",
    "side",
    "detail",
    "package",
    "packaging",
    "ingredients",
    "texture",
    "size-comparison",
    "1",
    "2",
    "3",
    "4",
    "5",
  ];

  const images: string[] = [];

  // Генеруємо можливі шляхи до зображень
  possibleImageNames.forEach((name) => {
    imageExtensions.forEach((ext) => {
      images.push(`${baseImagePath}${name}.${ext}`);
    });
  });

  // В реальному застосунку тут би була перевірка існування файлів
  // Для прикладу повертаємо статичний масив
  return images.slice(0, 4); // Обмежуємо до 4 зображень
}

// Експорт за замовчуванням
export default getImagesForProduct;
