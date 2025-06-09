export const defaultLocale = "uk" as const;
export const locales = ["uk", "ru"] as const;
export type Locale = (typeof locales)[number];

export const localeNames = {
  uk: "Укр",
  ru: "Рус",
};
