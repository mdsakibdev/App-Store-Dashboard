"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiPrinter, FiTrash2, FiEye } from "react-icons/fi";

type PurchaseReturnRecord = {
  id: string;
  date: string;
  showroom: string;
  supplier: string;
  items: Array<{
    id: string;
    productName: string;
    model: string;
    stock: number;
    qty: number;
    purchasePrice: number;
    total: number;
  }>;
  totalAmount: number;
  grandTotal: number;
  previousBalance: number;
  currentBalance: number;
  createdAt: string;
};

export default function AllPurchaseReturnList() {
  const [returns, setReturns] = useState<PurchaseReturnRecord[]>([]);
  const [filteredReturns, setFilteredReturns] = useState<PurchaseReturnRecord[]>([]);

  // Filter States matching screenshot
  const [selectedShowroom, setSelectedShowroom] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Load saved returns from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("phone-store-purchase-returns");
    if (savedData) {
      try {
        const parsed: PurchaseReturnRecord[] = JSON.parse(savedData);
        setReturns(parsed);
        setFilteredReturns(parsed);
      } catch {
        setReturns([]);
        setFilteredReturns([]);
      }
    }
  }, []);

  // Filter Logic on "Show" click
  const handleFilter = () => {
    let result = [...returns];

    if (selectedShowroom) {
      result = result.filter((item) => item.showroom === selectedShowroom);
    }

    if (selectedModel) {
      result = result.filter((item) =>
        item.items.some((i) => i.model === selectedModel || i.productName.includes(selectedModel))
      );
    }

    if (fromDate) {
      result = result.filter((item) => item.date >= fromDate);
    }

    if (toDate) {
      result = result.filter((item) => item.date <= toDate);
    }

    setFilteredReturns(result);
  };

  // Delete Record
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this purchase return entry?")) {
      const updated = returns.filter((r) => r.id !== id);
      setReturns(updated);
      setFilteredReturns(updated);
      localStorage.setItem("phone-store-purchase-returns", JSON.stringify(updated));
    }
  };

  // Summary Calculations
  const grandTotalSum = filteredReturns.reduce((acc, curr) => acc + curr.grandTotal, 0);

  return (
    <div className="space-y-4">
      {/* Page Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-lg font-bold text-slate-800">All Purchase Return</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View, search, and manage all previously recorded purchase return invoices.
        </p>
      </div>

      {/* Filter Options Matching Screenshot */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-center">
          {/* Showroom */}
          <div>
            <select
              value={selectedShowroom}
              onChange={(e) => setSelectedShowroom(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="">-- Select Showroom --</option>
              <option value="Phone Store ( 53,New Market )">
                Phone Store ( 53,New Market )
              </option>
              <option value="Main Branch">Main Branch</option>
            </select>
          </div>

          {/* Product Model */}
          <div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="">-- Select Product model --</option>
              <option value="iPhone 15 Pro">iPhone 15 Pro</option>
              <option value="Samsung Galaxy S24">Samsung Galaxy S24</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <input
              type="date"
              placeholder="From"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          {/* Date To */}
          <div>
            <input
              type="date"
              placeholder="To"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          {/* Show Button */}
          <div>
            <button
              type="button"
              onClick={handleFilter}
              className="w-full h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <FiSearch className="h-4 w-4" /> Show
            </button>
          </div>
        </div>
      </div>

      {/* Return Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Total Return Records: {filteredReturns.length}
          </span>
          <button
            type="button"
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
                <th className="py-3.5 px-4">Return ID</th>
                <th className="py-3.5 px-4">Showroom</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4 text-center">Total Items</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    No purchase return records found.
                  </td>
                </tr>
              ) : (
                filteredReturns.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{item.date}</td>
                    <td className="py-3 px-4 font-bold text-indigo-600">
                      {item.id}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{item.showroom}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {item.supplier}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {item.items ? item.items.length : 0}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ৳{item.grandTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          title="View Details"
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          title="Delete Record"
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
            {filteredReturns.length > 0 && (
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-right uppercase">
                    Total Return Amount:
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-600">
                    ৳{grandTotalSum.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}