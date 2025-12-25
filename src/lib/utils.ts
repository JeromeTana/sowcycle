import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTH(dateString: string, d = true, m = true, y = false) {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: y ? "numeric" : undefined,
    month: m ? "long" : undefined,
    day: d ? "numeric" : undefined,
  });
}

export function getDaysDiff(dateStr: string) {
  const diffTime = new Date().getTime() - new Date(dateStr).getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function getDaysRemaining(dateStr: string) {
  const diffTime = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
