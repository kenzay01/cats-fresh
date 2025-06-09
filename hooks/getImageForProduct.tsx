// import { useMemo } from "react";

import catsFresh from "@/public/images/cats-fresh.png";
import type { StaticImageData } from "next/image";

const imageList: { [key: string]: string | StaticImageData } = {
  "cats-fresh": catsFresh,
};

// Convert to a regular function instead of a hook
export function getImageForProduct(key: string): string | StaticImageData {
  return imageList[key];
}

// Alternative: If you need memoization, use it at the component level
// export function useProductImages(productIds: string[]) {
//   return useMemo(() => {
//     return productIds.reduce((acc, id) => {
//       acc[id] = imageList[id];
//       return acc;
//     }, {} as { [key: string]: string | StaticImageData });
//   }, [productIds]);
// }
