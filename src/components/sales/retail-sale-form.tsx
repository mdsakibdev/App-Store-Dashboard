"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiRotateCcw, FiSave, FiTrash2 } from "react-icons/fi";
import { products as mockProducts } from "../../lib/mock-data";
import { initialCustomers } from "../../lib/customer-demo-data";
import type { Sale, SaleItem, SalePaymentMethod } from "../../types/sale";

const SALES_STORAGE_KEY = "phone-store-sales";
const SHOWROOM = "Phone Store (53, New Market)";

type DraftItem = SaleItem & {
  model: string;
  imeiSerial: string;
  discountPercent: number;
  discountAmount: number;
};

const money = (value: number) =>
  `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

export default function RetailSaleForm() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showroom, setShowroom] = useState(SHOWROOM);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [items, setItems] = useState<DraftItem[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [remark, setRemark] = useState("");
  const [warranty, setWarranty] = useState("");
  const [sendSms, setSendSms] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<SalePaymentMethod>("Cash");

  const totalQuantity = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.total + item.discountAmount, 0), [items]);
  const totalItemDiscount = useMemo(() => items.reduce((sum, item) => sum + item.discountAmount, 0), [items]);
  const grandTotal = Math.max(0, totalAmount - discount - totalItemDiscount);
  const paid = Math.min(Math.max(0, amount), grandTotal);
  const due = Math.max(0, grandTotal - paid);

  const fillCustomer = (id: string) => {
    setCustomerId(id);
    const customer = initialCustomers.find((item) => item.id === id);
    if (!customer) return;
    setCustomerName(customer.name);
    setCustomerMobile(customer.mobile);
    setCustomerAddress(customer.address);
  };

  const addProduct = () => {
    if (!selectedProductId) return;
    const product = mockProducts.find((item) => item.id === selectedProductId);
    if (!product || product.stock <= 0) return;

    const existing = items.find((item) => item.productId === product.id);
    if (existing) {
      if (existing.qty >= product.stock) {
        alert(`Only ${product.stock} unit(s) are available.`);
        return;
      }
      setItems((current) =>
        current.map((item) =>
          item.productId === product.id
            ? { ...item, qty: item.qty + 1, total: item.unitPrice * (item.qty + 1) }
            : item
        )
      );
    } else {
      setItems((current) => [
        ...current,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          model: product.sku,
          imeiSerial: "",
          qty: 1,
          unitPrice: product.sellingPrice,
          discountPercent: 0,
          discountAmount: 0,
          total: product.sellingPrice,
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
        const max = mockProducts.find((product) => product.id === item.productId)?.stock ?? 1;
        next.qty = Math.min(Math.max(1, Number(next.qty) || 1), max);
        next.unitPrice = Math.max(0, Number(next.unitPrice) || 0);
        next.discountPercent = Math.min(100, Math.max(0, Number(next.discountPercent) || 0));
        next.discountAmount = next.unitPrice * next.qty * (next.discountPercent / 100);
        next.total = next.unitPrice * next.qty - next.discountAmount;
        return next;
      })
    );
  };

  const removeItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  const resetForm = () => {
    setDate(new Date().toISOString().slice(0, 10));
    setShowroom(SHOWROOM);
    setSelectedProductId("");
    setItems([]);
    setCustomerId("");
    setCustomerName("");
    setCustomerMobile("");
    setCustomerAddress("");
    setRemark("");
    setWarranty("");
    setSendSms(true);
    setDiscount(0);
    setAmount(0);
    setPaymentMethod("Cash");
  };

  const handleSave = () => {
    if (!items.length) {
      alert("Please add at least one product.");
      return;
    }
    if (!customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }

    const generatedInvoice = `SAL-${Date.now().toString().slice(-6)}`;
    const sale: Sale = {
      id: `SALE-${Date.now()}`,
      date,
      showroom,
      invoiceNo: generatedInvoice,
      saleType: due > 0 ? "Due" : "Retail",
      customerId,
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      items: items.map(({ model: _model, imeiSerial: _imei, discountPercent: _percent, discountAmount: _discount, ...item }) => item),
      subTotal: totalAmount,
      discount: discount + totalItemDiscount,
      grandTotal,
      paidAmount: paid,
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
    alert(`Sale ${generatedInvoice} saved successfully.`);
    router.push("/sales");
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
          <h1 className="text-lg font-bold text-slate-800">Add Retail Sale</h1>
          <p className="mt-1 text-xs text-slate-500">Add products, customer information and payment details.</p>
        </div>

        <div className="grid gap-3 p-5 md:grid-cols-[220px_1fr_1.3fr]">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Showroom</label>
            <select value={showroom} onChange={(e) => setShowroom(e.target.value)} className={inputClass}>
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
              <button type="button" onClick={addProduct} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700" aria-label="Add product">
                <FiPlus />
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[1050px] text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-3 py-3">SL</th>
                  <th className="px-3 py-3">Product Name</th>
                  <th className="px-3 py-3">Model</th>
                  <th className="px-3 py-3">IMEI / Serial No.</th>
                  <th className="px-3 py-3">Stock</th>
                  <th className="px-3 py-3">QTY</th>
                  <th className="px-3 py-3">Sale Price</th>
                  <th className="px-3 py-3">Dis. (%)</th>
                  <th className="px-3 py-3">Discount</th>
                  <th className="px-3 py-3">Total</th>
                  <th className="px-3 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr><td colSpan={11} className="px-4 py-10 text-center text-slate-400">No product added yet. Select a product above to start the sale.</td></tr>
                ) : items.map((item, index) => {
                  const stock = mockProducts.find((product) => product.id === item.productId)?.stock ?? 0;
                  return (
                    <tr key={item.id} className="text-slate-700">
                      <td className="px-3 py-2.5 font-semibold">{index + 1}</td>
                      <td className="px-3 py-2.5 font-semibold text-slate-800">{item.productName}</td>
                      <td className="px-3 py-2.5">{item.model}</td>
                      <td className="px-3 py-2.5"><input value={item.imeiSerial} onChange={(e) => updateItem(item.id, { imeiSerial: e.target.value })} placeholder="IMEI / Serial" className="h-8 w-36 rounded-md border border-slate-200 px-2 text-xs text-slate-800 outline-none focus:border-indigo-400" /></td>
                      <td className="px-3 py-2.5 font-medium">{stock}</td>
                      <td className="px-3 py-2.5"><input type="number" min={1} max={stock} value={item.qty} onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })} className="h-8 w-16 rounded-md border border-slate-200 px-2 text-xs text-slate-800 outline-none focus:border-indigo-400" /></td>
                      <td className="px-3 py-2.5"><input type="number" min={0} value={item.unitPrice} onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })} className="h-8 w-24 rounded-md border border-slate-200 px-2 text-xs text-slate-800 outline-none focus:border-indigo-400" /></td>
                      <td className="px-3 py-2.5"><input type="number" min={0} max={100} value={item.discountPercent} onChange={(e) => updateItem(item.id, { discountPercent: Number(e.target.value) })} className="h-8 w-16 rounded-md border border-slate-200 px-2 text-xs text-slate-800 outline-none focus:border-indigo-400" /></td>
                      <td className="px-3 py-2.5 font-medium">{money(item.discountAmount)}</td>
                      <td className="px-3 py-2.5 font-bold text-slate-900">{money(item.total)}</td>
                      <td className="px-3 py-2.5 text-center"><button type="button" onClick={() => removeItem(item.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50" aria-label="Remove product"><FiTrash2 /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-200 p-5">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Name</label><input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" className={inputClass} /></div>
                <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Mobile</label><input value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} placeholder="01XXXXXXXXX" className={inputClass} /></div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Saved Customer</label>
                <select value={customerId} onChange={(e) => fillCustomer(e.target.value)} className={inputClass}>
                  <option value="">Select existing customer (optional)</option>
                  {initialCustomers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} — {customer.mobile}</option>)}
                </select>
              </div>
              <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Address</label><textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={3} placeholder="Customer address" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></div>
              <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">Remark</label><textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={2} placeholder="Optional note" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></div>
              <div className="border-t border-slate-100 pt-4"><label className="mb-1.5 block text-xs font-semibold text-slate-600">Warranty</label><input value={warranty} onChange={(e) => setWarranty(e.target.value)} placeholder="e.g. 1 Year" className={inputClass} /></div>
              <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700"><input type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.checked)} className="h-5 w-5 rounded border-slate-300 accent-indigo-600" />Send SMS</label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
              <div className="space-y-3">
                <SummaryRow label="Total Quantity" value={String(totalQuantity)} />
                <SummaryRow label="Total Amount" value={money(totalAmount)} />
                <div className="grid grid-cols-[1fr_150px] items-center gap-3"><span className="text-right text-xs font-semibold text-slate-600">Total Discount</span><input type="number" min={0} value={discount} onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))} className={inputClass} /></div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3"><span className="text-sm font-bold text-slate-800">Grand Total</span><span className="text-lg font-extrabold text-indigo-700">{money(grandTotal)}</span></div>
                <div className="grid grid-cols-[1fr_150px] items-center gap-3"><span className="text-right text-xs font-semibold text-slate-600">Amount</span><input type="number" min={0} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))} className={inputClass} /></div>
                <div className="grid grid-cols-[1fr_150px] items-center gap-3"><span className="text-right text-xs font-semibold text-slate-600">Paid</span><div className="grid grid-cols-[1fr_110px] gap-2"><input value={paid} readOnly className={`${inputClass} bg-white`} /><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as SalePaymentMethod)} className={inputClass}><option>Cash</option><option>bKash</option><option>Bank</option><option>Cheque</option></select></div></div>
                <div className="grid grid-cols-[1fr_150px] items-center gap-3"><span className="text-right text-xs font-semibold text-slate-600">Due</span><div className={`rounded-lg border px-3 py-2 text-right text-sm font-bold ${due > 0 ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{money(due)}</div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={resetForm} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"><FiRotateCcw /> Reset</button>
          <button type="button" onClick={handleSave} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"><FiSave /> Save Sale</button>
        </div>
      </section>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="grid grid-cols-[1fr_150px] items-center gap-3"><span className="text-right text-xs font-semibold text-slate-600">{label}</span><div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800">{value}</div></div>;
}
