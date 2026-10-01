"use client";

import { FormEvent, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiSave,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import Link from "next/link";

import type { Supplier, SupplierBalanceType } from "../../types/supplier";

const STORAGE_KEY = "phone-store-suppliers";

const SHOWROOMS = ["Phone Store ( 53, New Market )"];

const DEFAULT_FORM = {
  showroom: SHOWROOMS[0],
  name: "",
  contactPerson: "",
  mobile: "",
  address: "",
  initialBalance: "0",
  balanceType: "Payable" as SupplierBalanceType,
};

export default function SupplierForm() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const updateField = (
    field: keyof typeof DEFAULT_FORM,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!form.name.trim()) {
      setError("Supplier name is required.");
      return;
    }

    if (!form.mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }

    const balance = Number(form.initialBalance);

    if (Number.isNaN(balance) || balance < 0) {
      setError("Please enter a valid initial balance.");
      return;
    }

    setSaving(true);

    try {
      const suppliers: Supplier[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      const supplier: Supplier = {
        id: crypto.randomUUID(),
        showroom: form.showroom,
        name: form.name.trim(),
        contactPerson: form.contactPerson.trim(),
        mobile: form.mobile.trim(),
        address: form.address.trim(),
        initialBalance: balance,
        balanceType: form.balanceType,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...suppliers, supplier])
      );

      window.dispatchEvent(new Event("phone-store-suppliers-updated"));

      setForm(DEFAULT_FORM);
      setSuccess("Supplier added successfully.");
    } catch {
      setError("Unable to save supplier. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50/70 to-white px-6 py-5 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <FiUsers className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Add New Supplier
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Create supplier profile and opening balance.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="px-6 py-7 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl space-y-6">

            {/* Showroom */}
            <div className="grid gap-2 md:grid-cols-[190px_1fr] md:items-center md:gap-8">
              <label
                htmlFor="showroom"
                className="text-sm font-semibold text-slate-700"
              >
                Showroom <span className="text-red-500">*</span>
              </label>

              <select
                id="showroom"
                value={form.showroom}
                onChange={(e) =>
                  updateField("showroom", e.target.value)
                }
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                {SHOWROOMS.map((showroom) => (
                  <option key={showroom}>{showroom}</option>
                ))}
              </select>
            </div>

            {/* Supplier Name */}
            <div className="grid gap-2 md:grid-cols-[190px_1fr] md:items-center md:gap-8">
              <label
                htmlFor="supplier-name"
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <FiUser className="h-4 w-4 text-blue-500" />
                Supplier Name
                <span className="text-red-500">*</span>
              </label>

              <input
                id="supplier-name"
                value={form.name}
                onChange={(e) =>
                  updateField("name", e.target.value)
                }
                placeholder="Enter supplier name"
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-gray-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Contact Person */}
            <div className="grid gap-2 md:grid-cols-[190px_1fr] md:items-center md:gap-8">
              <label
                htmlFor="contact-person"
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <FiUser className="h-4 w-4 text-blue-500" />
                Contact Person
              </label>

              <input
                id="contact-person"
                value={form.contactPerson}
                onChange={(e) =>
                  updateField("contactPerson", e.target.value)
                }
                placeholder="Enter contact person name"
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-gray-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Mobile */}
            <div className="grid gap-2 md:grid-cols-[190px_1fr] md:items-center md:gap-8">
              <label
                htmlFor="mobile"
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <FiPhone className="h-4 w-4 text-blue-500" />
                Mobile
                <span className="text-red-500">*</span>
              </label>

              <input
                id="mobile"
                type="tel"
                value={form.mobile}
                onChange={(e) =>
                  updateField("mobile", e.target.value)
                }
                placeholder="e.g. 017XXXXXXXX"
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-gray-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Address */}
            <div className="grid gap-2 md:grid-cols-[190px_1fr] md:items-start md:gap-8">
              <label
                htmlFor="address"
                className="flex items-center gap-2 pt-2 text-sm font-semibold text-slate-700"
              >
                <FiMapPin className="h-4 w-4 text-blue-500" />
                Address
              </label>

              <textarea
                id="address"
                rows={4}
                value={form.address}
                onChange={(e) =>
                  updateField("address", e.target.value)
                }
                placeholder="Enter supplier address"
                className="resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Balance */}
            <div className="grid gap-2 md:grid-cols-[190px_1fr] md:items-center md:gap-8">
              <label
                htmlFor="initial-balance"
                className="text-sm font-semibold text-slate-700"
              >
                Initial Balance (TK)
                <span className="text-red-500"> *</span>
              </label>

              <div className="grid gap-3 sm:grid-cols-[1fr_190px]">
                <input
                  id="initial-balance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.initialBalance}
                  onChange={(e) =>
                    updateField(
                      "initialBalance",
                      e.target.value
                    )
                  }
                  placeholder="0.00"
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <select
                  value={form.balanceType}
                  onChange={(e) =>
                    updateField(
                      "balanceType",
                      e.target.value
                    )
                  }
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="Payable">Payable</option>
                  <option value="Receivable">Receivable</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {(success || error) && (
          <div className="border-t border-slate-100 px-6 py-4 sm:px-8 lg:px-12">
            {success && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <FiCheckCircle />
                {success}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <Link
            href="/suppliers/all"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-gray-800 transition hover:bg-slate-100"
          >
            <FiArrowLeft />
            All Suppliers
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setForm(DEFAULT_FORM);
                setError("");
                setSuccess("");
              }}
              className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-gray-800 transition hover:bg-slate-100"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave className="h-4 w-4" />
              {saving ? "Saving..." : "Save Supplier"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}