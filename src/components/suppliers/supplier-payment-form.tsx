"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiCreditCard,
  FiFileText,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";

import type {
  Supplier,
  SupplierPaymentMethod,
  SupplierPaymentType,
} from "../../types/supplier";

import { DEMO_SUPPLIERS } from "../../lib/supplier-demo-data";

const SUPPLIERS_KEY = "phone-store-suppliers";
const PAYMENTS_KEY = "phone-store-supplier-payments";

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function SupplierPaymentForm() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [supplierId, setSupplierId] = useState("");
  const [paymentType, setPaymentType] =
    useState<SupplierPaymentType>("Payment");

  const [amount, setAmount] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<SupplierPaymentMethod>("Cash");

  const [date, setDate] = useState(getTodayDate());

  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  /*
   * Load suppliers.
   *
   * If there are no suppliers yet, demo suppliers will automatically
   * be inserted into localStorage so that payment can be tested.
   */
  useEffect(() => {
    try {
      const storedSuppliers =
        localStorage.getItem(SUPPLIERS_KEY);

      if (storedSuppliers) {
        const parsedSuppliers: Supplier[] =
          JSON.parse(storedSuppliers);

        if (parsedSuppliers.length > 0) {
          setSuppliers(parsedSuppliers);
          return;
        }
      }

      localStorage.setItem(
        SUPPLIERS_KEY,
        JSON.stringify(DEMO_SUPPLIERS),
      );

      setSuppliers(DEMO_SUPPLIERS);

      window.dispatchEvent(
        new Event("phone-store-suppliers-updated"),
      );
    } catch {
      localStorage.setItem(
        SUPPLIERS_KEY,
        JSON.stringify(DEMO_SUPPLIERS),
      );

      setSuppliers(DEMO_SUPPLIERS);
    }
  }, []);

  function clearMessages() {
    setMessage("");
    setError("");
  }

  function handleDateClick(
    event: React.MouseEvent<HTMLInputElement>,
  ) {
    const input = event.currentTarget;

    if ("showPicker" in input) {
      try {
        input.showPicker();
      } catch {
        // Browser may already have opened the picker.
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    clearMessages();

    if (!supplierId) {
      setError("Please select a supplier.");
      return;
    }

    const numericAmount = Number(amount);

    if (
      !amount ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    const selectedSupplier = suppliers.find(
      (supplier) => supplier.id === supplierId,
    );

    if (!selectedSupplier) {
      setError("Selected supplier could not be found.");
      return;
    }

    try {
      setIsSaving(true);

      const storedPayments =
        localStorage.getItem(PAYMENTS_KEY);

      const existingPayments = storedPayments
        ? JSON.parse(storedPayments)
        : [];

      const newPayment = {
        id: crypto.randomUUID(),
        supplierId: selectedSupplier.id,
        supplierName: selectedSupplier.name,
        showroom: selectedSupplier.showroom,
        amount: numericAmount,
        paymentType,
        paymentMethod,
        reference: reference.trim(),
        note: note.trim(),
        date,
        createdAt: new Date().toISOString(),
      };

      const updatedPayments = [
        newPayment,
        ...existingPayments,
      ];

      localStorage.setItem(
        PAYMENTS_KEY,
        JSON.stringify(updatedPayments),
      );

      /*
       * Tell All Payments page that a new transaction
       * has been saved.
       */
      window.dispatchEvent(
        new Event("phone-store-supplier-payments-updated"),
      );

      setMessage(
        "Supplier payment saved successfully.",
      );

      // Reset form after successful save.
      setSupplierId("");
      setPaymentType("Payment");
      setAmount("");
      setPaymentMethod("Cash");
      setDate(getTodayDate());
      setReference("");
      setNote("");
    } catch {
      setError(
        "Unable to save payment. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    clearMessages();

    setSupplierId("");
    setPaymentType("Payment");
    setAmount("");
    setPaymentMethod("Cash");
    setDate(getTodayDate());
    setReference("");
    setNote("");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Supplier Management
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Add Supplier Transaction
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Record a payment or receive transaction from a supplier.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FiCreditCard className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {/* Messages */}
          {message && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Success
                </p>

                <p className="mt-0.5 text-xs text-emerald-700">
                  {message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMessage("")}
                className="ml-auto text-emerald-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Please check the form
                </p>

                <p className="mt-0.5 text-xs text-red-700">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="ml-auto text-red-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="space-y-6">
            {/* Supplier */}
            <div className="grid gap-3 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-center">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FiUser className="h-4 w-4 text-primary" />

                Supplier

                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  value={supplierId}
                  onChange={(event) => {
                    setSupplierId(event.target.value);
                    clearMessages();
                  }}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">
                    -- Select Supplier --
                  </option>

                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.id}
                      value={supplier.id}
                    >
                      {supplier.name} — {supplier.mobile}
                    </option>
                  ))}
                </select>

                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Transaction Type */}
            <div className="grid gap-3 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-center">
              <label className="text-sm font-semibold text-slate-800">
                Transaction Type
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentType("Payment");
                    clearMessages();
                  }}
                  className={`h-11 rounded-xl border text-sm font-semibold transition ${
                    paymentType === "Payment"
                      ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                      : "border-slate-200 bg-white text-gray-800 hover:bg-slate-50"
                  }`}
                >
                  Payment
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentType("Receive");
                    clearMessages();
                  }}
                  className={`h-11 rounded-xl border text-sm font-semibold transition ${
                    paymentType === "Receive"
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "border-slate-200 bg-white text-gray-800 hover:bg-slate-50"
                  }`}
                >
                  Receive
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="grid gap-3 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-center">
              <label className="text-sm font-semibold text-slate-800">
                Amount (TK)
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary">
                  ৳
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    clearMessages();
                  }}
                  placeholder="0.00"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="grid gap-3 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-center">
              <label className="text-sm font-semibold text-slate-800">
                Payment Method
              </label>

              <div className="relative">
                <select
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value as SupplierPaymentMethod,
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                  <option value="Mobile Banking">
                    Mobile Banking
                  </option>
                  <option value="Cheque">Cheque</option>
                </select>

                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Date */}
            <div className="grid gap-3 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-center">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FiCalendar className="h-4 w-4 text-primary" />

                Date

                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  onClick={handleDateClick}
                  className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Reference */}
            <div className="grid gap-3 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-center">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FiFileText className="h-4 w-4 text-primary" />

                Reference
              </label>

              <input
                type="text"
                value={reference}
                onChange={(event) =>
                  setReference(event.target.value)
                }
                placeholder="Invoice / transaction reference"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Note */}
            <div className="grid gap-3 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-start">
              <label className="flex items-center gap-2 pt-3 text-sm font-semibold text-slate-800">
                <FiFileText className="h-4 w-4 text-primary" />

                Note
              </label>

              <textarea
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                rows={4}
                placeholder="Add a note about this transaction"
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-gray-800 transition hover:bg-slate-100"
          >
            <FiX className="h-4 w-4" />
            Reset
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            <FiSave className="h-4 w-4" />

            {isSaving ? "Saving..." : "Save Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}