import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStockStatus(quantity: number, minimumStock: number) {
  if (quantity === 0) return "out_of_stock";
  if (quantity <= minimumStock) return "low_stock";
  return "in_stock";
}

export function getStockStatusLabel(quantity: number, minimumStock: number) {
  const status = getStockStatus(quantity, minimumStock);
  if (status === "out_of_stock") return "Out of Stock";
  if (status === "low_stock") return "Low Stock";
  return "In Stock";
}

export function getStockStatusColor(quantity: number, minimumStock: number) {
  const status = getStockStatus(quantity, minimumStock);
  if (status === "out_of_stock") return "destructive";
  if (status === "low_stock") return "warning";
  return "success";
}
