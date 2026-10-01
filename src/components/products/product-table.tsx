"use client";

import { useMemo, useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiEdit3,
    FiEye,
    FiMoreHorizontal,
    FiTrash2,
} from "react-icons/fi";

import type { Product } from "../../types/product";

import ProductDetailsModal from "../products-module/product-details-modal";
import ProductFormModal from "../products-module/product-form-modal";
import ProductToolbar from "./product-toolbar";
import Image from "next/image";

type ProductTableProps = {
    products: Product[];
    onProductsChange: (products: Product[]) => void;
};

export default function ProductTable({
    products,
    onProductsChange,
}: ProductTableProps) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [brand, setBrand] = useState("all");
    const [status, setStatus] = useState("all");

    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] =
        useState<"add" | "edit">("add");

    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);

    const [viewProduct, setViewProduct] =
        useState<Product | null>(null);

    const [deleteProduct, setDeleteProduct] =
        useState<Product | null>(null);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const searchValue = search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                product.name.toLowerCase().includes(searchValue) ||
                product.sku.toLowerCase().includes(searchValue) ||
                product.brand.toLowerCase().includes(searchValue);

            const matchesCategory =
                category === "all" ||
                product.category === category;

            const matchesBrand =
                brand === "all" ||
                product.brand === brand;

            const matchesStatus =
                status === "all" ||
                product.status === status;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesBrand &&
                matchesStatus
            );
        });
    }, [products, search, category, brand, status]);

    function resetFilters() {
        setSearch("");
        setCategory("all");
        setBrand("all");
        setStatus("all");
    }

    function openAddModal() {
        setFormMode("add");
        setSelectedProduct(null);
        setFormOpen(true);
    }

    function openEditModal(product: Product) {
        setFormMode("edit");
        setSelectedProduct(product);
        setFormOpen(true);
    }

    function handleSave(product: Product) {
        const exists = products.some(
            (item) => item.id === product.id,
        );

        if (exists) {
            onProductsChange(
                products.map((item) =>
                    item.id === product.id ? product : item,
                ),
            );
        } else {
            onProductsChange([product, ...products]);
        }

        setFormOpen(false);
        setSelectedProduct(null);
    }

    function handleDelete() {
        if (!deleteProduct) return;

        onProductsChange(
            products.filter(
                (item) => item.id !== deleteProduct.id,
            ),
        );

        setDeleteProduct(null);
    }

    return (
        <div className="space-y-4">
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
                onAddProduct={openAddModal}
            />

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                {/* Header */}
                <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Product List
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Manage your products and inventory.
                        </p>
                    </div>

                    <p className="text-xs text-slate-400">
                        Showing{" "}
                        <span className="font-semibold text-slate-700">
                            {filteredProducts.length}
                        </span>{" "}
                        products
                    </p>
                </div>

                {/* Table */}
                <div className="w-full overflow-hidden">
                    <table className="w-full table-fixed border-collapse">
                        <colgroup>
                            <col className="w-[21%]" />
                            <col className="w-[9%]" />
                            <col className="w-[9%]" />
                            <col className="w-[8%]" />
                            <col className="w-[9%]" />
                            <col className="w-[9%]" />
                            <col className="w-[7%]" />
                            <col className="w-[10%]" />
                            <col className="w-[10%]" />
                            <col className="w-[8%]" />
                        </colgroup>

                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] uppercase tracking-wider text-slate-400">
                                <th className="px-4 py-3 text-left font-semibold">
                                    Product
                                </th>

                                <th className="px-2 py-3 text-left font-semibold">
                                    Category
                                </th>

                                <th className="px-2 py-3 text-left font-semibold">
                                    Brand
                                </th>

                                <th className="px-2 py-3 text-left font-semibold">
                                    Purchase
                                </th>

                                <th className="px-2 py-3 text-left font-semibold">
                                    Selling
                                </th>

                                <th className="px-2 py-3 text-left font-semibold">
                                    Profit
                                </th>

                                <th className="px-2 py-3 text-left font-semibold">
                                    Stock
                                </th>

                                <th className="px-2 py-3 text-left font-semibold">
                                    Status
                                </th>

                                <th className="px-2 py-3 text-left font-semibold">
                                    Warranty
                                </th>

                                <th className="px-2 py-3 text-center font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.map((product) => (
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    onView={() => setViewProduct(product)}
                                    onEdit={() => openEditModal(product)}
                                    onDelete={() => setDeleteProduct(product)}
                                />
                            ))}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                        <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <FiEye className="h-6 w-6" />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-800">
                                No products found
                            </h3>

                            <p className="mt-1 max-w-sm text-xs text-slate-400">
                                Try changing your search keyword or filters.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                    <p className="text-[11px] text-slate-400">
                        Page{" "}
                        <span className="font-semibold text-slate-700">
                            1
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-700">
                            1
                        </span>
                    </p>

                    <div className="flex items-center gap-1">
                        <button
                            className="btn btn-ghost btn-sm btn-square"
                            disabled
                        >
                            <FiChevronLeft className="h-4 w-4" />
                        </button>

                        <button className="btn btn-primary btn-sm btn-square">
                            1
                        </button>

                        <button
                            className="btn btn-ghost btn-sm btn-square"
                            disabled
                        >
                            <FiChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add / Edit */}
            <ProductFormModal
                open={formOpen}
                mode={formMode}
                product={selectedProduct}
                onClose={() => {
                    setFormOpen(false);
                    setSelectedProduct(null);
                }}
                onSave={handleSave}
            />

            {/* View */}
            <ProductDetailsModal
                product={viewProduct}
                onClose={() => setViewProduct(null)}
            />

            {/* Delete */}
            {deleteProduct && (
                <DeleteModal
                    product={deleteProduct}
                    onCancel={() => setDeleteProduct(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}

function ProductRow({
  product,
  onView,
  onEdit,
  onDelete,
}: {
  product: Product;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const profit =
    product.sellingPrice - product.purchasePrice;

  return (
    <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50/70">
      {/* Product */}
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              className="h-9 w-9 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[11px] font-bold text-slate-500">
              {product.brand.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <p
              className="truncate text-xs font-semibold text-slate-800"
              title={product.name}
            >
              {product.name}
            </p>

            <p className="mt-1 truncate text-[10px] text-slate-400">
              {product.sku}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-2 py-3">
        <span className="block truncate text-xs text-slate-500">
          {product.category}
        </span>
      </td>

      {/* Brand */}
      <td className="px-2 py-3">
        <span className="block truncate text-xs font-medium text-slate-700">
          {product.brand}
        </span>
      </td>

      {/* Purchase */}
      <td className="px-2 py-3">
        <span className="whitespace-nowrap text-xs text-slate-500">
          ${product.purchasePrice.toLocaleString()}
        </span>
      </td>

      {/* Selling */}
      <td className="px-2 py-3">
        <span className="whitespace-nowrap text-xs font-semibold text-slate-800">
          ${product.sellingPrice.toLocaleString()}
        </span>
      </td>

      {/* Profit */}
      <td className="px-2 py-3">
        <span
          className={`whitespace-nowrap text-xs font-semibold ${
            profit >= 0
              ? "text-emerald-600"
              : "text-rose-600"
          }`}
        >
          {profit >= 0 ? "+" : "-"}$
          {Math.abs(profit).toLocaleString()}
        </span>
      </td>

      {/* Stock */}
      <td className="px-2 py-3">
        <span
          className={`text-xs font-bold ${
            product.stock === 0
              ? "text-rose-600"
              : product.stock <= 5
                ? "text-amber-600"
                : "text-slate-700"
          }`}
        >
          {product.stock}
        </span>
      </td>

      {/* Status */}
      <td className="px-2 py-3">
        <StatusBadge status={product.status} />
      </td>

      {/* Warranty */}
      <td className="px-2 py-3">
        <span className="block truncate text-xs text-slate-500">
          {product.warranty}
        </span>
      </td>

      {/* Action */}
      <td className="px-1 py-3 text-center">
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            type="button"
            className="btn btn-ghost btn-square btn-sm"
          >
            <FiMoreHorizontal className="h-4 w-4 text-slate-400" />
          </button>

          <ul
            tabIndex={0}
            className="menu dropdown-content z-[50] mt-2 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
          >
            <li>
              <button type="button" onClick={onView}>
                <FiEye className="h-4 w-4" />
                View
              </button>
            </li>

            <li>
              <button type="button" onClick={onEdit}>
                <FiEdit3 className="h-4 w-4" />
                Edit
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={onDelete}
                className="text-error"
              >
                <FiTrash2 className="h-4 w-4" />
                Delete
              </button>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({
  status,
}: {
  status: Product["status"];
}) {
  const styles = {
    "In Stock":
      "bg-emerald-50 text-emerald-600",
    "Low Stock":
      "bg-amber-50 text-amber-600",
    "Out of Stock":
      "bg-rose-50 text-rose-600",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function DeleteModal({
    product,
    onCancel,
    onConfirm,
}: {
    product: Product;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close delete dialog"
                onClick={onCancel}
                className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
            />

            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <FiTrash2 className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-base font-bold text-slate-900">
                    Delete product?
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-slate-800">
                        {product.name}
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-sm h-10 rounded-xl border-slate-200 bg-white px-5 text-xs text-black"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="btn btn-error btn-sm h-10 rounded-xl px-5 text-xs text-white"
                    >
                        Delete Product
                    </button>
                </div>
            </div>
        </div>
    );
}