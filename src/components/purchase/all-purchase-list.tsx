"use client";

import { useState, useEffect } from "react";
import { FiCalendar, FiSearch, FiPrinter, FiEye, FiTrash2 } from "react-icons/fi";
import { products } from "../../lib/mock-data";

type PurchaseRecord = {
  id: string;
  date: string;
  showroom: string;
  voucherNo: string;
  supplier: string;
  items: { productName: string; qty: number; purchasePrice: number; total: number }[];
  subTotal: number;
  totalDiscount: number;
  transportCost: number;
  grandTotal: number;
  paidAmount: number;
  paymentMethod: string;
  currentBalance: number;
  createdAt: string;
};

// Initial Mock Purchases data for preview
const initialMockPurchases: PurchaseRecord[] = [
  {
    id: "PUR-1001",
    date: "2026-10-01",
    showroom: "Phone Store ( 53,New Market )",
    voucherNo: "VOUCH-9982",
    supplier: "Apple BD Official",
    items: [
      { productName: "iPhone 15 Pro Max", qty: 2, purchasePrice: 1020, total: 2040 },
    ],
    subTotal: 2040,
    totalDiscount: 40,
    transportCost: 10,
    grandTotal: 2010,
    paidAmount: 2010,
    paymentMethod: "Cash",
    currentBalance: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "PUR-1002",
    date: "2026-10-02",
    showroom: "Main Branch",
    voucherNo: "VOUCH-9983",
    supplier: "Samsung Distribution",
    items: [
      { productName: "Samsung Galaxy S24 Ultra", qty: 1, purchasePrice: 940, total: 940 },
    ],
    subTotal: 940,
    totalDiscount: 0,
    transportCost: 15,
    grandTotal: 955,
    paidAmount: 500,
    paymentMethod: "bKash",
    currentBalance: 455,
    createdAt: new Date().toISOString(),
  },
];

export default function AllPurchaseList() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<PurchaseRecord[]>([]);

  // Filter states matching screenshot UI
  const [selectedShowroom, setSelectedShowroom] = useState("");
  const [voucherNo, setVoucherNo] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Load purchase data from localStorage
  useEffect(() => {
    const localData = localStorage.getItem("phone-store-purchases");
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setPurchases(parsed.length > 0 ? parsed : initialMockPurchases);
        setFilteredPurchases(parsed.length > 0 ? parsed : initialMockPurchases);
      } catch {
        setPurchases(initialMockPurchases);
        setFilteredPurchases(initialMockPurchases);
      }
    } else {
      setPurchases(initialMockPurchases);
      setFilteredPurchases(initialMockPurchases);
      localStorage.setItem("phone-store-purchases", JSON.stringify(initialMockPurchases));
    }
  }, []);

  // Filter trigger function
  const handleFilter = () => {
    let result = [...purchases];

    if (selectedShowroom) {
      result = result.filter((p) => p.showroom === selectedShowroom);
    }
    if (voucherNo) {
      result = result.filter((p) =>
        p.voucherNo.toLowerCase().includes(voucherNo.toLowerCase())
      );
    }
    if (selectedSupplier) {
      result = result.filter((p) => p.supplier === selectedSupplier);
    }
    if (selectedProduct) {
      result = result.filter((p) =>
        p.items.some((item) => item.productName === selectedProduct)
      );
    }
    if (fromDate) {
      result = result.filter((p) => p.date >= fromDate);
    }
    if (toDate) {
      result = result.filter((p) => p.date <= toDate);
    }

    setFilteredPurchases(result);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this purchase record?")) {
      const updated = purchases.filter((p) => p.id !== id);
      setPurchases(updated);
      setFilteredPurchases(updated);
      localStorage.setItem("phone-store-purchases", JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-4">
      {/* Title Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-lg font-bold text-slate-800">View All Purchase</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Filter and review all purchase invoices created in the system.
        </p>
      </div>

      {/* Filter Options Bar matching screenshot */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          {/* Showroom */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Showroom</label>
            <select
              value={selectedShowroom}
              onChange={(e) => setSelectedShowroom(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-primary focus:outline-hidden"
            >
              <option value="">-- Select Showroom --</option>
              <option value="Phone Store ( 53,New Market )">Phone Store ( 53,New Market )</option>
              <option value="Main Branch">Main Branch</option>
            </select>
          </div>

          {/* Voucher No */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Voucher No</label>
            <input
              type="text"
              placeholder="Voucher No"
              value={voucherNo}
              onChange={(e) => setVoucherNo(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-primary focus:outline-hidden"
            />
          </div>

          {/* Supplier */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Supplier</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-primary focus:outline-hidden"
            >
              <option value="">-- Select Supplier --</option>
              <option value="Apple BD Official">Apple BD Official</option>
              <option value="Samsung Distribution">Samsung Distribution</option>
            </select>
          </div>

          {/* Product */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-primary focus:outline-hidden"
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <FiCalendar /> From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-primary focus:outline-hidden"
            />
          </div>

          {/* To Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <FiCalendar /> To
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Show Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleFilter}
            className="h-10 px-6 bg-primary hover:bg-primary/90 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <FiSearch className="h-4 w-4" /> Show
          </button>
        </div>
      </div>

      {/* Purchase List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Total Purchase Invoices: {filteredPurchases.length}
          </span>
          <button
            onClick={() => window.print()}
            className="h-8 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5 transition cursor-pointer"
          >
            <FiPrinter /> Print List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">SL</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Voucher No</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Showroom</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-right">Paid</th>
                <th className="py-3.5 px-4 text-right">Due Balance</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 font-medium">
                    No purchase records found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 text-slate-700">{item.date}</td>
                    <td className="py-3 px-4 font-bold text-primary">{item.voucherNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.supplier || "N/A"}</td>
                    <td className="py-3 px-4 text-slate-600">{item.showroom}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ৳{item.grandTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">
                      ৳{item.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">
                      ৳{item.currentBalance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          title="View Details"
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}