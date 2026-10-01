"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiEdit2,
  FiEye,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

import type {
  Supplier,
  SupplierPayment,
} from "../../types/supplier";

import { DEMO_SUPPLIERS } from "../../lib/supplier-demo-data";

const SUPPLIERS_KEY = "phone-store-suppliers";
const PAYMENTS_KEY = "phone-store-supplier-payments";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function SupplierTable() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [payments, setPayments] = useState<SupplierPayment[]>([]);

  const [search, setSearch] = useState("");
  const [showroomFilter, setShowroomFilter] = useState("");

  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener(
      "phone-store-suppliers-updated",
      handleUpdate,
    );

    window.addEventListener(
      "phone-store-supplier-payments-updated",
      handleUpdate,
    );

    return () => {
      window.removeEventListener(
        "phone-store-suppliers-updated",
        handleUpdate,
      );

      window.removeEventListener(
        "phone-store-supplier-payments-updated",
        handleUpdate,
      );
    };
  }, []);

  function loadData() {
    try {
      const storedSuppliers =
        localStorage.getItem(SUPPLIERS_KEY);

      if (storedSuppliers) {
        const parsed: Supplier[] =
          JSON.parse(storedSuppliers);

        if (parsed.length > 0) {
          setSuppliers(parsed);
        } else {
          localStorage.setItem(
            SUPPLIERS_KEY,
            JSON.stringify(DEMO_SUPPLIERS),
          );

          setSuppliers(DEMO_SUPPLIERS);
        }
      } else {
        localStorage.setItem(
          SUPPLIERS_KEY,
          JSON.stringify(DEMO_SUPPLIERS),
        );

        setSuppliers(DEMO_SUPPLIERS);
      }

      const storedPayments =
        localStorage.getItem(PAYMENTS_KEY);

      setPayments(
        storedPayments
          ? JSON.parse(storedPayments)
          : [],
      );
    } catch {
      setSuppliers(DEMO_SUPPLIERS);
      setPayments([]);
    }
  }

  const showrooms = useMemo(() => {
    return Array.from(
      new Set(
        suppliers
          .map((supplier) => supplier.showroom)
          .filter(Boolean),
      ),
    );
  }, [suppliers]);

  function getCurrentBalance(supplier: Supplier) {
    const supplierPayments = payments.filter(
      (payment) =>
        payment.supplierId === supplier.id,
    );

    let balance = supplier.initialBalance;

    supplierPayments.forEach((payment) => {
      if (supplier.balanceType === "Payable") {
        if (payment.paymentType === "Payment") {
          balance -= payment.amount;
        } else {
          balance += payment.amount;
        }
      } else {
        if (payment.paymentType === "Receive") {
          balance -= payment.amount;
        } else {
          balance += payment.amount;
        }
      }
    });

    return balance;
  }

  const filteredSuppliers = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesSearch =
        !searchValue ||
        supplier.name
          .toLowerCase()
          .includes(searchValue) ||
        supplier.mobile
          .toLowerCase()
          .includes(searchValue) ||
        supplier.contactPerson
          .toLowerCase()
          .includes(searchValue);

      const matchesShowroom =
        !showroomFilter ||
        supplier.showroom === showroomFilter;

      return matchesSearch && matchesShowroom;
    });
  }, [suppliers, search, showroomFilter]);

  const totalBalance = filteredSuppliers.reduce(
    (total, supplier) =>
      total +
      Math.abs(getCurrentBalance(supplier)),
    0,
  );

  function handleDelete(supplier: Supplier) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${supplier.name}"?`,
    );

    if (!confirmed) return;

    const updatedSuppliers = suppliers.filter(
      (item) => item.id !== supplier.id,
    );

    localStorage.setItem(
      SUPPLIERS_KEY,
      JSON.stringify(updatedSuppliers),
    );

    setSuppliers(updatedSuppliers);

    window.dispatchEvent(
      new Event("phone-store-suppliers-updated"),
    );
  }

  return (
    <>
      <div className="w-full max-w-full space-y-5 overflow-hidden">
        {/* ================= HEADER ================= */}
        <div className="flex w-full max-w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Supplier Management
            </p>

            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900">
              View All Supplier
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage all suppliers and their current balances.
            </p>
          </div>

          <Link
            href="/suppliers/add"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            <FiPlus className="h-4 w-4" />
            Add Supplier
          </Link>
        </div>

        {/* ================= LEGEND ================= */}
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Green = Receivable
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-red-500">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Red = Payable
          </div>
        </div>

        {/* ================= FILTER ================= */}
        <div className="w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            {/* Search */}
            <div className="min-w-0">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Supplier Name
              </label>

              <div className="relative min-w-0">
                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search supplier..."
                  className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Showroom */}
            <div className="min-w-0">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Showroom
              </label>

              <select
                value={showroomFilter}
                onChange={(event) =>
                  setShowroomFilter(event.target.value)
                }
                className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
              >
                <option value="">
                  -- Select Showroom --
                </option>

                {showrooms.map((showroom) => (
                  <option
                    key={showroom}
                    value={showroom}
                  >
                    {showroom}
                  </option>
                ))}
              </select>
            </div>

            {/* Total */}
            <div className="flex min-w-0 items-end">
              <div className="w-full rounded-xl bg-slate-50 px-5 py-3 lg:w-auto">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Total Suppliers
                </p>

                <p className="mt-0.5 text-lg font-bold text-slate-900">
                  {filteredSuppliers.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TABLE CARD ================= */}
        <div className="w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex min-w-0 items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-slate-900">
                  Supplier List
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Showing {filteredSuppliers.length} of{" "}
                  {suppliers.length} suppliers
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Total Balance
                </p>

                <p className="text-sm font-bold text-slate-900">
                  ৳ {formatMoney(totalBalance)}
                </p>
              </div>
            </div>
          </div>

          {/* 
            IMPORTANT:
            No overflow-x-auto
            No min-width
            No min-w-[...]
            
            table-fixed + w-full means table cannot
            create horizontal scrollbar.
          */}
          <div className="w-full max-w-full overflow-hidden">
            <table className="w-full max-w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="w-[5%] px-1.5 py-4 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    SL
                  </th>

                  <th className="w-[16%] px-1.5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Showroom
                  </th>

                  <th className="w-[17%] px-1.5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Supplier
                  </th>

                  <th className="w-[13%] px-1.5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Contact
                    <br />
                    Person
                  </th>

                  <th className="w-[12%] px-1.5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Mobile
                  </th>

                  <th className="w-[13%] px-1.5 py-4 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Current
                    <br />
                    Balance
                  </th>

                  <th className="w-[9%] px-1.5 py-4 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="w-[15%] px-1.5 py-4 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-14 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                        <FiSearch className="h-5 w-5 text-slate-400" />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-800">
                        No supplier found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your search or showroom filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map(
                    (supplier, index) => {
                      const balance =
                        getCurrentBalance(
                          supplier,
                        );

                      const isPayable =
                        supplier.balanceType ===
                        "Payable";

                      return (
                        <tr
                          key={supplier.id}
                          className="transition hover:bg-slate-50/70"
                        >
                          {/* SL */}
                          <td className="w-[5%] max-w-0 overflow-hidden px-1.5 py-4 text-center text-xs font-medium text-slate-500">
                            {index + 1}
                          </td>

                          {/* Showroom */}
                          <td className="w-[16%] max-w-0 overflow-hidden px-1.5 py-4">
                            <p
                              title={supplier.showroom}
                              className="block max-w-full truncate text-xs font-medium text-slate-700"
                            >
                              {supplier.showroom}
                            </p>
                          </td>

                          {/* Supplier */}
                          <td className="w-[17%] max-w-0 overflow-hidden px-1.5 py-4">
                            <p
                              title={supplier.name}
                              className="block max-w-full truncate text-xs font-bold text-slate-900"
                            >
                              {supplier.name}
                            </p>

                            {supplier.address && (
                              <p
                                title={supplier.address}
                                className="mt-1 block max-w-full truncate text-[10px] text-slate-400"
                              >
                                {supplier.address}
                              </p>
                            )}
                          </td>

                          {/* Contact Person */}
                          <td className="w-[13%] max-w-0 overflow-hidden px-1.5 py-4">
                            <p
                              title={
                                supplier.contactPerson
                              }
                              className="block max-w-full break-words text-xs text-slate-600"
                            >
                              {supplier.contactPerson ||
                                "—"}
                            </p>
                          </td>

                          {/* Mobile */}
                          <td className="w-[12%] max-w-0 overflow-hidden px-1.5 py-4">
                            <p
                              title={supplier.mobile}
                              className="block max-w-full truncate text-xs font-medium text-slate-700"
                            >
                              {supplier.mobile}
                            </p>
                          </td>

                          {/* Balance */}
                          <td className="w-[13%] max-w-0 overflow-hidden px-1.5 py-4">
                            <p
                              className={`truncate text-xs font-bold ${isPayable
                                  ? "text-red-600"
                                  : "text-emerald-600"
                                }`}
                            >
                              ৳{" "}
                              {formatMoney(
                                Math.abs(balance),
                              )}
                            </p>

                            <p
                              className={`mt-1 truncate text-[9px] font-bold uppercase tracking-wide ${isPayable
                                  ? "text-red-500"
                                  : "text-emerald-500"
                                }`}
                            >
                              {isPayable
                                ? "Payable"
                                : "Receivable"}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="w-[9%] max-w-0 overflow-hidden px-1.5 py-4 text-center">
                            <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600">
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                              <span className="truncate">
                                Active
                              </span>
                            </span>
                          </td>

                          {/* Action */}
                          <td className="w-[15%] max-w-0 overflow-hidden px-1.5 py-4">
                            <div className="flex items-center justify-center gap-1">
                              {/* View */}
                              <button
                                type="button"
                                title="View"
                                onClick={() =>
                                  setSelectedSupplier(
                                    supplier,
                                  )
                                }
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                              >
                                <FiEye className="h-3.5 w-3.5" />
                              </button>

                              {/* Edit */}
                              <Link
                                href={`/suppliers/edit/${supplier.id}`}
                                title="Edit"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 transition hover:bg-amber-100"
                              >
                                <FiEdit2 className="h-3.5 w-3.5" />
                              </Link>

                              {/* Delete */}
                              <button
                                type="button"
                                title="Delete"
                                onClick={() =>
                                  handleDelete(
                                    supplier,
                                  )
                                }
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100"
                              >
                                <FiTrash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )
                )}
              </tbody>

              {/* Total */}
              {filteredSuppliers.length > 0 && (
                <tfoot>
                  <tr className="border-t border-slate-200 bg-slate-50">
                    <td
                      colSpan={5}
                      className="px-2 py-4 text-right text-xs font-bold text-slate-700"
                    >
                      Total
                    </td>

                    <td className="px-1.5 py-4 text-xs font-bold text-slate-900">
                      ৳ {formatMoney(totalBalance)}
                    </td>

                    <td />

                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Bottom Info */}
          <div className="border-t border-slate-200 bg-white px-5 py-3">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <p className="truncate text-[11px] text-slate-500">
                Showing {filteredSuppliers.length} of{" "}
                {suppliers.length} suppliers
              </p>

              <p className="shrink-0 text-[11px] font-semibold text-slate-600">
                Total balance:{" "}
                <span className="text-slate-900">
                  ৳ {formatMoney(totalBalance)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Supplier Details
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {selectedSupplier.name}
              </h2>
            </div>

            <div className="grid gap-3 p-6 sm:grid-cols-2">
              <Info
                label="Showroom"
                value={selectedSupplier.showroom}
              />

              <Info
                label="Mobile"
                value={selectedSupplier.mobile}
              />

              <Info
                label="Contact Person"
                value={
                  selectedSupplier.contactPerson ||
                  "—"
                }
              />

              <Info
                label="Balance Type"
                value={selectedSupplier.balanceType}
              />

              <Info
                label="Initial Balance"
                value={`৳ ${formatMoney(
                  selectedSupplier.initialBalance,
                )}`}
              />

              <Info
                label="Current Balance"
                value={`৳ ${formatMoney(
                  Math.abs(
                    getCurrentBalance(
                      selectedSupplier,
                    ),
                  ),
                )}`}
              />

              <div className="sm:col-span-2">
                <Info
                  label="Address"
                  value={
                    selectedSupplier.address ||
                    "—"
                  }
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setSelectedSupplier(null)
                }
                className="h-10 rounded-xl bg-white px-5 text-sm font-semibold text-gray-800 ring-1 ring-slate-200 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}