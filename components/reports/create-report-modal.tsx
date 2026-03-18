"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart3, DollarSign, AlertTriangle, PieChart, Loader2 } from "lucide-react";

const reportTypes = [
  {
    id: "category_performance",
    title: "Category Performance",
    description: "Analyze product count, quantities, and value per category",
    icon: BarChart3,
    color: "indigo",
  },
  {
    id: "inventory_value",
    title: "Inventory Value",
    description: "Full valuation report with cost, retail, and profit breakdown",
    icon: DollarSign,
    color: "emerald",
  },
  {
    id: "low_stock_alerts",
    title: "Low Stock Alerts",
    description: "List of all products at or below minimum stock levels",
    icon: AlertTriangle,
    color: "amber",
  },
  {
    id: "stock_status",
    title: "Stock Status Distribution",
    description: "In stock vs low stock vs out of stock breakdown",
    icon: PieChart,
    color: "violet",
  },
];

const colorMap: Record<string, string> = {
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-100",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-600 hover:border-emerald-400 hover:bg-emerald-100",
  amber: "border-amber-200 bg-amber-50 text-amber-600 hover:border-amber-400 hover:bg-amber-100",
  violet: "border-violet-200 bg-violet-50 text-violet-600 hover:border-violet-400 hover:bg-violet-100",
};

const selectedColorMap: Record<string, string> = {
  indigo: "border-indigo-500 bg-indigo-100 ring-2 ring-indigo-300",
  emerald: "border-emerald-500 bg-emerald-100 ring-2 ring-emerald-300",
  amber: "border-amber-500 bg-amber-100 ring-2 ring-amber-300",
  violet: "border-violet-500 bg-violet-100 ring-2 ring-violet-300",
};

interface CreateReportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateReportModal({ open, onClose, onSuccess }: CreateReportModalProps) {
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selected }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed to generate report");
        return;
      }

      onSuccess();
      onClose();
      setSelected("");
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Generate New Report</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 py-3">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selected === type.id;

            return (
              <button
                key={type.id}
                onClick={() => setSelected(type.id)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer",
                  isSelected ? selectedColorMap[type.color] : colorMap[type.color]
                )}
              >
                <div className={cn("p-2 rounded-lg flex-shrink-0 mt-0.5")}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{type.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{type.description}</p>
                </div>
                {isSelected && (
                  <div className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-current flex items-center justify-center">
                    <svg viewBox="0 0 12 12" className="w-3 h-3 text-white fill-current">
                      <path d="M10 3L5 8.5L2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!selected || loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Generate Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
