"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiPrinter } from "react-icons/fi";
import { products } from "../../lib/mock-data";

type PurchaseItemRow = {
  sl: number;
  date: string;
  voucherNo: string;
  supplier: string;
  showroom: string;
  productName: string;
  model: string;
  purchasePrice: number;
  qty: number;
  total: number;
};

export default function ItemWisePurchase() {
  const [selectedShowroom, setSelectedShowroom] = useState("Phone Store ( 53,New Market )");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [displayList, setDisplayList] = useState<PurchaseItemRow[]>([]);
  const [allData, setAllData] = useState<PurchaseItemRow[]>([]);

  // LocalStorage data decode & flatten to item level
  useEffect(() => {
    const localData = localStorage.getItem("phone-store-purchases");
    let rows: PurchaseItemRow[] = [];

    if (localData) {
      try {
        const purchases = JSON.parse(localData);
        let count = 1;
        purchases.forEach((p: any) => {
          if (p.items && Array.isArray(p.items)) {
            p.items.forEach((item: any) => {
              rows.push({
                sl: count++,
                date: p.date,
                voucherNo: p.voucherNo,
                supplier: p.supplier || "N/A",
                showroom: p.showroom || "Main Branch",
                productName: item.productName,
                model: item.model || "-",
                purchasePrice: item.purchasePrice || 0,
                qty: item.qty || 1,
                total: item.total || 0,
              });
            });
          }
        });
      } catch {
        rows = [];
      }
    }

    setAllData(rows);
    setDisplayList(rows);
  }, []);

  // Filter trigger function on "Show" button
  const handleFilter = () => {
    let filtered = [...allData];

    if (selectedShowroom) {
      filtered = filtered.filter((row) => row.showroom === selectedShowroom);
    }

    if (selectedProduct) {
      filtered = filtered.filter((row) => row.productName === selectedProduct);
    }

    setDisplayList(filtered);
  };

  // Calculations
  const totalQty = displayList.reduce((acc, curr) => acc + curr.qty, 0);
  const totalAmount = displayList.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-4">
      {/* Title Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-lg font-bold text-slate-800">View Item Wise Purchase</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Filter and view purchase details grouped by specific products and showroom.
        </p>
      </div>

      {/* Filter Box Matching Screenshot */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-6">
          {/* Showroom */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
              Showroom
            </label>
            <select
              value={selectedShowroom}
              onChange={(e) => setSelectedShowroom(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 min-w-[240px] focus:bg-white focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="Phone Store ( 53,New Market )">
                Phone Store ( 53,New Market )
              </option>
              <option value="Main Branch">Main Branch</option>
            </select>
          </div>

          {/* Product */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
              Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 min-w-[220px] focus:bg-white focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="">--Select--</option>
              {products.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Show Button */}
          <button
            type="button"
            onClick={handleFilter}
            className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <FiSearch className="h-4 w-4" /> Show
          </button>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Total Purchase Items: {displayList.length}
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="h-8 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5 transition cursor-pointer"
          >
            <FiPrinter /> Print Report
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
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Model/SKU</th>
                <th className="py-3.5 px-4 text-right">Unit Price</th>
                <th className="py-3.5 px-4 text-center">QTY</th>
                <th className="py-3.5 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayList.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    No item wise purchase records found. Select product and click Show.
                  </td>
                </tr>
              ) : (
                displayList.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{row.date}</td>
                    <td className="py-3 px-4 font-bold text-indigo-600">
                      {row.voucherNo}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {row.supplier}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {row.productName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{row.model}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      ৳{row.purchasePrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {row.qty}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ৳{row.total.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {displayList.length > 0 && (
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td colSpan={7} className="py-3 px-4 text-right uppercase">
                    Total:
                  </td>
                  <td className="py-3 px-4 text-center text-indigo-600">
                    {totalQty}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-600">
                    ৳{totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}