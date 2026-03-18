"use client";

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Link, Upload, X, ImageIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  categoryId: string;
  sku: string;
  price: number;
  costPrice: number;
  quantity: number;
  minimumStock: number;
  description?: string | null;
  imageUrl?: string | null;
}

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
  product?: Product | null;
}

interface FormState {
  name: string;
  categoryId: string;
  sku: string;
  price: string;
  costPrice: string;
  quantity: string;
  minimumStock: string;
  description: string;
  imageUrl: string;
}

interface FormErrors {
  [key: string]: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  categoryId: "",
  sku: "",
  price: "",
  costPrice: "",
  quantity: "",
  minimumStock: "10",
  description: "",
  imageUrl: "",
};

function validate(form: FormState, imageMode: "url" | "upload"): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Product name is required";
  if (!form.categoryId) errors.categoryId = "Category is required";
  if (!form.sku.trim()) errors.sku = "SKU is required";
  if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
    errors.price = "Valid price is required";
  if (!form.costPrice || isNaN(Number(form.costPrice)) || Number(form.costPrice) < 0)
    errors.costPrice = "Valid cost price is required";
  if (form.quantity === "" || isNaN(Number(form.quantity)) || Number(form.quantity) < 0)
    errors.quantity = "Valid quantity is required";
  if (form.minimumStock === "" || isNaN(Number(form.minimumStock)) || Number(form.minimumStock) < 0)
    errors.minimumStock = "Valid minimum stock is required";
  if (imageMode === "url" && form.imageUrl && !form.imageUrl.startsWith("http"))
    errors.imageUrl = "Must be a valid URL starting with http";
  return errors;
}

export function ProductModal({
  open,
  onClose,
  onSuccess,
  categories,
  product,
}: ProductModalProps) {
  const isEdit = !!product;
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Image upload state
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        categoryId: product.categoryId,
        sku: product.sku,
        price: String(product.price),
        costPrice: String(product.costPrice),
        quantity: String(product.quantity),
        minimumStock: String(product.minimumStock),
        description: product.description || "",
        imageUrl: product.imageUrl || "",
      });
      setImageMode("url");
    } else {
      setForm(EMPTY_FORM);
      setImageMode("url");
    }
    setErrors({});
    setUploadFile(null);
    setUploadPreview("");
  }, [product, open]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, imageUrl: "Please select an image file." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imageUrl: "Image must be under 5MB." }));
      return;
    }
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleUpload = async (): Promise<string | null> => {
    if (!uploadFile) return form.imageUrl || null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setErrors((prev) => ({ ...prev, imageUrl: data.error || "Upload failed." }));
        return null;
      }
      const data = await res.json();
      return data.url as string;
    } catch {
      setErrors((prev) => ({ ...prev, imageUrl: "Upload failed. Please try again." }));
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form, imageMode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = form.imageUrl || null;

      if (imageMode === "upload") {
        if (uploadFile) {
          const uploaded = await handleUpload();
          if (uploaded === null) { setSubmitting(false); return; }
          finalImageUrl = uploaded;
        } else {
          finalImageUrl = form.imageUrl || null;
        }
      }

      const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          imageUrl: finalImageUrl,
          price: parseFloat(form.price),
          costPrice: parseFloat(form.costPrice),
          quantity: parseInt(form.quantity),
          minimumStock: parseInt(form.minimumStock),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Something went wrong");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentImage = imageMode === "upload" ? uploadPreview : form.imageUrl;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Row 1: Name + SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Product Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Laptop Pro"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-1">
              <Label>SKU *</Label>
              <Input
                value={form.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
                placeholder="e.g. ELEC-001"
              />
              {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label>Category *</Label>
            <Select value={form.categoryId} onValueChange={(val) => handleChange("categoryId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
          </div>

          {/* Row 2: Price + Cost Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Selling Price (₦) *</Label>
              <Input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>
            <div className="space-y-1">
              <Label>Cost Price (₦) *</Label>
              <Input
                type="number"
                step="0.01"
                value={form.costPrice}
                onChange={(e) => handleChange("costPrice", e.target.value)}
              />
              {errors.costPrice && <p className="text-xs text-red-500">{errors.costPrice}</p>}
            </div>
          </div>

          {/* Row 3: Quantity + Min Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Quantity *</Label>
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
              {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
            </div>
            <div className="space-y-1">
              <Label>Minimum Stock Level *</Label>
              <Input
                type="number"
                value={form.minimumStock}
                onChange={(e) => handleChange("minimumStock", e.target.value)}
              />
              {errors.minimumStock && <p className="text-xs text-red-500">{errors.minimumStock}</p>}
            </div>
          </div>

          {/* Image — URL or Upload toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Product Image</Label>
              <div className="flex rounded-md border border-slate-200 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => { setImageMode("url"); setUploadFile(null); setUploadPreview(""); }}
                  className={`flex items-center gap-1 px-2.5 py-1 transition-colors ${
                    imageMode === "url"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Link className="w-3 h-3" /> URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`flex items-center gap-1 px-2.5 py-1 transition-colors ${
                    imageMode === "upload"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Upload className="w-3 h-3" /> Upload
                </button>
              </div>
            </div>

            {imageMode === "url" ? (
              <Input
                value={form.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            ) : (
              <div
                className="relative border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {uploadPreview ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadPreview}
                      alt="Preview"
                      className="h-24 w-auto mx-auto rounded-md object-contain"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadFile(null);
                        setUploadPreview("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                    <p className="text-xs text-slate-400">
                      Click to select an image
                    </p>
                    <p className="text-[10px] text-slate-300 mt-0.5">PNG, JPG, WEBP · Max 5MB</p>
                  </div>
                )}
              </div>
            )}

            {/* Preview for URL mode */}
            {imageMode === "url" && form.imageUrl && form.imageUrl.startsWith("http") && (
              <div className="flex items-center gap-2 mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="h-10 w-10 rounded object-cover border border-slate-200"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <span className="text-xs text-slate-400 truncate">{form.imageUrl}</span>
              </div>
            )}

            {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Optional product description..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || uploading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {(submitting || uploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
