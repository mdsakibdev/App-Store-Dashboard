"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiCalendar,
  FiHome,
  FiUser,
  FiDollarSign,
  FiFileText,
  FiCreditCard,
  FiSave,
  FiRotateCcw,
  FiSend,
} from "react-icons/fi";
import type { Customer } from "../../types/customer";
import { getCustomersFromStorage } from "../../lib/customer-demo-data";

export default function CustomerCollectionForm() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedShowroom, setSelectedShowroom] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [voucherNo, setVoucherNo] = useState("");
  const [installmentAmount, setInstallmentAmount] = useState<number | "">("");
  const [collectionMethod, setCollectionMethod] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [remissionAmount, setRemissionAmount] = useState<number | "">("");
  const [paidBy, setPaidBy] = useState("");
  const [sendSms, setSendSms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setCustomers(getCustomersFromStorage());
  }, []);

  // Selected customer details
  const currentCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Calculated fields
  const currentBalance = currentCustomer ? currentCustomer.initialBalance : 0;
  const balanceType = currentCustomer ? currentCustomer.balanceType : "Receivable";
  const dueTk = currentBalance; // Can be linked with selected voucher/due

  const numPayment = Number(paymentAmount) || 0;
  const numRemission = Number(remissionAmount) || 0;
  const totalDueTk = Math.max(0, dueTk - numPayment - numRemission);

  const handleReset = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setSelectedShowroom("");
    setSelectedCustomerId("");
    setVoucherNo("");
    setInstallmentAmount("");
    setCollectionMethod("Cash");
    setPaymentAmount("");
    setRemissionAmount("");
    setPaidBy("");
    setSendSms(false);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!selectedCustomerId) {
      setErrorMsg("Please select a customer (Party)");
      return;
    }
    if (!paymentAmount || numPayment <= 0) {
      setErrorMsg("Please enter a valid Payment amount");
      return;
    }

    setLoading(true);

    try {
      // Record payment/collection transaction logic
      const collectionRecord = {
        id: `COLL-${Date.now().toString().slice(-4)}`,
        date,
        showroom: selectedShowroom || currentCustomer?.showroom,
        customerId: selectedCustomerId,
        customerName: currentCustomer?.name,
        voucherNo: voucherNo || "N/A",
        dueAmount: dueTk,
        installmentAmount: Number(installmentAmount) || 0,
        collectionMethod,
        paymentAmount: numPayment,
        remissionAmount: numRemission,
        totalDue: totalDueTk,
        paidBy: paidBy || currentCustomer?.name,
        sendSms,
        createdAt: new Date().toISOString(),
      };

      // Update customer balance in localStorage
      const updatedCustomers = customers.map((cust) => {
        if (cust.id === selectedCustomerId) {
          return {
            ...cust,
            initialBalance: totalDueTk,
          };
        }
        return cust;
      });

      localStorage.setItem("phone-store-customers", JSON.stringify(updatedCustomers));
      
      // Save collection history
      const existingCollections = JSON.parse(
        localStorage.getItem("phone-store-collections") || "[]"
      );
      localStorage.setItem(
        "phone-store-collections",
        JSON.stringify([collectionRecord, ...existingCollections])
      );

      // Trigger update event
      window.dispatchEvent(new Event("phone-store-customers-updated"));

      setSuccessMsg("Customer collection payment recorded successfully!");

      setTimeout(() => {
        router.push("/customers/all-payments");
      }, 1200);
    } catch {
      setErrorMsg("Failed to save collection transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <h3 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">
          Customer Collection Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiCalendar className="text-slate-400" /> Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {/* Select Showroom */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiHome className="text-slate-400" /> Select Showroom <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedShowroom}
              onChange={(e) => setSelectedShowroom(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            >
              <option value="">-- Select Showroom --</option>
              <option value="Phone Store ( 53,New Market )">Phone Store ( 53,New Market )</option>
              <option value="Main Branch">Main Branch</option>
              <option value="Uttara Branch">Uttara Branch</option>
            </select>
          </div>

          {/* Name (Select Party) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiUser className="text-slate-400" /> Name (Select Party) <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              required
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            >
              <option value="">Select Party</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id}) - {c.mobile}
                </option>
              ))}
            </select>
          </div>

          {/* Balance (TK) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiDollarSign className="text-slate-400" /> Balance (TK)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentBalance}
                className="w-full h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold cursor-not-allowed"
              />
              <span
                className={`h-11 px-4 flex items-center justify-center rounded-xl text-xs font-bold shrink-0 ${
                  balanceType === "Receivable"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-rose-100 text-rose-700 border border-rose-200"
                }`}
              >
                {balanceType}
              </span>
            </div>
          </div>

          {/* Voucher No */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiFileText className="text-slate-400" /> Voucher No
            </label>
            <select
              value={voucherNo}
              onChange={(e) => setVoucherNo(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            >
              <option value="">-- Select voucher --</option>
              <option value="INV-2026-001">INV-2026-001 (Due: ৳15,000)</option>
              <option value="INV-2026-002">INV-2026-002 (Due: ৳8,500)</option>
            </select>
          </div>

          {/* Due (TK) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Due (TK)</label>
            <input
              type="text"
              readOnly
              value={dueTk}
              className="w-full h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold cursor-not-allowed"
            />
          </div>

          {/* Installment Amount(TK) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Installment Amount (TK)</label>
            <input
              type="number"
              min="0"
              placeholder="0.00"
              value={installmentAmount}
              onChange={(e) =>
                setInstallmentAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {/* Collection Method */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiCreditCard className="text-slate-400" /> Collection Method <span className="text-rose-500">*</span>
            </label>
            <select
              value={collectionMethod}
              onChange={(e) => setCollectionMethod(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            >
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="bKash">bKash</option>
              <option value="Nagad">Nagad</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Payment (TK) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Payment (TK) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="0.00"
              value={paymentAmount}
              onChange={(e) =>
                setPaymentAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              required
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {/* Remission (TK) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Remission (TK)</label>
            <input
              type="number"
              min="0"
              placeholder="0.00"
              value={remissionAmount}
              onChange={(e) =>
                setRemissionAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {/* Total Due (TK) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Total Due (TK)</label>
            <input
              type="text"
              readOnly
              value={totalDueTk}
              className="w-full h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 text-sm font-bold cursor-not-allowed"
            />
          </div>

          {/* Paid By */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Paid By</label>
            <input
              type="text"
              placeholder="Payer Name / Depositor"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {/* Send SMS Checkbox */}
          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendSms}
                onChange={(e) => setSendSms(e.target.checked)}
                className="checkbox checkbox-xs checkbox-primary rounded-md"
              />
              <FiSend className="text-slate-400" /> Send Confirmation SMS to Customer
            </label>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="h-11 px-5 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 text-sm font-medium transition flex items-center gap-2 cursor-pointer"
        >
          <FiRotateCcw className="h-4 w-4" /> Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary/90 text-sm font-medium shadow-md shadow-primary/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <FiSave className="h-4 w-4" /> {loading ? "Saving..." : "Save Collection"}
        </button>
      </div>
    </form>
  );
}