"use client";

import {
  FiEdit3,
  FiMoreHorizontal,
  FiPackage,
  FiTrash2,
} from "react-icons/fi";

import type { Category } from "../../types/category";

type CategoryTableProps = {
  categories: Category[];
  search: string;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

export default function CategoryTable({
  categories,
  search,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const filteredCategories = categories.filter((category) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      category.name.toLowerCase().includes(value) ||
      category.description.toLowerCase().includes(value)
    );
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Category List
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Manage your product categories.
          </p>
        </div>

        <p className="text-xs text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredCategories.length}
          </span>{" "}
          categories
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-[10px] uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-semibold">
                Category
              </th>

              <th className="px-4 py-3 font-semibold">
                Description
              </th>

              <th className="px-4 py-3 font-semibold">
                Products
              </th>

              <th className="px-4 py-3 font-semibold">
                Status
              </th>

              <th className="px-4 py-3 font-semibold">
                Created
              </th>

              <th className="px-4 py-3 text-center font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onEdit={() => onEdit(category)}
                onDelete={() => onDelete(category)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-100 md:hidden">
        {filteredCategories.map((category) => (
          <CategoryMobileCard
            key={category.id}
            category={category}
            onEdit={() => onEdit(category)}
            onDelete={() => onDelete(category)}
          />
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <FiPackage className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-800">
            No categories found
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Try another search term.
          </p>
        </div>
      )}
    </div>
  );
}

function CategoryRow({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/70">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
            {category.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800">
              {category.name}
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Category
            </p>
          </div>
        </div>
      </td>

      <td className="max-w-[280px] px-4 py-4">
        <p className="truncate text-xs text-slate-500">
          {category.description}
        </p>
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <FiPackage className="h-3.5 w-3.5 text-slate-400" />
          0
        </span>
      </td>

      <td className="px-4 py-4">
        <StatusBadge status={category.status} />
      </td>

      <td className="px-4 py-4">
        <span className="text-xs text-slate-500">
          {category.createdAt}
        </span>
      </td>

      <td className="px-4 py-4 text-center">
        <ActionMenu
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}

function CategoryMobileCard({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
            {category.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {category.name}
            </p>

            <p className="mt-1 truncate text-xs text-slate-400">
              {category.description}
            </p>
          </div>
        </div>

        <ActionMenu
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-xs text-slate-500">
          Products:{" "}
          <strong className="text-slate-700">0</strong>
        </span>

        <StatusBadge status={category.status} />

        <span className="text-xs text-slate-400">
          {category.createdAt}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: Category["status"];
}) {
  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${
        status === "Active"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {status}
    </span>
  );
}

function ActionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="dropdown dropdown-end">
      <button
        type="button"
        tabIndex={0}
        className="btn btn-ghost btn-square btn-sm"
      >
        <FiMoreHorizontal className="h-4 w-4 text-slate-400" />
      </button>

      <ul
        tabIndex={0}
        className="menu dropdown-content z-50 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
      >
        <li>
          <button type="button" onClick={onEdit}>
            <FiEdit3 className="h-4 w-4" />
            Edit
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={onDelete}
            className="text-error"
          >
            <FiTrash2 className="h-4 w-4" />
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
}