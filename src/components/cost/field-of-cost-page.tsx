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

type CostField = {
  id: string;
  name: string;
  category: string;
};

const STORAGE_KEY = "phone-store-cost-fields";

const demoFields: CostField[] = [
  { id: "1", name: "Electricity Bill", category: "Showroom Cost" },
  { id: "2", name: "Internet Bill", category: "Showroom Cost" },
  { id: "3", name: "Transport Fare", category: "Transport Cost" },
  { id: "4", name: "Facebook Promotion", category: "Marketing Cost" },
];

const demoCategories = [
  "Showroom Cost",
  "Office Expense",
  "Transport Cost",
  "Marketing Cost",
];

export default function FieldOfCostPage() {
  const [fields, setFields] = useState<CostField[]>(demoFields);
  const [categories, setCategories] = useState<string[]>(demoCategories);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const savedFields = localStorage.getItem(STORAGE_KEY);
      if (savedFields) {
        const parsed = JSON.parse(savedFields) as CostField[];
        if (Array.isArray(parsed)) setFields(parsed);
      }

      const savedCategories = localStorage.getItem(
        "phone-store-cost-categories",
      );

      if (savedCategories) {
        const parsed = JSON.parse(savedCategories) as {
          id: string;
          name: string;
        }[];

        if (Array.isArray(parsed) && parsed.length) {
          setCategories(parsed.map((item) => item.name));
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    } catch {}
  }, [fields]);

  const filteredFields = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return fields;

    return fields.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    );
  }, [fields, search]);

  function resetForm() {
    setName("");
    setCategory("");
    setEditingId(null);
    setError("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fieldName = name.trim();

    if (!fieldName) {
      setError("Please enter a field of cost name.");
      return;
    }

    if (!category) {
      setError("Please select a cost category.");
      return;
    }

    const duplicate = fields.some(
      (item) =>
        item.name.toLowerCase() === fieldName.toLowerCase() &&
        item.category.toLowerCase() === category.toLowerCase() &&
        item.id !== editingId,
    );

    if (duplicate) {
      setError("This field already exists under the selected category.");
      return;
    }

    if (editingId) {
      setFields((current) =>
        current.map((item) =>
          item.id === editingId
            ? { ...item, name: fieldName, category }
            : item,
        ),
      );
    } else {
      setFields((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          name: fieldName,
          category,
        },
      ]);
    }

    resetForm();
  }

  function editField(item: CostField) {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteField(item: CostField) {
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    setFields((current) => current.filter((field) => field.id !== item.id));

    if (editingId === item.id) resetForm();
  }

  return (
    <div className="w-full space-y-5">
      <CostNavigation />

      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Field of Cost
        </h1>
        <p className="text-xs text-slate-500">
          Create and manage the individual cost fields used in your expenses.
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
                {editingId ? "Edit Field of Cost" : "Add Field of Cost"}
              </h2>
              <p className="text-xs text-slate-500">
                Add a cost field and assign it to a category.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                Field of Cost <span className="text-error">*</span>
              </label>

              <div className="relative">
                <FiTag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter field of cost..."
                  className="input h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm text-gray-800 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">
                Cost Category <span className="text-error">*</span>
              </label>

              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setError("");
                }}
                className="select h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-gray-800 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                <option value="">Select category</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
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
                All Field of Cost
              </h2>
              <p className="text-xs text-slate-500">
                View, search and manage all cost fields.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:w-64">
              <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search field or category..."
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
          <table className="table min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="w-16">SL</th>
                <th>Field of Cost</th>
                <th>Cost Category</th>
                <th className="w-40 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredFields.map((item, index) => (
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
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                      {item.category}
                    </span>
                  </td>

                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => editField(item)}
                        className="btn btn-sm h-9 min-h-0 rounded-lg border-amber-200 bg-amber-50 px-3 text-amber-700 hover:bg-amber-100"
                      >
                        <FiEdit2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteField(item)}
                        className="btn btn-sm h-9 min-h-0 rounded-lg border-rose-200 bg-rose-50 px-3 text-rose-600 hover:bg-rose-100"
                      >
                        <FiTrash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredFields.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-sm text-slate-400"
                  >
                    No field of cost found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400 sm:px-6">
          Showing {filteredFields.length} of {fields.length} fields
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
