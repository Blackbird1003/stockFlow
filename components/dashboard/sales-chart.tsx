"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SalesTrendPoint {
  date: string;
  value: number;
}

interface SalesChartProps {
  data: SalesTrendPoint[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-indigo-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export function SalesChart({ data }: SalesChartProps) {
  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
    value: d.value,
  }));

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Sales Trend (7 Days)
          </CardTitle>
          <span className="text-sm font-bold text-indigo-600">{formatCurrency(total)}</span>
        </div>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="h-40 flex items-center justify-center text-sm text-slate-400">
            No sales recorded in the last 7 days
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={formatted} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366f1" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
