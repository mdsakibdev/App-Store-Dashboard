"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiCheck,
  FiImage,
  FiUpload,
  FiX,
} from "react-icons/fi";

import type { Product } from "../../types/product";

type ProductFormModalProps = {
  open: boolean;
  mode: "add" | "edit";
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
};

type FormData = {
  name: string;
  sku: string;
  category: string;
  brand: string;
  purchasePrice: string;
  sellingPrice: string;
  stock: string;
  warranty: string;
  image: string;
};

type SelectItem = {
  id?: string;
  name: string;
  status?: string;
};

const PRODUCTS_CATEGORIES_KEY = "phone-store-categories";
const PRODUCTS_BRANDS_KEY = "phone-store-brands";

const emptyForm: FormData = {
  name: "",
  sku: "",
  category: "",
  brand: "",
  purchasePrice: "",
  sellingPrice: "",
  stock: "",
  warranty: "",
  image: "",
};

export default function ProductFormModal({
  open,
  mode,
  product,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const [form, setForm] = useState<FormData>(emptyForm);

  const [categories, setCategories] = useState<SelectItem[]>([]);
  const [brands, setBrands] = useState<SelectItem[]>([]);

  const [error, setError] = useState("");

  /*
   * Load Categories and Brands
   */
  useEffect(() => {
    if (!open) return;

    try {
      const savedCategories = localStorage.getItem(
        PRODUCTS_CATEGORIES_KEY,
      );

      const savedBrands = localStorage.getItem(
        PRODUCTS_BRANDS_KEY,
      );

      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);

        if (Array.isArray(parsedCategories)) {
          const formattedCategories: SelectItem[] =
            parsedCategories
              .map((item) => {
                if (typeof item === "string") {
                  return {
                    name: item,
                  };
                }

                return {
                  id: item.id,
                  name:
                    item.name ??
                    item.title ??
                    item.category ??
                    "",
                  status: item.status,
                };
              })
              .filter(
                (item) =>
                  item.name.trim().length > 0,
              );

          setCategories(formattedCategories);
        }
      }

      if (savedBrands) {
        const parsedBrands = JSON.parse(savedBrands);

        if (Array.isArray(parsedBrands)) {
          const formattedBrands: SelectItem[] =
            parsedBrands
              .map((item) => {
                if (typeof item === "string") {
                  return {
                    name: item,
                  };
                }

                return {
                  id: item.id,
                  name:
                    item.name ??
                    item.title ??
                    item.brand ??
                    "",
                  status: item.status,
                };
              })
              .filter(
                (item) =>
                  item.name.trim().length > 0,
              );

          setBrands(formattedBrands);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load categories or brands:",
        error,
      );
    }
  }, [open]);

  /*
   * Load Product Data
   */
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && product) {
      setForm({
        name: product.name,
        sku: product.sku,
        category: product.category,
        brand: product.brand,
        purchasePrice: String(
          product.purchasePrice,
        ),
        sellingPrice: String(
          product.sellingPrice,
        ),
        stock: String(product.stock),
        warranty: product.warranty,
        image: product.image ?? "",
      });
    } else {
      setForm(emptyForm);
    }

    setError("");
  }, [open, mode, product]);

  if (!open) return null;

  function updateField(
    field: keyof FormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file.",
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Image size must be less than 2MB.",
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        updateField("image", result);
      }
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.sku.trim() ||
      !form.category ||
      !form.brand ||
      !form.purchasePrice ||
      !form.sellingPrice ||
      form.stock === ""
    ) {
      setError(
        "Please fill in all required fields.",
      );
      return;
    }

    const purchasePrice = Number(
      form.purchasePrice,
    );

    const sellingPrice = Number(
      form.sellingPrice,
    );

    const stock = Number(form.stock);

    if (
      Number.isNaN(purchasePrice) ||
      Number.isNaN(sellingPrice) ||
      Number.isNaN(stock)
    ) {
      setError("Please enter valid numbers.");
      return;
    }

    if (
      purchasePrice < 0 ||
      sellingPrice < 0 ||
      stock < 0
    ) {
      setError(
        "Price and stock cannot be negative.",
      );
      return;
    }

    const status: Product["status"] =
      stock === 0
        ? "Out of Stock"
        : stock <= 5
          ? "Low Stock"
          : "In Stock";

    const newProduct: Product = {
      id: product?.id ?? crypto.randomUUID(),
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      category: form.category,
      brand: form.brand,
      purchasePrice,
      sellingPrice,
      stock,
      status,
      warranty:
        form.warranty || "No Warranty",
      image: form.image || undefined,
    };

    onSave(newProduct);
  }

  const purchase =
    Number(form.purchasePrice) || 0;

  const selling =
    Number(form.sellingPrice) || 0;

  const profit = selling - purchase;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {mode === "add"
                ? "Add New Product"
                : "Edit Product"}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {mode === "add"
                ? "Add a new product to your inventory."
                : "Update product information and inventory."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-square"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-xs font-medium text-error">
              {error}
            </div>
          )}

          {/* Image */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Product Image
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                {form.image ? (
                  <>
                    <Image
                      src={form.image}
                      alt="Product preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "image",
                          "",
                        )
                      }
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <FiImage className="h-7 w-7 text-slate-300" />
                )}
              </div>

              <div>
                <label className="btn btn-sm h-10 cursor-pointer rounded-xl border-slate-200 bg-white px-4 text-xs text-gray-700">
                  <FiUpload className="h-4 w-4" />
                  Choose Image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-2 text-[10px] text-slate-400">
                  JPG, PNG or WEBP. Maximum 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                Product Name{" "}
                <span className="text-error">
                  *
                </span>
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  updateField(
                    "name",
                    e.target.value,
                  )
                }
                placeholder="e.g. iPhone 16 Pro Max"
                className="input h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                SKU{" "}
                <span className="text-error">
                  *
                </span>
              </label>

              <input
                type="text"
                value={form.sku}
                onChange={(e) =>
                  updateField(
                    "sku",
                    e.target.value,
                  )
                }
                placeholder="e.g. IP16PM-256"
                className="input h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm uppercase outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                Category{" "}
                <span className="text-error">
                  *
                </span>
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  updateField(
                    "category",
                    e.target.value,
                  )
                }
                className="select h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm"
              >
                <option value="">
                  Select category
                </option>

                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option
                      key={
                        category.id ??
                        category.name
                      }
                      value={category.name}
                    >
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option
                    value=""
                    disabled
                  >
                    No categories found
                  </option>
                )}
              </select>

              {categories.length === 0 && (
                <p className="mt-1.5 text-[10px] text-amber-600">
                  Add a category first from
                  Categories.
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                Brand{" "}
                <span className="text-error">
                  *
                </span>
              </label>

              <select
                value={form.brand}
                onChange={(e) =>
                  updateField(
                    "brand",
                    e.target.value,
                  )
                }
                className="select h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm"
              >
                <option value="">
                  Select brand
                </option>

                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <option
                      key={
                        brand.id ??
                        brand.name
                      }
                      value={brand.name}
                    >
                      {brand.name}
                    </option>
                  ))
                ) : (
                  <option
                    value=""
                    disabled
                  >
                    No brands found
                  </option>
                )}
              </select>

              {brands.length === 0 && (
                <p className="mt-1.5 text-[10px] text-amber-600">
                  Add a brand first from
                  Brands.
                </p>
              )}
            </div>

            {/* Warranty */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                Warranty
              </label>

              <select
                value={form.warranty}
                onChange={(e) =>
                  updateField(
                    "warranty",
                    e.target.value,
                  )
                }
                className="select h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm"
              >
                <option value="">
                  Select warranty
                </option>

                <option value="1 Year">
                  1 Year
                </option>

                <option value="6 Months">
                  6 Months
                </option>

                <option value="3 Months">
                  3 Months
                </option>

                <option value="No Warranty">
                  No Warranty
                </option>
              </select>
            </div>

            {/* Purchase */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                Purchase Price{" "}
                <span className="text-error">
                  *
                </span>
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.purchasePrice
                  }
                  onChange={(e) =>
                    updateField(
                      "purchasePrice",
                      e.target.value,
                    )
                  }
                  placeholder="0.00"
                  className="input h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-8 text-sm"
                />
              </div>
            </div>

            {/* Selling */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                Selling Price{" "}
                <span className="text-error">
                  *
                </span>
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.sellingPrice
                  }
                  onChange={(e) =>
                    updateField(
                      "sellingPrice",
                      e.target.value,
                    )
                  }
                  placeholder="0.00"
                  className="input h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-8 text-sm"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                Stock Quantity{" "}
                <span className="text-error">
                  *
                </span>
              </label>

              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) =>
                  updateField(
                    "stock",
                    e.target.value,
                  )
                }
                placeholder="0"
                className="input h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm"
              />
            </div>
          </div>

          {/* Profit Preview */}
          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-slate-400">
                  Estimated Profit
                </p>

                <p
                  className={`mt-1 text-xl font-bold ${
                    profit >= 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {profit >= 0 ? "+" : "-"}$
                  {Math.abs(
                    profit,
                  ).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-slate-400">
                  Margin
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  {selling > 0
                    ? `${(
                        (profit / selling) *
                        100
                      ).toFixed(1)}%`
                    : "0%"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-7 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm h-11 rounded-xl border-slate-200 bg-white px-5 text-xs text-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-sm h-11 rounded-xl px-5 text-xs shadow-md shadow-primary/20"
            >
              <FiCheck className="h-4 w-4" />

              {mode === "add"
                ? "Add Product"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}