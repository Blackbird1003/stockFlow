"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface StockStatusData {
  name: string;
  value: number;
  color: string;
}

interface StockStatusChartProps {
  data: StockStatusData[];
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number;
}) => {
  if (!percent || percent < 0.05) return null;
  const r1 = innerRadius ?? 0;
  const r2 = outerRadius ?? 0;
  const angle = midAngle ?? 0;
  const radius = r1 + (r2 - r1) * 0.5;
  const x = (cx ?? 0) + radius * Math.cos(-angle * RADIAN);
  const y = (cy ?? 0) + radius * Math.sin(-angle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold" fontSize={12}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.color }}
          />
          <p className="font-semibold text-slate-800 text-sm">{payload[0].name}</p>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Count: <span className="font-bold text-slate-700">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function StockStatusChart({ data }: StockStatusChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800">
          Stock Status Distribution
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          {total} total products across all categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend stats */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {data.map((item) => (
            <div key={item.name} className="text-center p-2 rounded-lg bg-slate-50">
              <div
                className="w-2 h-2 rounded-full mx-auto mb-1"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-sm font-bold text-slate-800">{item.value}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{item.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
