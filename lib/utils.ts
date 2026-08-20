import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple CSS class names with tailwind-merge support.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats date into readable string.
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Calculates score percentage.
 */
export function formatPercentage(value: number, total: number = 100): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

/**
 * Shortens wallet / credential hash.
 */
export function truncateHash(hash: string, chars = 4): string {
  if (!hash || hash.length <= chars * 2 + 2) return hash;
  return `${hash.substring(0, chars + 2)}...${hash.substring(hash.length - chars)}`;
}
