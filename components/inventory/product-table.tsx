"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Trash2, Package, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, getStockStatus } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  quantity: number;
  minimumStock: number;
  categoryId: string;
  description?: string | null;
  imageUrl?: string | null;
  category: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function StatusBadge({ quantity, minimumStock }: { quantity: number; minimumStock: number }) {
  const status = getStockStatus(quantity, minimumStock);

  if (status === "out_of_stock") {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
        Out of Stock
      </Badge>
    );
  }
  if (status === "low_stock") {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
        Low Stock
      </Badge>
    );
  }
  return (
    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
      In Stock
    </Badge>
  );
}

export function ProductTable({ products, categories, isAdmin, onEdit, onDelete }: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Product | "category.name">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = products
    .filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "all" || p.category.id === categoryFilter;
      const matchStatus =
        statusFilter === "all" ||
        getStockStatus(p.quantity, p.minimumStock) === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      if (sortField === "category.name") {
        aVal = a.category.name;
        bVal = b.category.name;
      } else if (sortField === "price" || sortField === "quantity") {
        aVal = a[sortField] as number;
        bVal = b[sortField] as number;
      } else {
        aVal = (a[sortField as keyof Product] as string) || "";
        bVal = (b[sortField as keyof Product] as string) || "";
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    <span className={cn("ml-1 text-xs", sortField === field ? "text-indigo-600" : "text-slate-300")}>
      {sortField === field ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-14">Image</TableHead>
              <TableHead
                className="cursor-pointer hover:text-indigo-600"
                onClick={() => toggleSort("name")}
              >
                Product <SortIcon field="name" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-indigo-600 hidden md:table-cell"
                onClick={() => toggleSort("category.name")}
              >
                Category <SortIcon field="category.name" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-indigo-600 text-right"
                onClick={() => toggleSort("price")}
              >
                Price <SortIcon field="price" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-indigo-600 text-center"
                onClick={() => toggleSort("quantity")}
              >
                Qty <SortIcon field="quantity" />
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Package className="w-10 h-10 opacity-40" />
                    <p className="text-sm font-medium">No products found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  <TableCell>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <Package className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{product.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{product.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-xs font-normal">
                      {product.category.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-700">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        "font-bold text-sm",
                        product.quantity === 0
                          ? "text-red-600"
                          : product.quantity <= product.minimumStock
                          ? "text-amber-600"
                          : "text-emerald-600"
                      )}
                    >
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge quantity={product.quantity} minimumStock={product.minimumStock} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(product)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-2 bg-slate-50">
            <p className="text-xs text-slate-400">
              Showing {filtered.length} of {products.length} products
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
