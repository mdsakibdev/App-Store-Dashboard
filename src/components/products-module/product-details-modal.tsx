"use client";

import {
  FiBox,
  FiCalendar,
  FiTag,
  FiTruck,
  FiX,
} from "react-icons/fi";

import type { Product } from "../../types/product";

type ProductDetailsModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductDetailsModal({
  product,
  onClose,
}: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Product Details
            </p>

            <h2 className="mt-1 text-base font-bold text-slate-900">
              {product.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-square"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Product */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
              <FiBox className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {product.name}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                SKU: {product.sku}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Detail
              icon={FiTag}
              label="Category"
              value={product.category}
            />

            <Detail
              icon={FiBox}
              label="Brand"
              value={product.brand}
            />

            <Detail
              icon={FiTruck}
              label="Stock"
              value={`${product.stock} units`}
            />

            <Detail
              icon={FiCalendar}
              label="Warranty"
              value={product.warranty}
            />
          </div>

          {/* Prices */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-[10px] font-medium text-slate-400">
                Purchase Price
              </p>

              <p className="mt-2 text-lg font-bold text-slate-800">
                ${product.purchasePrice.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
              <p className="text-[10px] font-medium text-slate-400">
                Selling Price
              </p>

              <p className="mt-2 text-lg font-bold text-primary">
                ${product.sellingPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 p-4">
            <span className="text-xs font-medium text-slate-500">
              Current Status
            </span>

            <Status status={product.status} />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary mt-5 h-11 w-full rounded-xl text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FiBox;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-3.5 w-3.5" />

        <span className="text-[10px]">{label}</span>
      </div>

      <p className="mt-2 text-xs font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function Status({ status }: { status: Product["status"] }) {
  const styles = {
    "In Stock": "bg-emerald-50 text-emerald-600",
    "Low Stock": "bg-amber-50 text-amber-600",
    "Out of Stock": "bg-rose-50 text-rose-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}