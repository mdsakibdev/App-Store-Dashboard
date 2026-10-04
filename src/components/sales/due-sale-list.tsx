"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCalendar, FiPlus, FiRotateCcw, FiSave, FiTrash2 } from "react-icons/fi";
import { products as mockProducts } from "../../lib/mock-data";
import { initialCustomers } from "../../lib/customer-demo-data";
import type { Sale, SaleItem, SalePaymentMethod } from "../../types/sale";

const SALES_STORAGE_KEY = "phone-store-sales";
const SHOWROOM = "Phone Store (53, New Market)";

type DraftItem = SaleItem & {
  model: string;
  commissionPercent: number;
  commission: number;
};

const money = (value: number) =>
  `৳${value.toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

export default function DueSaleList() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showroom, setShowroom] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [items, setItems] = useState<DraftItem[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [warranty, setWarranty] = useState("");
  const [sendSms, setSendSms] = useState(true);
  const [paid, setPaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<SalePaymentMethod>("Cash");

  const totalQuantity = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.total, 0), [items]);
  const totalCommission = useMemo(() => items.reduce((sum, item) => sum + item.commission, 0), [items]);
  const grandTotal = total;

  const previousBalance = useMemo(() => {
    if (!customerId) return 0;
    try {
      const sales = JSON.parse(localStorage.getItem(SALES_STORAGE_KEY) || "[]") as Sale[];
      return sales
        .filter((sale) => sale.customerId === customerId)
        .reduce((sum, sale) => sum + sale.dueAmount, 0);
    } catch {
      return 0;
    }
  }, [customerId, items]);

  const safePaid = Math.min(Math.max(0, paid), grandTotal);
  const due = Math.max(0, grandTotal - safePaid);
  const receivable = previousBalance + due;

  const selectCustomer = (id: string) => {
    setCustomerId(id);
    const customer = initialCustomers.find((item) => item.id === id);
    setMobile(customer?.mobile ?? "");
    setAddress(customer?.address ?? "");
  };

  const addProduct = () => {
    if (!selectedProductId) return;
    const product = mockProducts.find((item) => item.id === selectedProductId);
    if (!product || product.stock <= 0) return;

    const existing = items.find((item) => item.productId === product.id);
    if (existing) {
      if (existing.qty >= product.stock) return;
      setItems((current) =>
        current.map((item) =>
          item.productId === product.id
            ? { ...item, qty: item.qty + 1, total: item.unitPrice * (item.qty + 1), commission: item.unitPrice * (item.qty + 1) * (item.commissionPercent / 100) }
            : item,
        ),
      );
    } else {
      setItems((current) => [
        ...current,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          qty: 1,
          unitPrice: product.sellingPrice,
          total: product.sellingPrice,
          commissionPercent: 0,
          commission: 0,
        },
      ]);
      if (!warranty) setWarranty(product.warranty);
    }
    setSelectedProductId("");
  };

  const updateItem = (id: string, patch: Partial<DraftItem>) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, ...patch };
        const stock = mockProducts.find((product) => product.id === item.productId)?.stock ?? 1;
        next.qty = Math.min(Math.max(1, Number(next.qty) || 1), stock);
        next.unitPrice = Math.max(0, Number(next.unitPrice) || 0);
        next.commissionPercent = Math.min(100, Math.max(0, Number(next.commissionPercent) || 0));
        next.total = next.unitPrice * next.qty;
        next.commission = next.total * (next.commissionPercent / 100);
        return next;
      }),
    );
  };

  const reset = () => {
    setDate(new Date().toISOString().slice(0, 10));
    setShowroom("");
    setSelectedProductId("");
    setItems([]);
    setCustomerId("");
    setMobile("");
    setAddress("");
    setWarranty("");
    setSendSms(true);
    setPaid(0);
    setPaymentMethod("Cash");
  };

  const save = () => {
    if (!showroom) return alert("Please select showroom.");
    if (!customerId) return alert("Please select a client.");
    if (!items.length) return alert("Please add at least one product.");

    const customer = initialCustomers.find((item) => item.id === customerId);
    const invoiceNo = `CS-${Date.now().toString().slice(-6)}`;
    const sale: Sale = {
      id: `SALE-${Date.now()}`,
      date,
      showroom,
      invoiceNo,
      saleType: "Due",
      customerId,
      customerName: customer?.name ?? "",
      customerMobile: mobile.trim(),
      items: items.map(({ model: _model, commissionPercent: _commissionPercent, commission: _commission, ...item }) => item),
      subTotal: total,
      discount: 0,
      grandTotal,
      paidAmount: safePaid,
      dueAmount: due,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    let sales: Sale[] = [];
    try {
      sales = JSON.parse(localStorage.getItem(SALES_STORAGE_KEY) || "[]") as Sale[];
    } catch {
      sales = [];
    }
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify([sale, ...sales]));
    alert(`Credit Sale ${invoiceNo} saved successfully.`);
    router.push("/sales");
  };

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
          <h1 className="text-lg font-bold text-slate-800">Add Credit Sale</h1>
        </div>

        <div className="grid gap-3 p-5 md:grid-cols-[260px_1fr_1.35fr]">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Date</label>
            <div className="relative">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${inputClass} pr-10`} />
              <FiCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Showroom</label>
            <select value={showroom} onChange={(e) => setShowroom(e.target.value)} className={inputClass}>
              <option value="">-- Select Showroom --</option>
              <option>Phone Store (53, New Market)</option>
              <option>Main Branch</option>
              <option>Chittagong Branch</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Select Product</label>
            <div className="flex gap-2">
              <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className={`${inputClass} min-w-0`}>
                <option value="">Select Product</option>
                {mockProducts.map((product) => (
                  <option key={product.id} value={product.id} disabled={product.stock <= 0}>
                    {product.name} — {product.stock} in stock
                  </option>
                ))}
              </select>
              <button type="button" onClick={addProduct} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" aria-label="Add product"><FiPlus /></button>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[930px] text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                <tr><th className="px-3 py-3">SL</th><th className="px-3 py-3">Product Name</th><th className="px-3 py-3">Model</th><th className="px-3 py-3">Stock</th><th className="px-3 py-3">Quantity</th><th className="px-3 py-3">Sale Price</th><th className="px-3 py-3">Com.(%)</th><th className="px-3 py-3">Commission</th><th className="px-3 py-3">Total</th><th className="px-3 py-3 text-center">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? <tr><td colSpan={10} className="px-4 py-10 text-center text-slate-400">No product added yet. Select a product above to start the credit sale.</td></tr> : items.map((item, index) => {
                  const stock = mockProducts.find((product) => product.id === item.productId)?.stock ?? 0;
                  return <tr key={item.id} className="text-slate-700">
                    <td className="px-3 py-2.5 font-semibold">{index + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">{item.productName}</td>
                    <td className="px-3 py-2.5">{item.model}</td>
                    <td className="px-3 py-2.5 font-medium">{stock}</td>
                    <td className="px-3 py-2.5"><input type="number" min={1} max={stock} value={item.qty} onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })} className="h-8 w-20 rounded-md border border-slate-200 px-2 text-xs text-gray-800 outline-none focus:border-indigo-400" /></td>
                    <td className="px-3 py-2.5"><input type="number" min={0} value={item.unitPrice} onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })} className="h-8 w-24 rounded-md border border-slate-200 px-2 text-xs text-gray-800 outline-none focus:border-indigo-400" /></td>
                    <td className="px-3 py-2.5"><input type="number" min={0} max={100} value={item.commissionPercent} onChange={(e) => updateItem(item.id, { commissionPercent: Number(e.target.value) })} className="h-8 w-20 rounded-md border border-slate-200 px-2 text-xs text-gray-800 outline-none focus:border-indigo-400" /></td>
                    <td className="px-3 py-2.5 font-medium">{money(item.commission)}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-900">{money(item.total)}</td>
                    <td className="px-3 py-2.5 text-center"><button type="button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50" aria-label="Remove product"><FiTrash2 /></button></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-6 border-t border-slate-200 px-5 py-5 lg:grid-cols-2">
          <div className="space-y-4">
            <FieldRow label="Client"><select value={customerId} onChange={(e) => selectCustomer(e.target.value)} className={inputClass}><option value="">Select Client</option>{initialCustomers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></FieldRow>
            <FieldRow label="Mobile"><input value={mobile} onChange={(e) => setMobile(e.target.value)} className={inputClass} /></FieldRow>
            <FieldRow label="Address"><textarea value={address} onChange={(e) => setAddress(e.target.value)} className="min-h-16 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></FieldRow>
            <div className="border-t border-slate-200 pt-4"><FieldRow label="Warranty"><textarea value={warranty} onChange={(e) => setWarranty(e.target.value)} className="min-h-16 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></FieldRow></div>
            <div className="flex items-center gap-3 pt-1"><span className="w-28 shrink-0 text-right text-sm font-semibold text-slate-700">Send Sms</span><input type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.checked)} className="checkbox checkbox-primary" /></div>
          </div>

          <div className="space-y-3 lg:pl-3">
            <SummaryRow label="Total Quantity"><input readOnly value={totalQuantity} className={readOnlyClass} /></SummaryRow>
            <SummaryRow label="Total"><input readOnly value={total} className={readOnlyClass} /></SummaryRow>
            <SummaryRow label="Total Commission"><input readOnly value={totalCommission.toFixed(2)} className={readOnlyClass} /></SummaryRow>
            <SummaryRow label="Grand Total"><input readOnly value={grandTotal.toFixed(2)} className={readOnlyClass} /></SummaryRow>
            <SummaryRow label="Previous Balance"><div className="grid grid-cols-2 gap-3"><input readOnly value={previousBalance} className={readOnlyClass} /><input readOnly value={previousBalance} className={readOnlyClass} /></div></SummaryRow>
            <SummaryRow label="Paid"><div className="grid grid-cols-2 gap-3"><input type="number" min={0} max={grandTotal} value={paid || ""} onChange={(e) => setPaid(Number(e.target.value) || 0)} className={inputClass} placeholder="0" /><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as SalePaymentMethod)} className={inputClass}><option>Cash</option><option>bKash</option><option>Bank</option><option>Cheque</option></select></div></SummaryRow>
            <SummaryRow label="Due"><div className="grid grid-cols-2 gap-3"><input readOnly value={due} className={readOnlyClass} /><input readOnly value="Receivable" className={`${readOnlyClass} text-center`} /></div></SummaryRow>
            <div className="grid grid-cols-[7rem_1fr] items-center gap-3 pt-2"><span className="text-right text-sm font-semibold text-slate-700">Receivable</span><input readOnly value={receivable} className={`${readOnlyClass} font-semibold text-rose-600`} /></div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={reset} className="btn btn-ghost text-gray-800"><FiRotateCcw /> Reset</button>
          <button type="button" onClick={save} className="btn border-0 bg-indigo-600 text-white hover:bg-indigo-700"><FiSave /> Save</button>
        </div>
      </div>
    </section>
  );
}

const readOnlyClass = "h-10 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-gray-800 outline-none";

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid grid-cols-[7rem_1fr] items-start gap-3"><label className="pt-2 text-right text-sm font-semibold text-slate-700">{label}</label>{children}</div>;
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid grid-cols-[7rem_1fr] items-center gap-3"><span className="text-right text-sm font-semibold text-slate-700">{label}</span><div>{children}</div></div>;
}
