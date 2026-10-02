"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiRotateCcw, FiSave } from "react-icons/fi";
import { products as mockProducts } from "../../lib/mock-data";

type PurchaseItem = {
  id: string;
  productName: string;
  model: string;
  price: number;
  commission: number;
  qty: number;
  purchasePrice: number;
  salePrice: number;
  total: number;
};

export default function AddPurchaseForm() {
  const router = useRouter();

  // Form States
  const [date, setDate] = useState("2026-10-02");
  const [showroom, setShowroom] = useState("Phone Store ( 53,New Market )");
  const [voucherNo, setVoucherNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  // Calculation States
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [transport, setTransport] = useState<number>(0);
  const [previousBalance, setPreviousBalance] = useState<number>(0);
  const [paid, setPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // 1. Add Product to Table List
  const handleAddProduct = () => {
    if (!selectedProductId) {
      alert("Please select a product first!");
      return;
    }

    const prod = mockProducts.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const existingIndex = items.findIndex((i) => i.id === prod.id);
    if (existingIndex > -1) {
      // If already added, increase Qty
      const updated = [...items];
      updated[existingIndex].qty += 1;
      updated[existingIndex].total =
        updated[existingIndex].qty * updated[existingIndex].purchasePrice;
      setItems(updated);
    } else {
      // Add new item row
      const newItem: PurchaseItem = {
        id: prod.id,
        productName: prod.name,
        model: prod.category || "Standard",
        price: prod.price || 0,
        commission: 0,
        qty: 1,
        purchasePrice: prod.purchasePrice || 0,
        salePrice: (prod.sellingPrice || 0) * 1.15,
        total: prod.purchasePrice || 0,
      };
      setItems([...items, newItem]);
    }
    setSelectedProductId("");
  };

  // Update item field directly from table row
  const handleItemChange = (
    id: string,
    field: keyof PurchaseItem,
    value: number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "qty" || field === "purchasePrice") {
            updatedItem.total = updatedItem.qty * updatedItem.purchasePrice;
          }
          return updatedItem;
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
  const subTotal = items.reduce((acc, curr) => acc + curr.total, 0);
  const grandTotal = subTotal - discount + transport;
  const currentBalance = grandTotal + previousBalance - paid;

  // 2. Reset Button Action
  const handleReset = () => {
    setDate("2026-10-02");
    setShowroom("Phone Store ( 53,New Market )");
    setVoucherNo("");
    setSupplier("");
    setSelectedProductId("");
    setItems([]);
    setDiscount(0);
    setTransport(0);
    setPreviousBalance(0);
    setPaid(0);
    setPaymentMethod("Cash");
  };

  // 3. Save Purchase Action
  const handleSavePurchase = () => {
    if (items.length === 0) {
      alert("Please add at least one product before saving!");
      return;
    }

    const generatedVoucher = voucherNo.trim()
      ? voucherNo
      : `VOUCH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPurchase = {
      id: `PUR-${Date.now()}`,
      date,
      showroom,
      voucherNo: generatedVoucher,
      supplier: supplier || "General Supplier",
      items,
      subTotal,
      totalDiscount: discount,
      transportCost: transport,
      grandTotal,
      paidAmount: paid,
      paymentMethod,
      currentBalance,
      createdAt: new Date().toISOString(),
    };

    // Get existing purchases from localStorage
    const existingData = localStorage.getItem("phone-store-purchases");
    let purchases = [];
    if (existingData) {
      try {
        purchases = JSON.parse(existingData);
      } catch {
        purchases = [];
      }
    }

    // Save updated list
    purchases.unshift(newPurchase);
    localStorage.setItem("phone-store-purchases", JSON.stringify(purchases));

    alert("Purchase Saved Successfully!");

    // Auto redirect to All Purchase List
    router.push("/purchase/all");
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Input Options Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
          {/* Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-primary focus:outline-hidden"
            />
          </div>

          {/* Showroom */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Showroom
            </label>
            <select
              value={showroom}
              onChange={(e) => setShowroom(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-primary focus:outline-hidden"
            >
              <option value="Phone Store ( 53,New Market )">
                Phone Store ( 53,New Market )
              </option>
              <option value="Main Branch">Main Branch</option>
            </select>
          </div>

          {/* Voucher No */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Voucher No
            </label>
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
            <label className="text-[11px] font-semibold text-slate-600">
              Supplier
            </label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-primary focus:outline-hidden"
            >
              <option value="">--Select Supplier--</option>
              <option value="Apple BD Official">Apple BD Official</option>
              <option value="Samsung Distribution">Samsung Distribution</option>
            </select>
          </div>

          {/* Select Product & (+) Button */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Select Product
            </label>
            <div className="flex gap-2">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-primary focus:outline-hidden"
              >
                <option value="">-- Select Product --</option>
                {mockProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
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
      </div>

      {/* Items Table & Totals Calculation Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase">
              <tr>
                <th className="py-3 px-3 w-10 text-center">SL</th>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Model/SKU</th>
                <th className="py-3 px-3 w-24">Price</th>
                <th className="py-3 px-3 w-20">Comm.(%)</th>
                <th className="py-3 px-3 w-20">QTY</th>
                <th className="py-3 px-3 w-28">Purchase Price</th>
                <th className="py-3 px-3 w-28">Sale Price</th>
                <th className="py-3 px-3 w-28 text-right">Total</th>
                <th className="py-3 px-3 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    No products added. Select product from dropdown above and
                    click (+).
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {item.productName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{item.model}</td>
                    <td className="py-2.5 px-3">৳{item.price}</td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        value={item.commission}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "commission",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 h-8 px-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "qty",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-16 h-8 px-2 border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        value={item.purchasePrice}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "purchasePrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-24 h-8 px-2 border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        value={item.salePrice}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "salePrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-24 h-8 px-2 border border-slate-200 rounded-lg text-xs"
                      />
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

        {/* Calculation Box Side */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600">Total</span>
              <div className="w-40 h-9 px-3 bg-slate-100/80 rounded-xl flex items-center justify-end font-bold text-slate-800">
                ৳{subTotal.toLocaleString()}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600">
                Total Discount
              </span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-40 h-9 px-3 border border-slate-200 rounded-xl text-right text-xs font-semibold"
              />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600">
                Transport Cost
              </span>
              <input
                type="number"
                value={transport}
                onChange={(e) => setTransport(parseFloat(e.target.value) || 0)}
                className="w-40 h-9 px-3 border border-slate-200 rounded-xl text-right text-xs font-semibold"
              />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Grand Total</span>
              <div className="w-40 h-9 px-3 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-xl flex items-center justify-end font-bold">
                ৳{grandTotal.toLocaleString()}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600">
                Previous Balance
              </span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={previousBalance}
                  onChange={(e) =>
                    setPreviousBalance(parseFloat(e.target.value) || 0)
                  }
                  className="w-24 h-9 px-3 border border-slate-200 rounded-xl text-right text-xs font-semibold"
                />
                <span className="h-9 px-2 bg-emerald-100 text-emerald-800 rounded-xl flex items-center text-[10px] font-bold">
                  Receivable
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600">Paid</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={paid}
                  onChange={(e) => setPaid(parseFloat(e.target.value) || 0)}
                  className="w-24 h-9 px-3 border border-slate-200 rounded-xl text-right text-xs font-semibold"
                />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-9 px-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                >
                  <option value="Cash">Cash</option>
                  <option value="bKash">bKash</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-800">Current Balance</span>
              <div className="flex gap-2">
                <div className="w-24 h-9 px-3 bg-slate-100 rounded-xl flex items-center justify-end font-bold text-slate-800">
                  ৳{currentBalance.toLocaleString()}
                </div>
                <span className="h-9 px-2 bg-emerald-100 text-emerald-800 rounded-xl flex items-center text-[10px] font-bold">
                  Receivable
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Reset & Save Purchase */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="h-10 px-6 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
          >
            <FiRotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            type="button"
            onClick={handleSavePurchase}
            className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <FiSave className="h-4 w-4" /> Save Purchase
          </button>
        </div>
      </div>
    </div>
  );
}