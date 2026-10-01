"use client";

import { useEffect, useState } from "react";
import {
  FiFilter,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiX,
} from "react-icons/fi";

type ProductToolbarProps = {
  search: string;
  category: string;
  brand: string;
  status: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  onAddProduct: () => void;
};

const CATEGORY_STORAGE_KEY = "phone-store-categories";
const BRAND_STORAGE_KEY = "phone-store-brands";

const defaultCategories = [
  "Smartphone",
  "Accessories",
  "Tablet",
  "Laptop",
  "Smartwatch",
];

const defaultBrands = [
  "Apple",
  "Samsung",
  "Google",
  "OnePlus",
  "Xiaomi",
  "Oppo",
  "Vivo",
];

const statuses = [
  "In Stock",
  "Low Stock",
  "Out of Stock",
];

export default function ProductToolbar({
  search,
  category,
  brand,
  status,
  onSearchChange,
  onCategoryChange,
  onBrandChange,
  onStatusChange,
  onReset,
  onAddProduct,
}: ProductToolbarProps) {
  const [categories, setCategories] =
    useState<string[]>(defaultCategories);

  const [brands, setBrands] =
    useState<string[]>(defaultBrands);

  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem(
        CATEGORY_STORAGE_KEY,
      );

      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);

        if (Array.isArray(parsed)) {
          const names = parsed
            .map((item) =>
              typeof item === "string"
                ? item
                : item?.name,
            )
            .filter(Boolean);

          if (names.length > 0) {
            setCategories(names);
          }
        }
      }
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error,
      );
    }
  }, []);

  useEffect(() => {
    try {
      const savedBrands = localStorage.getItem(
        BRAND_STORAGE_KEY,
      );

      if (savedBrands) {
        const parsed = JSON.parse(savedBrands);

        if (Array.isArray(parsed)) {
          const names = parsed
            .map((item) =>
              typeof item === "string"
                ? item
                : item?.name,
            )
            .filter(Boolean);

          if (names.length > 0) {
            setBrands(names);
          }
        }
      }
    } catch (error) {
      console.error(
        "Failed to load brands:",
        error,
      );
    }
  }, []);

  const hasFilters =
    search.trim() !== "" ||
    category !== "" ||
    brand !== "" ||
    status !== "";

  return (
    <section className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
      {/* Top row */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FiFilter className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-800">
                Product Filters
              </h2>

              <p className="text-[11px] text-slate-400">
                Search and filter your products.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasFilters && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-sm h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-medium text-gray-800 hover:bg-slate-50"
            >
              <FiX className="h-4 w-4" />
              Clear Filters
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="btn btn-sm h-10 rounded-xl border border-slate-200 bg-white px-3 text-gray-800 hover:bg-slate-50"
            aria-label="Refresh filters"
            title="Reset filters"
          >
            <FiRefreshCw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onAddProduct}
            className="btn btn-primary btn-sm h-10 rounded-xl px-4 text-xs shadow-md shadow-primary/20"
          >
            <FiPlus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="relative sm:col-span-2 xl:col-span-1">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search product, SKU..."
            className="input h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm text-gray-800 placeholder:text-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
          className="select h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-gray-800 outline-none focus:border-primary focus:bg-white"
        >
          <option value="">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Brand */}
        <select
          value={brand}
          onChange={(event) =>
            onBrandChange(event.target.value)
          }
          className="select h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-gray-800 outline-none focus:border-primary focus:bg-white"
        >
          <option value="">All Brands</option>

          {brands.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          className="select h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-gray-800 outline-none focus:border-primary focus:bg-white"
        >
          <option value="">All Status</option>

          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}