import { notFound } from "next/navigation";
import { Locale } from "./config";

const dictionaries = {
  uk: () => import("./locales/uk.json").then((module) => module.default),
  ru: () => import("./locales/ru.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  if (!dictionaries[locale]) {
    notFound();
  }
  return dictionaries[locale]();
};
