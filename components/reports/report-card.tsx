"use client";

import { useState } from "react";
import { Trash2, Eye, BarChart3, DollarSign, AlertTriangle, PieChart, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Report {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  data: unknown;
  createdAt: string;
}

interface ReportCardProps {
  report: Report;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; badge: string }> = {
  category_performance: { icon: BarChart3, color: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  inventory_value: { icon: DollarSign, color: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  low_stock_alerts: { icon: AlertTriangle, color: "text-amber-600", badge: "bg-amber-100 text-amber-700 border-amber-200" },
  stock_status: { icon: PieChart, color: "text-violet-600", badge: "bg-violet-100 text-violet-700 border-violet-200" },
};

function ReportPreview({ type, data }: { type: string; data: unknown }) {
  if (!data) return <p className="text-sm text-slate-400">No data available</p>;

  if (type === "category_performance") {
    const rows = data as Array<{ category: string; productCount: number; totalQuantity: number; totalValue: number }>;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left pb-2 text-slate-500 font-semibold">Category</th>
              <th className="text-right pb-2 text-slate-500 font-semibold">Products</th>
              <th className="text-right pb-2 text-slate-500 font-semibold">Qty</th>
              <th className="text-right pb-2 text-slate-500 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-50">
                <td className="py-1.5 font-medium text-slate-700">{row.category}</td>
                <td className="py-1.5 text-right text-slate-600">{row.productCount}</td>
                <td className="py-1.5 text-right text-slate-600">{row.totalQuantity}</td>
                <td className="py-1.5 text-right text-slate-600">{formatCurrency(row.totalValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "inventory_value") {
    const d = data as { totalValue: number; totalCost: number; potentialProfit: number; productBreakdown: Array<{ name: string; quantity: number; totalValue: number }> };
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-emerald-50 rounded-lg">
            <p className="text-[10px] text-slate-500">Retail Value</p>
            <p className="font-bold text-emerald-700 text-sm">{formatCurrency(d.totalValue)}</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="text-[10px] text-slate-500">Total Cost</p>
            <p className="font-bold text-blue-700 text-sm">{formatCurrency(d.totalCost)}</p>
          </div>
          <div className="text-center p-2 bg-violet-50 rounded-lg">
            <p className="text-[10px] text-slate-500">Est. Profit</p>
            <p className="font-bold text-violet-700 text-sm">{formatCurrency(d.potentialProfit)}</p>
          </div>
        </div>
        <p className="text-xs text-slate-400">{d.productBreakdown?.length} products in breakdown</p>
      </div>
    );
  }

  if (type === "low_stock_alerts") {
    const rows = data as Array<{ name: string; quantity: number; minimumStock: number; status: string; reorderQty: number }>;
    return (
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-amber-50/50 border border-amber-100">
            <span className="font-medium text-slate-700 truncate">{row.name}</span>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className={row.quantity === 0 ? "text-red-600 font-bold" : "text-amber-600 font-bold"}>
                {row.quantity}/{row.minimumStock}
              </span>
              <Badge className="text-[9px] py-0" variant="outline">
                Reorder: {row.reorderQty}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "stock_status") {
    const d = data as { inStock: number; lowStock: number; outOfStock: number; total: number };
    const items = [
      { label: "In Stock", value: d.inStock, color: "bg-emerald-500" },
      { label: "Low Stock", value: d.lowStock, color: "bg-amber-500" },
      { label: "Out of Stock", value: d.outOfStock, color: "bg-red-500" },
    ];
    return (
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>{item.label}</span>
              <span className="font-semibold">{item.value} / {d.total}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: d.total > 0 ? `${(item.value / d.total) * 100}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export function ReportCard({ report, isAdmin, onDelete }: ReportCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[report.type] || typeConfig.stock_status;
  const Icon = config.icon;

  return (
    <Card className="border-slate-200 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`flex-shrink-0 p-2 rounded-xl bg-slate-100 ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                {report.title}
              </h3>
              {report.description && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {report.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  className={`text-[10px] py-0 ${config.badge}`}
                  variant="outline"
                >
                  {report.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Badge>
                <span className="text-[10px] text-slate-400">
                  {formatDate(report.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </Button>
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(report.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 border-t border-slate-100">
          <div className="mt-3">
            <ReportPreview type={report.type} data={report.data} />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
