"use client";

import {
  Package,
  AlertTriangle,
  XCircle,
  BarChart2,
  HeartPulse,
  ShoppingCart,
  TrendingUp,
  Banknote,
  BadgeDollarSign,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: "indigo" | "amber" | "red" | "emerald" | "violet" | "sky" | "orange" | "teal" | "green" | "pink";
}

const colorMap = {
  indigo: { bg: "bg-indigo-50", icon: "bg-indigo-100 text-indigo-600", border: "border-indigo-100", value: "text-indigo-700" },
  amber: { bg: "bg-amber-50", icon: "bg-amber-100 text-amber-600", border: "border-amber-100", value: "text-amber-700" },
  red: { bg: "bg-red-50", icon: "bg-red-100 text-red-600", border: "border-red-100", value: "text-red-700" },
  emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", border: "border-emerald-100", value: "text-emerald-700" },
  violet: { bg: "bg-violet-50", icon: "bg-violet-100 text-violet-600", border: "border-violet-100", value: "text-violet-700" },
  sky: { bg: "bg-sky-50", icon: "bg-sky-100 text-sky-600", border: "border-sky-100", value: "text-sky-700" },
  orange: { bg: "bg-orange-50", icon: "bg-orange-100 text-orange-600", border: "border-orange-100", value: "text-orange-700" },
  teal: { bg: "bg-teal-50", icon: "bg-teal-100 text-teal-600", border: "border-teal-100", value: "text-teal-700" },
  green: { bg: "bg-green-50", icon: "bg-green-100 text-green-600", border: "border-green-100", value: "text-green-700" },
  pink: { bg: "bg-pink-50", icon: "bg-pink-100 text-pink-600", border: "border-pink-100", value: "text-pink-700" },
};

function StatsCard({ title, value, subtitle, icon, color }: StatsCardProps) {
  const colors = colorMap[color];
  return (
    <Card className={cn("relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default", colors.border, colors.bg)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">{title}</p>
            <p className={cn("text-2xl font-bold mt-1.5 truncate", colors.value)}>{value}</p>
            {subtitle && <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>}
          </div>
          <div className={cn("flex-shrink-0 p-2.5 rounded-xl ml-3", colors.icon)}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsData {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  totalInventoryValue: number;
  avgStockLevel: number;
  stockHealthScore: number;
  reorderCost: number;
  avgProductPrice: number;
  totalSalesValue?: number;
  totalUnitsSold?: number;
}

export function StatsCards({ stats }: { stats: StatsData }) {
  const cards = [
    { title: "Total Products", value: stats.totalProducts, subtitle: "Active SKUs", icon: <Package className="w-5 h-5" />, color: "indigo" as const },
    { title: "Low Stock Alerts", value: stats.lowStock, subtitle: "Need reordering", icon: <AlertTriangle className="w-5 h-5" />, color: "amber" as const },
    { title: "Out of Stock", value: stats.outOfStock, subtitle: "Immediate action needed", icon: <XCircle className="w-5 h-5" />, color: "red" as const },
    { title: "Inventory Value", value: formatCurrency(stats.totalInventoryValue), subtitle: "Total retail value", icon: <Banknote className="w-5 h-5" />, color: "emerald" as const },
    { title: "Avg Stock Level", value: stats.avgStockLevel, subtitle: "Units per product", icon: <BarChart2 className="w-5 h-5" />, color: "sky" as const },
    { title: "Stock Health", value: `${stats.stockHealthScore}%`, subtitle: "Products in healthy stock", icon: <HeartPulse className="w-5 h-5" />, color: "violet" as const },
    { title: "Reorder Cost Est.", value: formatCurrency(stats.reorderCost), subtitle: "Estimated restock cost", icon: <ShoppingCart className="w-5 h-5" />, color: "orange" as const },
    { title: "Avg Product Price", value: formatCurrency(stats.avgProductPrice), subtitle: "Mean selling price", icon: <TrendingUp className="w-5 h-5" />, color: "teal" as const },
    { title: "Sales Revenue (30d)", value: formatCurrency(stats.totalSalesValue ?? 0), subtitle: "Last 30 days", icon: <BadgeDollarSign className="w-5 h-5" />, color: "green" as const },
    { title: "Units Sold (30d)", value: stats.totalUnitsSold ?? 0, subtitle: "Last 30 days", icon: <ShoppingBag className="w-5 h-5" />, color: "pink" as const },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <StatsCard key={card.title} {...card} />
      ))}
    </div>
  );
}
