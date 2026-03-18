"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BestSeller {
  name: string;
  sku: string;
  units: number;
  revenue: number;
}

interface SlowMover {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

interface BestSellersProps {
  bestSellers: BestSeller[];
  slowMovers: SlowMover[];
}

const rankColors = ["text-amber-500", "text-slate-400", "text-orange-700", "text-slate-500", "text-slate-500"];

export function BestSellers({ bestSellers, slowMovers }: BestSellersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Best Sellers */}
      <Card className="border-slate-200 h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Best Sellers (30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bestSellers.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No sales recorded yet</p>
          ) : (
            <div className="space-y-1.5">
              {bestSellers.map((item, i) => (
                <div key={item.sku} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className={`text-sm font-bold w-6 text-center shrink-0 ${rankColors[i]}`}>#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.units} units sold</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 shrink-0">{formatCurrency(item.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slow Movers */}
      <Card className="border-slate-200 h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-500" />
            Slow-Moving Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          {slowMovers.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">All products have recent sales</p>
          ) : (
            <div className="space-y-1.5">
              {slowMovers.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50 transition-colors gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 truncate">{item.category} · {item.quantity} in stock</p>
                  </div>
                  <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full shrink-0">No sales</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
