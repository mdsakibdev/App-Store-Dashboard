"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiEdit2,
  FiLayers,
  FiPlus,
  FiPrinter,
  FiSearch,
  FiTag,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import CostNavigation from "./cost-navigation";

type CostCategory = {
  id: string;
  name: string;
};

const STORAGE_KEY = "phone-store-cost-categories";

const demoCategories: CostCategory[] = [
  { id: "1", name: "Showroom Cost" },
  { id: "2", name: "Office Expense" },
  { id: "3", name: "Transport Cost" },
  { id: "4", name: "Marketing Cost" },
];

export default function CostCategoryPage() {
  const [categories, setCategories] = useState<CostCategory[]>(demoCategories);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CostCategory[];
        if (Array.isArray(parsed)) setCategories(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch {}
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? categories.filter((item) => item.name.toLowerCase().includes(query))
      : categories;
  }, [categories, search]);

  function resetForm() {
    setName("");
    setEditingId(null);
    setError("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = name.trim();

    if (!value) {
      setError("Please enter a cost category name.");
      return;
    }

    const duplicate = categories.some(
      (item) =>
        item.name.toLowerCase() === value.toLowerCase() &&
        item.id !== editingId,
    );

    if (duplicate) {
      setError("This cost category already exists.");
      return;
    }

    if (editingId) {
      setCategories((current) =>
        current.map((item) =>
          item.id === editingId ? { ...item, name: value } : item,
        ),
      );
    } else {
      setCategories((current) => [
        ...current,
        { id: crypto.randomUUID(), name: value },
      ]);
    }

    resetForm();
  }

  function editCategory(item: CostCategory) {
    setEditingId(item.id);
    setName(item.name);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteCategory(item: CostCategory) {
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    setCategories((current) =>
      current.filter((category) => category.id !== item.id),
    );

    if (editingId === item.id) resetForm();
  }

  return (
    <div className="w-full space-y-5">
      <CostNavigation />

      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Cost Category
        </h1>
        <p className="text-xs text-slate-500">
          Add and manage the categories used for your business costs.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {editingId ? (
                <FiEdit2 className="h-5 w-5" />
              ) : (
                <FiPlus className="h-5 w-5" />
              )}
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                {editingId ? "Edit Cost Category" : "Add Cost Category"}
              </h2>
              <p className="text-xs text-slate-500">
                {editingId
                  ? "Update the selected category."
                  : "Create a new category for organizing expenses."}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <label className="mb-2 block text-xs font-semibold text-slate-700">
            Cost Category <span className="text-error">*</span>
          </label>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <FiTag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                placeholder="Enter cost category name..."
                className="input h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm text-gray-800 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary h-11 min-w-24 rounded-xl px-5 text-sm"
              >
                {editingId ? (
                  <FiEdit2 className="h-4 w-4" />
                ) : (
                  <FiPlus className="h-4 w-4" />
                )}
                {editingId ? "Update" : "Save"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn h-11 rounded-xl border-slate-200 bg-white px-4 text-sm text-gray-800 hover:bg-slate-50"
                >
                  <FiX className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-2 text-xs font-medium text-error">{error}</p>
          )}
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <FiLayers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                All Cost Category
              </h2>
              <p className="text-xs text-slate-500">
                View and manage all cost categories.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:w-64">
              <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search cost category..."
                className="input h-10 w-full rounded-xl border-slate-200 bg-slate-50 pl-10 text-xs text-gray-800 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="btn h-10 rounded-xl border-slate-200 bg-slate-50 px-4 text-xs text-gray-800 hover:bg-slate-100"
            >
              <FiPrinter className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table min-w-162.5">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="w-16">SL</th>
                <th>Category</th>
                <th className="w-40 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                >
                  <td className="font-medium text-slate-500">{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FiTag className="h-4 w-4" />
                      </span>
                      <span className="font-semibold text-slate-800">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => editCategory(item)}
                        className="btn btn-sm h-9 min-h-0 rounded-lg border-amber-200 bg-amber-50 px-3 text-amber-700 hover:bg-amber-100"
                      >
                        <FiEdit2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCategory(item)}
                        className="btn btn-sm h-9 min-h-0 rounded-lg border-rose-200 bg-rose-50 px-3 text-rose-600 hover:bg-rose-100"
                      >
                        <FiTrash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-sm text-slate-400">
                    No cost category found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400 sm:px-6">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </section>

      <style jsx global>{`
        @media print {
          aside,
          header,
          nav {
            display: none !important;
          }

          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
