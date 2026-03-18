"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Plus, FolderOpen, RefreshCw, MapPin, Layers } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { ProductTable } from "@/components/inventory/product-table";
import { ProductModal } from "@/components/inventory/product-modal";
import { CategoryModal } from "@/components/inventory/category-modal";
import { LocationModal } from "@/components/inventory/location-modal";
import { LocationStockModal } from "@/components/inventory/location-stock-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

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
  description?: string | null;
  _count?: { products: number };
}

interface Location {
  id: string;
  name: string;
  description?: string | null;
  _count?: { products: number };
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-14 rounded-lg" />
      ))}
    </div>
  );
}

export default function InventoryPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  // Product modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Category modals
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  // Location modals
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [locationStockModalOpen, setLocationStockModalOpen] = useState(false);
  const [stockLocation, setStockLocation] = useState<Location | null>(null);

  // Delete dialogs
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [deleteLocationId, setDeleteLocationId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [productsRes, categoriesRes, locationsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/locations"),
      ]);
      if (productsRes.ok) setProducts(await productsRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (locationsRes.ok) setLocations(await locationsRes.json());
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/products/${deleteProductId}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteProductId));
      } else {
        const json = await res.json();
        alert(json.error);
      }
    } catch {
      alert("Delete failed");
    } finally {
      setDeleteLoading(false);
      setDeleteProductId(null);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/categories/${deleteCategoryId}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== deleteCategoryId));
      } else {
        alert(json.error);
      }
    } catch {
      alert("Delete failed");
    } finally {
      setDeleteLoading(false);
      setDeleteCategoryId(null);
    }
  };

  const handleDeleteLocation = async () => {
    if (!deleteLocationId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/locations/${deleteLocationId}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok) {
        setLocations((prev) => prev.filter((l) => l.id !== deleteLocationId));
      } else {
        alert(json.error);
      }
    } catch {
      alert("Delete failed");
    } finally {
      setDeleteLoading(false);
      setDeleteLocationId(null);
    }
  };

  const lowStockCount = products.filter((p) => p.quantity <= p.minimumStock).length;

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title="Inventory"
        description="Manage your products, categories and locations"
        alertCount={lowStockCount}
      />

      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="products">
                Products
                <Badge className="ml-2 bg-indigo-600 text-white text-[10px] py-0">
                  {products.length}
                </Badge>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="categories">
                  Categories
                  <Badge className="ml-2 bg-slate-500 text-white text-[10px] py-0">
                    {categories.length}
                  </Badge>
                </TabsTrigger>
              )}
              <TabsTrigger value="locations">
                Locations
                <Badge className="ml-2 bg-emerald-600 text-white text-[10px] py-0">
                  {locations.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                className="gap-1.5 text-slate-600"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>

              {activeTab === "products" && (
                <Button
                  onClick={() => { setEditProduct(null); setProductModalOpen(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              )}

              {activeTab === "categories" && isAdmin && (
                <Button
                  onClick={() => { setEditCategory(null); setCategoryModalOpen(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </Button>
              )}

              {activeTab === "locations" && isAdmin && (
                <Button
                  onClick={() => { setEditLocation(null); setLocationModalOpen(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Location
                </Button>
              )}
            </div>
          </div>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-0">
            {loading ? (
              <TableSkeleton />
            ) : (
              <ProductTable
                products={products}
                categories={categories}
                isAdmin={isAdmin}
                onEdit={handleEditProduct}
                onDelete={(p) => setDeleteProductId(p.id)}
              />
            )}
          </TabsContent>

          {/* Categories Tab */}
          {isAdmin && (
            <TabsContent value="categories" className="mt-0">
              {loading ? (
                <TableSkeleton />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">No categories yet</p>
                      <Button
                        size="sm"
                        className="mt-3 bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => { setEditCategory(null); setCategoryModalOpen(true); }}
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add First Category
                      </Button>
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                              <FolderOpen className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800 text-sm">{cat.name}</h3>
                              <p className="text-xs text-slate-400">{cat._count?.products || 0} products</p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                              onClick={() => { setEditCategory(cat); setCategoryModalOpen(true); }}
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setDeleteCategoryId(cat.id)}
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                        {cat.description && (
                          <p className="text-xs text-slate-400 mt-2 line-clamp-2">{cat.description}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </TabsContent>
          )}

          {/* Locations Tab */}
          <TabsContent value="locations" className="mt-0">
            {loading ? (
              <TableSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No locations yet</p>
                    {isAdmin && (
                      <Button
                        size="sm"
                        className="mt-3 bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => { setEditLocation(null); setLocationModalOpen(true); }}
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add First Location
                      </Button>
                    )}
                  </div>
                ) : (
                  locations.map((loc) => (
                    <div
                      key={loc.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 text-sm">{loc.name}</h3>
                            <p className="text-xs text-slate-400">
                              {loc._count?.products || 0} product assignments
                            </p>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                              onClick={() => { setEditLocation(loc); setLocationModalOpen(true); }}
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setDeleteLocationId(loc.id)}
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                              </svg>
                            </Button>
                          </div>
                        )}
                      </div>
                      {loc.description && (
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{loc.description}</p>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 w-full h-7 text-xs gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                        onClick={() => { setStockLocation(loc); setLocationStockModalOpen(true); }}
                      >
                        <Layers className="w-3 h-3" />
                        Manage Stock
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Modal */}
      <ProductModal
        open={productModalOpen}
        onClose={() => { setProductModalOpen(false); setEditProduct(null); }}
        onSuccess={fetchData}
        categories={categories}
        product={editProduct}
      />

      {/* Category Modal */}
      <CategoryModal
        open={categoryModalOpen}
        onClose={() => { setCategoryModalOpen(false); setEditCategory(null); }}
        onSuccess={fetchData}
        category={editCategory}
      />

      {/* Location Modal */}
      <LocationModal
        open={locationModalOpen}
        onClose={() => { setLocationModalOpen(false); setEditLocation(null); }}
        onSuccess={fetchData}
        location={editLocation}
      />

      {/* Location Stock Modal */}
      <LocationStockModal
        open={locationStockModalOpen}
        onClose={() => { setLocationStockModalOpen(false); setStockLocation(null); }}
        onSuccess={fetchData}
        location={stockLocation}
        allProducts={products}
      />

      {/* Delete Product Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone and will remove all associated inventory logs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteProduct}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={!!deleteCategoryId} onOpenChange={(open) => !open && setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Delete this category? If it has products, deletion will be blocked. Move products to another category first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteCategory}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Location Dialog */}
      <AlertDialog open={!!deleteLocationId} onOpenChange={(open) => !open && setDeleteLocationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Delete this location? All stock assignments for this location will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteLocation}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
