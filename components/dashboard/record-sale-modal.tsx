"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

interface RecordSaleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RecordSaleModal({ open, onClose, onSuccess }: RecordSaleModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      fetch("/api/products")
        .then((r) => r.json())
        .then((data) => setProducts(Array.isArray(data) ? data.filter((p: Product) => p.quantity > 0) : []));
      setProductId("");
      setQuantity("1");
      setError("");
    }
  }, [open]);

  const selectedProduct = products.find((p) => p.id === productId);
  const totalAmount = selectedProduct ? selectedProduct.price * parseInt(quantity || "0") : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !quantity || parseInt(quantity) <= 0) {
      setError("Please select a product and enter a valid quantity.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: parseInt(quantity) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to record sale.");
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-500" />
            Record Sale
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          <div className="space-y-1.5">
            <Label>Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {formatCurrency(p.price)} ({p.quantity} in stock)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Quantity Sold</Label>
            <Input
              type="number"
              min="1"
              max={selectedProduct?.quantity || 9999}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
            />
            {selectedProduct && (
              <p className="text-xs text-slate-400">Max available: {selectedProduct.quantity}</p>
            )}
          </div>

          {selectedProduct && parseInt(quantity) > 0 && (
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Price per unit:</span>
                <span className="font-medium">{formatCurrency(selectedProduct.price)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-600">Total amount:</span>
                <span className="font-bold text-indigo-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Recording...</> : "Record Sale"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
