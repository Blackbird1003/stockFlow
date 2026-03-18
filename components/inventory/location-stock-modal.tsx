"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
}

interface LocationStockItem {
  productId: string;
  locationId: string;
  quantity: number;
  product: { id: string; name: string; sku: string };
}

interface Location {
  id: string;
  name: string;
}

interface LocationStockModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  location: Location | null;
  allProducts: Product[];
}

export function LocationStockModal({
  open,
  onClose,
  onSuccess,
  location,
  allProducts,
}: LocationStockModalProps) {
  const [stockItems, setStockItems] = useState<LocationStockItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && location) {
      fetchStock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, location]);

  const fetchStock = async () => {
    if (!location) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/locations/${location.id}/stock`);
      if (res.ok) {
        const json = await res.json();
        const items: LocationStockItem[] = json.products ?? [];
        setStockItems(items);
        const initQty: Record<string, string> = {};
        items.forEach((item) => {
          initQty[item.productId] = String(item.quantity);
        });
        setQuantities(initQty);
      }
    } catch {
      setError("Failed to load stock data.");
    } finally {
      setLoading(false);
    }
  };

  const assignStock = async (productId: string) => {
    if (!location) return;
    const qty = parseInt(quantities[productId] ?? "0");
    if (isNaN(qty) || qty < 0) return;
    setSaving(productId);
    try {
      const res = await fetch(`/api/locations/${location.id}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty }),
      });
      if (res.ok) {
        onSuccess();
        await fetchStock();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update stock.");
      }
    } catch {
      setError("An error occurred.");
    } finally {
      setSaving(null);
    }
  };

  const productList = allProducts.map((p) => {
    const existing = stockItems.find((s) => s.productId === p.id);
    return { ...p, locationQty: existing?.quantity ?? 0 };
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" />
            Stock at {location?.name}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
          ) : allProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No products available. Add products first.
            </div>
          ) : (
            productList.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                  <p className="text-xs text-slate-400">
                    {product.sku} · Total stock: {product.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Input
                    type="number"
                    min="0"
                    value={quantities[product.id] ?? String(product.locationQty)}
                    onChange={(e) =>
                      setQuantities((prev) => ({ ...prev, [product.id]: e.target.value }))
                    }
                    className="w-20 text-sm h-8"
                    placeholder="0"
                  />
                  <Button
                    size="sm"
                    className="h-8 bg-indigo-600 hover:bg-indigo-500 text-xs px-3"
                    onClick={() => assignStock(product.id)}
                    disabled={saving === product.id}
                  >
                    {saving === product.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Set"
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-100">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
