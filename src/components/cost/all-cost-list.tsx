"use client";

import { useState } from "react";
import Link from "next/link";
import { FiPlus, FiSearch, FiTrash2, FiEye, FiX } from "react-icons/fi";

interface CostItem {
  id: string;
  date: string;
  category: string;
  fieldOfCost: string;
  amount: number;
  paymentMethod: string;
  referenceNo: string;
  note?: string;
}

const MOCK_COSTS: CostItem[] = [
  {
    id: "EXP-002",
    date: "2026-10-02",
    category: "Office Expenses",
    fieldOfCost: "Rent",
    amount: 25000,
    paymentMethod: "Bank Transfer",
    referenceNo: "TRF-554109",
    note: "Showroom monthly rent",
  },
  {
    id: "EXP-003",
    date: "2026-10-03",
    category: "Office Expenses",
    fieldOfCost: "Office Snacks",
    amount: 1200,
    paymentMethod: "Cash",
    referenceNo: "REC-102",
    note: "Tea and snacks for staff",
  },
  {
    id: "EXP-004",
    date: "2026-10-04",
    category: "Marketing & Ads",
    fieldOfCost: "Facebook Ads",
    amount: 8000,
    paymentMethod: "Card",
    referenceNo: "FB-88912",
    note: "Product promotion campaign",
  },
];

export function AllCostList() {
  const [costs, setCosts] = useState<CostItem[]>(MOCK_COSTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCost, setSelectedCost] = useState<CostItem | null>(null);

  const categories = ["All", "Office Expenses", "Utility Bills", "Marketing & Ads", "Salary & Wages"];

  const filteredCosts = costs.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fieldOfCost.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referenceNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalExpense = filteredCosts.reduce((sum, item) => sum + item.amount, 0);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this expense record?")) {
      setCosts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Records</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{filteredCosts.length}</p>
        </div>

        <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Expense Amount</p>
          <p className="text-2xl font-bold text-red-600 mt-1">৳ {totalExpense.toLocaleString("en-BD")}</p>
        </div>

        {/* Quick Action Card with Clean New Cost Button */}
        <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Quick Action</p>
            <p className="text-xs text-gray-500 mt-0.5">Add new company expense</p>
          </div>
          <Link
            href="/cost/new"
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all duration-150"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Cost</span>
          </Link>
        </div>
      </div>

      {/* Toolbar: Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by ID, field or ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-56 border border-gray-300 text-sm rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Expense Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">DATE</th>
                <th className="px-4 py-3.5">REF / ID</th>
                <th className="px-4 py-3.5">CATEGORY</th>
                <th className="px-4 py-3.5">FIELD OF COST</th>
                <th className="px-4 py-3.5">PAYMENT METHOD</th>
                <th className="px-4 py-3.5 text-right">AMOUNT (৳)</th>
                <th className="px-4 py-3.5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCosts.length > 0 ? (
                filteredCosts.map((cost) => (
                  <tr key={cost.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{cost.date}</td>
                    <td className="px-4 py-3.5 font-medium text-gray-900 whitespace-nowrap">{cost.id}</td>
                    
                    {/* Fixed Category Badge - High Contrast Text & Clear Pill Styling */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {cost.category}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-gray-800">{cost.fieldOfCost}</td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{cost.paymentMethod}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-red-600 whitespace-nowrap">
                      ৳ {cost.amount.toLocaleString("en-BD")}
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="View Details"
                          onClick={() => setSelectedCost(cost)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(cost.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No expense records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clean & Fully Opaque View Details Modal */}
      {selectedCost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="font-bold text-lg text-gray-900">Expense Details</h3>
              <button
                onClick={() => setSelectedCost(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Sharp & Clear Text */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Expense ID:</span>
                <span className="font-semibold text-gray-900">{selectedCost.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium text-gray-900">{selectedCost.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs border border-indigo-100">
                  {selectedCost.category}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Field of Cost:</span>
                <span className="font-medium text-gray-900">{selectedCost.fieldOfCost}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-medium text-gray-900">{selectedCost.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Reference No:</span>
                <span className="font-medium text-gray-900">{selectedCost.referenceNo || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-100 mt-2">
                <span className="font-semibold text-gray-900">Total Amount:</span>
                <span className="font-bold text-red-600 text-base">
                  ৳ {selectedCost.amount.toLocaleString("en-BD")}
                </span>
              </div>

              {selectedCost.note && (
                <div className="pt-2">
                  <span className="text-gray-500 block text-xs font-medium mb-1">Note / Description:</span>
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs text-gray-700">
                    {selectedCost.note}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedCost(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}