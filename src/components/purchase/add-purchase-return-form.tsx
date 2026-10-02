"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import { products as mockProducts } from "../../lib/mock-data";

type ReturnItem = {
  id: string;
  productName: string;
  model: string;
  stock: number;
  qty: number;
  purchasePrice: number;
  total: number;
};

export default function AddPurchaseReturnForm() {
  const router = useRouter();

  // Form Top Fields
  const [date, setDate] = useState("2026-10-02");
  const [showroom, setShowroom] = useState("");
  const [supplier, setSupplier] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [inputQty, setInputQty] = useState<number | "">("");

  // Table Items & Calculations
  const [items, setItems] = useState<ReturnItem[]>([]);
  const [previousBalance, setPreviousBalance] = useState<number>(0);

  // Add Item to Table
  const handleAddProduct = () => {
    if (!selectedProductId) {
      alert("Please select a product!");
      return;
    }

    const prod = mockProducts.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const returnQty = typeof inputQty === "number" && inputQty > 0 ? inputQty : 1;
    const price = prod.price || 0;

    const existingIndex = items.findIndex((i) => i.id === prod.id);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].qty += returnQty;
      updated[existingIndex].total = updated[existingIndex].qty * updated[existingIndex].purchasePrice;
      setItems(updated);
    } else {
      const newItem: ReturnItem = {
        id: prod.id,
        productName: prod.name,
        model: prod.category || "Standard",
        stock: 25, // Mock stock count
        qty: returnQty,
        purchasePrice: price,
        total: returnQty * price,
      };
      setItems([...items, newItem]);
    }

    // Reset top selection
    setSelectedProductId("");
    setInputQty("");
  };

  // Change Quantity directly in Table
  const handleQtyChange = (id: string, newQty: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = newQty > 0 ? newQty : 1;
          return {
            ...item,
            qty,
            total: qty * item.purchasePrice,
          };
        }
        return item;
      })
    );
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Calculations
  const totalAmount = items.reduce((acc, curr) => acc + curr.total, 0);
  const grandTotal = totalAmount;
  const currentBalance = grandTotal + previousBalance;

  // Save Return Action
  const handleSaveReturn = () => {
    if (items.length === 0) {
      alert("Please add at least one product to return!");
      return;
    }

    const newReturnRecord = {
      id: `RET-${Date.now()}`,
      date,
      showroom: showroom || "Phone Store ( 53,New Market )",
      supplier: supplier || "General Supplier",
      items,
      totalAmount,
      grandTotal,
      previousBalance,
      currentBalance,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existing = localStorage.getItem("phone-store-purchase-returns");
    let returnsList = [];
    if (existing) {
      try {
        returnsList = JSON.parse(existing);
      } catch {
        returnsList = [];
      }
    }

    returnsList.unshift(newReturnRecord);
    localStorage.setItem("phone-store-purchase-returns", JSON.stringify(returnsList));

    alert("Purchase Return Saved Successfully!");

    // Redirect to All Purchase Return list page
    router.push("/purchase/return/all");
  };

  return (
    <div className="space-y-4">
      {/* Page Title Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-lg font-bold text-slate-800">Purchase Return</h1>
      </div>

      {/* Top Filter & Input Bar matching screenshot */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-center">
          {/* Date Picker */}
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-hidden"
            />
          </div>

          {/* Showroom */}
          <div>
            <select
              value={showroom}
              onChange={(e) => setShowroom(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="">-- Select Showroom --</option>
              <option value="Phone Store ( 53,New Market )">
                Phone Store ( 53,New Market )
              </option>
              <option value="Main Branch">Main Branch</option>
            </select>
          </div>

          {/* Supplier */}
          <div>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="">-- Supplier Name --</option>
              <option value="Apple BD Official">Apple BD Official</option>
              <option value="Samsung Distribution">Samsung Distribution</option>
            </select>
          </div>

          {/* Select Product */}
          <div>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-hidden"
            >
              <option value="">Select Product</option>
              {mockProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & (+) Button */}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Quantity"
              min={1}
              value={inputQty}
              onChange={(e) =>
                setInputQty(e.target.value ? parseInt(e.target.value) : "")
              }
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleAddProduct}
              className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center font-bold text-lg transition shadow-xs cursor-pointer shrink-0"
            >
              <FiPlus />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table & Calculation Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase">
              <tr>
                <th className="py-3 px-3 w-12 text-center">SL</th>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Model</th>
                <th className="py-3 px-3 w-20 text-center">Stock</th>
                <th className="py-3 px-3 w-24 text-center">Quantity</th>
                <th className="py-3 px-3 w-28 text-right">Purchase Price</th>
                <th className="py-3 px-3 w-28 text-right">Total</th>
                <th className="py-3 px-3 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    No items selected for return. Select product above and click (+).
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {item.productName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{item.model}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-600">
                      {item.stock}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) =>
                          handleQtyChange(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 h-8 px-2 border border-slate-200 rounded-lg text-center font-bold text-xs"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">
                      ৳{item.purchasePrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      ৳{item.total.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Summary matching screenshot UI */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <div className="w-full max-w-md space-y-3">
            {/* Total */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Total</span>
              <div className="w-48 h-9 px-3 bg-slate-100/80 rounded-xl flex items-center justify-end font-bold text-slate-800">
                {totalAmount.toFixed(2)}
              </div>
            </div>

            {/* Previous Balance */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Previous Balance</span>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={previousBalance}
                  onChange={(e) =>
                    setPreviousBalance(parseFloat(e.target.value) || 0)
                  }
                  className="w-32 h-9 px-3 border border-slate-200 rounded-xl text-right text-xs font-semibold"
                />
                <span className="h-9 px-3 bg-slate-100 text-slate-600 rounded-xl flex items-center text-xs font-semibold">
                  Receivable
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Grand Total</span>
              <div className="w-48 h-9 px-3 bg-slate-100/80 rounded-xl flex items-center justify-end font-bold text-slate-800">
                {grandTotal.toFixed(2)}
              </div>
            </div>

            {/* Current Balance */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Current Balance</span>
              <div className="flex gap-2 items-center">
                <div className="w-32 h-9 px-3 bg-slate-100/80 rounded-xl flex items-center justify-end font-bold text-slate-800">
                  {currentBalance}
                </div>
                <span className="h-9 px-3 bg-slate-100 text-slate-600 rounded-xl flex items-center text-xs font-semibold">
                  Receivable
                </span>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={handleSaveReturn}
                className="h-10 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <FiSave className="h-4 w-4" /> Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}