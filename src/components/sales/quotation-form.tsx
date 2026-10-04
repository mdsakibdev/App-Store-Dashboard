"use client";

import { useMemo, useState } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiPlus,
  FiTrash2,
  FiUser,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  FiShield,
} from "react-icons/fi";

type QuotationItem = {
  id: string;
  name: string;
  model: string;
  quantity: number;
  salePrice: number;
};

const PRODUCTS = [
  { name: "iPhone 16 Pro Max", model: "A3296", stock: 8, price: 145000 },
  { name: "Samsung Galaxy S25 Ultra", model: "SM-S938B", stock: 12, price: 132000 },
  { name: "Google Pixel 10 Pro", model: "G5J7N", stock: 6, price: 98000 },
  { name: "OnePlus 13", model: "CPH2653", stock: 10, price: 89000 },
];

const SHOWROOMS = [
  "Phone Store (53, New Market)",
  "Main Showroom",
  "Uttara Showroom",
];

function money(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function QuotationForm() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [showroom, setShowroom] = useState(SHOWROOMS[0]);
  const [product, setProduct] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [remark, setRemark] = useState("");
  const [warranty, setWarranty] = useState("");
  const [discount, setDiscount] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [saved, setSaved] = useState(false);

  const selectedProduct = PRODUCTS.find((item) => item.name === product);

  function addProduct() {
    if (!selectedProduct) return;

    setItems((current) => {
      const existing = current.find((item) => item.name === selectedProduct.name);
      if (existing) {
        return current.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: Math.min(item.quantity + 1, selectedProduct.stock) }
            : item
        );
      }
      return [
        ...current,
        {
          id: crypto.randomUUID(),
          name: selectedProduct.name,
          model: selectedProduct.model,
          quantity: 1,
          salePrice: selectedProduct.price,
        },
      ];
    });
    setProduct("");
    setSaved(false);
  }

  function updateItem(id: string, field: "quantity" | "salePrice", value: number) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const productInfo = PRODUCTS.find((p) => p.name === item.name);
        const next = Math.max(0, value || 0);
        return {
          ...item,
          [field]:
            field === "quantity"
              ? Math.max(1, Math.min(next, productInfo?.stock ?? 999))
              : next,
        };
      })
    );
    setSaved(false);
  }

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.salePrice, 0),
    [items]
  );
  const totalDiscount = Math.max(0, Number(discount) || 0);
  const charge = Math.max(0, Number(serviceCharge) || 0);
  const grandTotal = Math.max(0, totalAmount - totalDiscount + charge);

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    setSaved(false);
  }

  function resetForm() {
    setDate(today);
    setShowroom(SHOWROOMS[0]);
    setProduct("");
    setItems([]);
    setName("");
    setMobile("");
    setAddress("");
    setRemark("");
    setWarranty("");
    setDiscount("");
    setServiceCharge("");
    setSaved(false);
  }

  function saveQuotation() {
    if (!name.trim() || items.length === 0) return;

    const quotation = {
      id: crypto.randomUUID(),
      quotationNo: `QTN-${Date.now().toString().slice(-6)}`,
      date,
      showroom,
      customer: { name, mobile, address },
      items,
      totalQuantity,
      totalAmount,
      totalDiscount,
      serviceCharge: charge,
      grandTotal,
      remark,
      warranty,
      status: "Pending",
    };

    const key = "phone-store-quotations";
    const current = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([quotation, ...current]));
    setSaved(true);
  }

  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">
                Add Quotation
              </h1>
              <p className="text-sm text-slate-500">
                Prepare a professional quotation for your customer.
              </p>
            </div>
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              New Quotation
            </span>
          </div>
        </header>

        <div className="space-y-6 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 md:grid-cols-[180px_1fr_1fr]">
            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Showroom">
              <Select
                value={showroom}
                onChange={setShowroom}
                placeholder="Select Showroom"
                options={SHOWROOMS}
              />
            </Field>
            <Field label="Select Product">
              <div className="flex gap-2">
                <Select
                  value={product}
                  onChange={setProduct}
                  placeholder="Select Product"
                  options={PRODUCTS.map((item) => item.name)}
                />
                <button
                  type="button"
                  onClick={addProduct}
                  disabled={!selectedProduct}
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-content shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiPlus />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            </Field>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">SL</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">QTY</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="mx-auto max-w-sm">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                          <FiPlus className="h-5 w-5" />
                        </div>
                        <p className="font-semibold text-slate-700">No products added</p>
                        <p className="mt-1 text-xs text-slate-400">
                          Select a product above to add it to this quotation.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600">{item.model}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                          className="h-9 w-20 rounded-lg border border-slate-200 px-2 text-sm text-gray-800 outline-none focus:border-primary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          value={item.salePrice}
                          onChange={(e) => updateItem(item.id, "salePrice", Number(e.target.value))}
                          className="h-9 w-28 rounded-lg border border-slate-200 px-2 text-sm text-gray-800 outline-none focus:border-primary"
                        />
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {money(item.quantity * item.salePrice)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100"
                          aria-label={`Remove ${item.name}`}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <SectionTitle title="Customer Information" />
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field icon={<FiUser />} label="Name">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Customer name"
                      className={inputClass}
                    />
                  </Field>
                  <Field icon={<FiPhone />} label="Mobile">
                    <input
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className={inputClass}
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field icon={<FiMapPin />} label="Address">
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Customer address"
                        className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm text-gray-800 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field icon={<FiMessageSquare />} label="Remark">
                  <textarea
                    rows={3}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Optional remark"
                    className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm text-gray-800 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </Field>
                <Field icon={<FiShield />} label="Warranty">
                  <input
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="e.g. 1 Year"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h2 className="text-sm font-bold text-slate-800">Quotation Summary</h2>
              <div className="mt-4 space-y-3">
                <Summary label="Total Quantity" value={String(totalQuantity)} />
                <Summary label="Total Amount" value={money(totalAmount)} />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-600">Total Discount</span>
                  <input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="0"
                    className="h-10 w-36 rounded-lg border border-slate-200 bg-white px-3 text-right text-sm text-gray-800"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-600">Service Charge</span>
                  <input
                    type="number"
                    min={0}
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(e.target.value)}
                    placeholder="0"
                    className="h-10 w-36 rounded-lg border border-slate-200 bg-white px-3 text-right text-sm text-gray-800"
                  />
                </div>
                <div className="my-2 border-t border-slate-200" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Grand Total</span>
                  <span className="text-2xl font-extrabold text-primary">{money(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {saved && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Quotation saved successfully.
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-gray-800 transition hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={saveQuotation}
              disabled={!name.trim() || items.length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-content shadow-md shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiCheck className="h-4 w-4" />
              Save Quotation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

function Field({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-sm font-bold text-slate-800">{title}</h2>;
}

function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-10`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}
