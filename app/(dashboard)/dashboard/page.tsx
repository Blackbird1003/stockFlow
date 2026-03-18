"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { StockStatusChart } from "@/components/dashboard/stock-status-chart";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { BestSellers } from "@/components/dashboard/best-sellers";
import { RecordSaleModal } from "@/components/dashboard/record-sale-modal";
import { AlertTriangle, Package, ArrowRight, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    totalInventoryValue: number;
    avgStockLevel: number;
    stockHealthScore: number;
    reorderCost: number;
    avgProductPrice: number;
    totalSalesValue: number;
    totalUnitsSold: number;
  };
  categoryData: Array<{ name: string; products: number; totalQuantity: number }>;
  stockStatusData: Array<{ name: string; value: number; color: string }>;
  lowStockAlerts: Array<{
    id: string;
    name: string;
    quantity: number;
    minimumStock: number;
    category: string;
    status: string;
  }>;
  salesAnalytics: {
    bestSellers: Array<{ name: string; sku: string; units: number; revenue: number }>;
    salesTrend: Array<{ date: string; value: number }>;
    slowMovers: Array<{ id: string; name: string; quantity: number; category: string }>;
  };
}


function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Skeleton className="lg:col-span-3 h-64 rounded-xl" />
        <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl w-full" />
      <Skeleton className="h-48 rounded-xl w-full" />
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saleModalOpen, setSaleModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const alertCount = data ? data.stats.lowStock + data.stats.outOfStock : 0;

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title="Dashboard"
        description="Overview of your inventory performance"
        alertCount={alertCount}
      />

      <div className="flex-1 p-6 space-y-5">
        {/* Record Sale Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => setSaleModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Record Sale
          </Button>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : data ? (
          <>
            {/* Stats Cards — 10 cards, 5 per row on large screens */}
            <StatsCards stats={data.stats} />

            {/* Inventory Charts — Category (3/5) + Stock Status (2/5) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3">
                <CategoryChart data={data.categoryData} />
              </div>
              <div className="lg:col-span-2">
                <StockStatusChart data={data.stockStatusData} />
              </div>
            </div>

            {/* Sales Trend Chart — full width */}
            <SalesChart data={data.salesAnalytics.salesTrend} />

            {/* Best Sellers + Slow Movers — full width, equal columns inside */}
            <BestSellers
              bestSellers={data.salesAnalytics.bestSellers}
              slowMovers={data.salesAnalytics.slowMovers}
            />

            {/* Low Stock Alerts */}
            {data.lowStockAlerts.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Low Stock Alerts
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 ml-1">
                        {data.lowStockAlerts.length}
                      </Badge>
                    </CardTitle>
                    <Link href="/inventory">
                      <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1">
                        View all <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.lowStockAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100 hover:border-amber-200 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${alert.status === "out_of_stock" ? "bg-red-500" : "bg-amber-500"}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{alert.name}</p>
                            <p className="text-xs text-slate-400">{alert.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-2">
                          <div className="text-right">
                            <p className={`text-sm font-bold ${alert.quantity === 0 ? "text-red-600" : "text-amber-600"}`}>
                              {alert.quantity}
                            </p>
                            <p className="text-xs text-slate-400">/ {alert.minimumStock} min</p>
                          </div>
                          <Badge
                            className={alert.status === "out_of_stock" ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}
                            variant="outline"
                          >
                            {alert.status === "out_of_stock" ? "Out of Stock" : "Low Stock"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Failed to load dashboard data</p>
              <Button variant="outline" size="sm" onClick={fetchData} className="mt-3">Retry</Button>
            </div>
          </div>
        )}
      </div>

      <RecordSaleModal
        open={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
