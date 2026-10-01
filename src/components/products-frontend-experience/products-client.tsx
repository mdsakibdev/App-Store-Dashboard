"use client";

import { useEffect, useMemo, useState } from "react";

import {
  FiAlertTriangle,
  FiBox,
  FiPackage,
  FiXCircle,
} from "react-icons/fi";

import ProductTable from "../../components/products/product-table";
import type { Product } from "../../types/product";


import ProductToolbar from "../../components/products/product-toolbar";



type ProductsClientProps = {
  initialProducts: Product[];
};

const STORAGE_KEY = "phone-store-products";

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const [products, setProducts] =
    useState<Product[]>(initialProducts);

  const [hydrated, setHydrated] =
    useState(false);

  // Filters
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [status, setStatus] =
    useState("");

  // Load products from localStorage
  useEffect(() => {
    try {
      const savedProducts =
        localStorage.getItem(STORAGE_KEY);

      if (savedProducts) {
        const parsedProducts =
          JSON.parse(savedProducts);

        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load products:",
        error,
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save products
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products),
      );
    } catch (error) {
      console.error(
        "Failed to save products:",
        error,
      );
    }
  }, [products, hydrated]);

  // Filter products
  const filteredProducts = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchValue ||
        product.name
          .toLowerCase()
          .includes(searchValue) ||
        product.sku
          .toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        !category ||
        product.category === category;

      const matchesBrand =
        !brand ||
        product.brand === brand;

      const matchesStatus =
        !status ||
        product.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesStatus
      );
    });
  }, [
    products,
    search,
    category,
    brand,
    status,
  ]);

  function resetFilters() {
    setSearch("");
    setCategory("");
    setBrand("");
    setStatus("");
  }

  function handleAddProduct() {
    /**
     * ProductTable-এর existing Add Product
     * button/modal logic যদি ProductTable-এর
     * ভিতরে থাকে, তাহলে toolbar-এর button
     * আপাতত সেই logic trigger করবে না।
     *
     * আমরা পরের step-এ Add Product modal-কে
     * shared state-এ আনব।
     */
    window.dispatchEvent(
      new CustomEvent("phone-store:add-product"),
    );
  }

  // Summary
  const totalProducts =
    products.length;

  const totalStock =
    products.reduce(
      (total, product) =>
        total + product.stock,
      0,
    );

  const lowStock =
    products.filter(
      (product) =>
        product.status === "Low Stock",
    ).length;

  const outOfStock =
    products.filter(
      (product) =>
        product.status === "Out of Stock",
    ).length;

  const summary = [
    {
      title: "Total Products",
      value: totalProducts,
      description: "All products",
      icon: FiBox,
      iconClass:
        "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Stock",
      value: totalStock,
      description: "Available units",
      icon: FiPackage,
      iconClass:
        "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Low Stock",
      value: lowStock,
      description: "Need attention",
      icon: FiAlertTriangle,
      iconClass:
        "bg-amber-50 text-amber-600",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      description:
        "Currently unavailable",
      icon: FiXCircle,
      iconClass:
        "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <>
      {/* Summary */}
      <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {item.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-gray-800">
                    {item.value.toLocaleString()}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Toolbar */}
      <ProductToolbar
        search={search}
        category={category}
        brand={brand}
        status={status}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onBrandChange={setBrand}
        onStatusChange={setStatus}
        onReset={resetFilters}
        onAddProduct={handleAddProduct}
      />

      {/* Result information */}
      <div className="mb-3 flex flex-col gap-1 px-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {products.length}
          </span>{" "}
          products
        </p>

        {(search ||
          category ||
          brand ||
          status) && (
          <button
            type="button"
            onClick={resetFilters}
            className="w-fit text-xs font-medium text-primary hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Product Table */}
      <ProductTable
        products={filteredProducts}
        onProductsChange={setProducts}
      />
    </>
  );
}