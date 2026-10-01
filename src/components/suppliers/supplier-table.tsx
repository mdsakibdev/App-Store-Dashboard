"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiChevronDown,
  FiEdit2,
  FiEye,
  FiFilter,
  FiPlus,
  FiPrinter,
  FiRefreshCcw,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import type { Supplier } from "../../types/supplier";

const SUPPLIERS_KEY = "phone-store-suppliers";

const SHOWROOMS = ["Phone Store ( 53, New Market )"];

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function SupplierTable() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [supplierFilter, setSupplierFilter] = useState("");
  const [showroomFilter, setShowroomFilter] = useState("");

  const [search, setSearch] = useState("");

  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  const [editSupplier, setEditSupplier] =
    useState<Supplier | null>(null);

  const [editForm, setEditForm] = useState<Supplier | null>(null);

  const loadSuppliers = () => {
    try {
      const stored = localStorage.getItem(SUPPLIERS_KEY);

      if (stored) {
        setSuppliers(JSON.parse(stored));
      } else {
        setSuppliers([]);
      }
    } catch {
      setSuppliers([]);
    }
  };

  useEffect(() => {
    loadSuppliers();

    const handleUpdate = () => loadSuppliers();

    window.addEventListener(
      "phone-store-suppliers-updated",
      handleUpdate,
    );

    return () => {
      window.removeEventListener(
        "phone-store-suppliers-updated",
        handleUpdate,
      );
    };
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesSupplier =
        !supplierFilter || supplier.id === supplierFilter;

      const matchesShowroom =
        !showroomFilter || supplier.showroom === showroomFilter;

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        supplier.name.toLowerCase().includes(searchValue) ||
        supplier.mobile.toLowerCase().includes(searchValue) ||
        supplier.contactPerson
          .toLowerCase()
          .includes(searchValue);

      return (
        matchesSupplier &&
        matchesShowroom &&
        matchesSearch
      );
    });
  }, [suppliers, supplierFilter, showroomFilter, search]);

  const totalBalance = filteredSuppliers.reduce(
    (total, supplier) => total + supplier.initialBalance,
    0,
  );

  const totalPayable = filteredSuppliers
    .filter((supplier) => supplier.balanceType === "Payable")
    .reduce((total, supplier) => total + supplier.initialBalance, 0);

  const totalReceivable = filteredSuppliers
    .filter((supplier) => supplier.balanceType === "Receivable")
    .reduce(
      (total, supplier) => total + supplier.initialBalance,
      0,
    );

  function handleDelete(supplier: Supplier) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${supplier.name}"?`,
    );

    if (!confirmed) return;

    const updated = suppliers.filter(
      (item) => item.id !== supplier.id,
    );

    localStorage.setItem(
      SUPPLIERS_KEY,
      JSON.stringify(updated),
    );

    setSuppliers(updated);

    window.dispatchEvent(
      new Event("phone-store-suppliers-updated"),
    );
  }

  function openEdit(supplier: Supplier) {
    setEditSupplier(supplier);
    setEditForm({ ...supplier });
  }

  function closeEdit() {
    setEditSupplier(null);
    setEditForm(null);
  }

  function saveEdit() {
    if (!editForm) return;

    if (!editForm.name.trim()) {
      alert("Supplier name is required.");
      return;
    }

    if (!editForm.mobile.trim()) {
      alert("Mobile number is required.");
      return;
    }

    const updated = suppliers.map((supplier) =>
      supplier.id === editForm.id
        ? {
            ...editForm,
            name: editForm.name.trim(),
            mobile: editForm.mobile.trim(),
            contactPerson: editForm.contactPerson.trim(),
            address: editForm.address.trim(),
          }
        : supplier,
    );

    localStorage.setItem(
      SUPPLIERS_KEY,
      JSON.stringify(updated),
    );

    setSuppliers(updated);

    window.dispatchEvent(
      new Event("phone-store-suppliers-updated"),
    );

    closeEdit();
  }

  function resetFilters() {
    setSupplierFilter("");
    setShowroomFilter("");
    setSearch("");
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <div className="space-y-5">
        {/* Top navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
              Supplier Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              All Suppliers
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage suppliers, balances and supplier information.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/suppliers/add"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition hover:bg-primary/90"
            >
              <FiPlus className="h-4 w-4" />
              Add Supplier
            </Link>

            <Link
              href="/suppliers/payments"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:border-primary/30 hover:bg-slate-50"
            >
              <FiPlus className="h-4 w-4 text-primary" />
              Add Transaction
            </Link>

            <Link
              href="/suppliers/all-payments"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:border-primary/30 hover:bg-slate-50"
            >
              All Transactions
            </Link>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-slate-50"
            >
              <FiPrinter className="h-4 w-4 text-primary" />
              Print
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total Suppliers
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {filteredSuppliers.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Active supplier records
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total Balance
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              ৳ {formatMoney(totalBalance)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Current displayed balance
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
              Payable
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              ৳ {formatMoney(totalPayable)}
            </p>

            <p className="mt-1 text-xs text-red-500">
              Amount payable to suppliers
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Receivable
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              ৳ {formatMoney(totalReceivable)}
            </p>

            <p className="mt-1 text-xs text-emerald-600">
              Amount receivable from suppliers
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Card header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Supplier Directory
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search, filter and manage all supplier records.
              </p>
            </div>

            <div className="relative w-full lg:w-72">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search supplier..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="border-b border-slate-200 bg-slate-50/70 p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <FiFilter className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Filter Suppliers
                </p>

                <p className="text-xs text-slate-500">
                  Narrow down your supplier list.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_auto_auto]">
              <div className="relative">
                <select
                  value={supplierFilter}
                  onChange={(event) =>
                    setSupplierFilter(event.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">
                    All Suppliers
                  </option>

                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.id}
                      value={supplier.id}
                    >
                      {supplier.name}
                    </option>
                  ))}
                </select>

                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="relative">
                <select
                  value={showroomFilter}
                  onChange={(event) =>
                    setShowroomFilter(event.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">
                    All Showrooms
                  </option>

                  {SHOWROOMS.map((showroom) => (
                    <option key={showroom} value={showroom}>
                      {showroom}
                    </option>
                  ))}
                </select>

                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <button
                type="button"
                onClick={() => {
                  // Filters are already live.
                  // This keeps the demo's "Show" behavior.
                }}
                className="h-11 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                Show
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-gray-800 transition hover:bg-slate-100"
              >
                <FiRefreshCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-5 text-xs font-semibold">
              <span className="flex items-center gap-2 text-emerald-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Green = Receivable
              </span>

              <span className="flex items-center gap-2 text-red-600">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                Red = Payable
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    SL
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Showroom
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Supplier
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Contact Person
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Mobile
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Current Balance
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                        <FiSearch className="h-5 w-5 text-slate-400" />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-800">
                        No suppliers found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your filters or add a new supplier.
                      </p>

                      <Link
                        href="/suppliers/add"
                        className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-white"
                      >
                        <FiPlus className="h-3.5 w-3.5" />
                        Add Supplier
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supplier, index) => {
                    const isPayable =
                      supplier.balanceType === "Payable";

                    return (
                      <tr
                        key={supplier.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-4 text-sm font-medium text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-[190px] truncate text-sm font-medium text-slate-800">
                            {supplier.showroom}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {supplier.name}
                            </p>

                            {supplier.address && (
                              <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-400">
                                {supplier.address}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {supplier.contactPerson || "—"}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          {supplier.mobile}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`text-sm font-bold ${
                              isPayable
                                ? "text-red-600"
                                : "text-emerald-600"
                            }`}
                          >
                            ৳ {formatMoney(supplier.initialBalance)}
                          </span>

                          <p
                            className={`mt-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                              isPayable
                                ? "text-red-400"
                                : "text-emerald-500"
                            }`}
                          >
                            {isPayable
                              ? "Payable"
                              : "Receivable"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title="View supplier"
                              onClick={() =>
                                setSelectedSupplier(supplier)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              title="Edit supplier"
                              onClick={() => openEdit(supplier)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 transition hover:bg-amber-100"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              title="Delete supplier"
                              onClick={() => handleDelete(supplier)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {filteredSuppliers.length > 0 && (
                <tfoot>
                  <tr className="border-t border-slate-200 bg-slate-50">
                    <td
                      colSpan={5}
                      className="px-5 py-4 text-right text-sm font-bold text-slate-700"
                    >
                      Total
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-900">
                      ৳ {formatMoney(totalBalance)}
                    </td>

                    <td colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Bottom */}
          <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing{" "}
              <strong className="text-slate-700">
                {filteredSuppliers.length}
              </strong>{" "}
              of{" "}
              <strong className="text-slate-700">
                {suppliers.length}
              </strong>{" "}
              suppliers
            </span>

            <span>
              Total balance:{" "}
              <strong className="text-slate-800">
                ৳ {formatMoney(totalBalance)}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Supplier Details
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {selectedSupplier.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-gray-800 transition hover:bg-slate-200"
              >
                <FiX />
              </button>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <DetailItem
                label="Showroom"
                value={selectedSupplier.showroom}
              />

              <DetailItem
                label="Supplier Name"
                value={selectedSupplier.name}
              />

              <DetailItem
                label="Contact Person"
                value={selectedSupplier.contactPerson || "—"}
              />

              <DetailItem
                label="Mobile"
                value={selectedSupplier.mobile}
              />

              <DetailItem
                label="Address"
                value={selectedSupplier.address || "—"}
              />

              <DetailItem
                label="Balance Type"
                value={selectedSupplier.balanceType}
              />

              <DetailItem
                label="Initial Balance"
                value={`৳ ${formatMoney(
                  selectedSupplier.initialBalance,
                )}`}
              />

              <DetailItem
                label="Status"
                value="Active"
              />
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="h-10 rounded-xl bg-white px-5 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editSupplier && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Supplier Management
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Edit Supplier
                </h3>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-gray-800 transition hover:bg-slate-200"
              >
                <FiX />
              </button>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <EditField
                label="Supplier Name"
                value={editForm.name}
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    name: value,
                  })
                }
              />

              <EditField
                label="Contact Person"
                value={editForm.contactPerson}
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    contactPerson: value,
                  })
                }
              />

              <EditField
                label="Mobile"
                value={editForm.mobile}
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    mobile: value,
                  })
                }
              />

              <EditField
                label="Address"
                value={editForm.address}
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    address: value,
                  })
                }
              />

              <EditField
                label="Initial Balance"
                type="number"
                value={String(editForm.initialBalance)}
                onChange={(value) =>
                  setEditForm({
                    ...editForm,
                    initialBalance: Number(value),
                  })
                }
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Balance Type
                </label>

                <select
                  value={editForm.balanceType}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      balanceType:
                        event.target.value as Supplier["balanceType"],
                    })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                >
                  <option value="Payable">Payable</option>
                  <option value="Receivable">Receivable</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Showroom
                </label>

                <select
                  value={editForm.showroom}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      showroom: event.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                >
                  {SHOWROOMS.map((showroom) => (
                    <option key={showroom} value={showroom}>
                      {showroom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={closeEdit}
                className="h-10 rounded-xl bg-white px-5 text-sm font-semibold text-gray-800 ring-1 ring-slate-200 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveEdit}
                className="h-10 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}