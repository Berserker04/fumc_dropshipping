import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}
