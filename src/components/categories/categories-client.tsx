"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiGrid,
  FiPlus,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";

import type { Category } from "../../types/category";

import CategoryFormModal from "./category-form-modal";
import CategoryTable from "./category-table";

const STORAGE_KEY = "phone-store-categories";

type CategoriesClientProps = {
  initialCategories: Category[];
};

export default function CategoriesClient({
  initialCategories,
}: CategoriesClientProps) {
  const [categories, setCategories] =
    useState<Category[]>(initialCategories);

  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] =
    useState<"add" | "edit">("add");

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [deleteCategory, setDeleteCategory] =
    useState<Category | null>(null);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setCategories(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error,
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(categories),
    );
  }, [categories, hydrated]);

  const activeCount = useMemo(
    () =>
      categories.filter(
        (category) => category.status === "Active",
      ).length,
    [categories],
  );

  const inactiveCount = categories.length - activeCount;

  function openAddModal() {
    setFormMode("add");
    setSelectedCategory(null);
    setFormOpen(true);
  }

  function openEditModal(category: Category) {
    setFormMode("edit");
    setSelectedCategory(category);
    setFormOpen(true);
  }

  function handleSave(category: Category) {
    const exists = categories.some(
      (item) => item.id === category.id,
    );

    if (exists) {
      setCategories((current) =>
        current.map((item) =>
          item.id === category.id
            ? category
            : item,
        ),
      );
    } else {
      setCategories((current) => [
        category,
        ...current,
      ]);
    }

    setFormOpen(false);
    setSelectedCategory(null);
  }

  function handleDelete() {
    if (!deleteCategory) return;

    setCategories((current) =>
      current.filter(
        (item) => item.id !== deleteCategory.id,
      ),
    );

    setDeleteCategory(null);
  }

  return (
    <>
      {/* Summary */}
      <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Categories"
          value={categories.length}
          icon={<FiGrid />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          title="Active Categories"
          value={activeCount}
          icon={<FiCheckCircle />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          title="Inactive Categories"
          value={inactiveCount}
          icon={<FiXCircle />}
          iconClass="bg-slate-100 text-slate-500"
        />
      </section>

      {/* Toolbar */}
      <div className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search categories..."
              className="input h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="btn btn-primary h-11 rounded-xl px-5 text-xs shadow-md shadow-primary/20"
          >
            <FiPlus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Table */}
      <CategoryTable
        categories={categories}
        search={search}
        onEdit={openEditModal}
        onDelete={setDeleteCategory}
      />

      {/* Form */}
      <CategoryFormModal
        open={formOpen}
        mode={formMode}
        category={selectedCategory}
        onClose={() => {
          setFormOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSave}
      />

      {/* Delete */}
      {deleteCategory && (
        <DeleteCategoryModal
          category={deleteCategory}
          onCancel={() => setDeleteCategory(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function DeleteCategoryModal({
  category,
  onCancel,
  onConfirm,
}: {
  category: Category;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <FiXCircle className="h-5 w-5" />
        </div>

        <h2 className="mt-5 text-base font-bold text-slate-900">
          Delete category?
        </h2>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-800">
            {category.name}
          </span>
          ?
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-sm h-10 rounded-xl border-slate-200 bg-white px-5 text-xs text-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-error btn-sm h-10 rounded-xl px-5 text-xs text-white"
          >
            Delete Category
          </button>
        </div>
      </div>
    </div>
  );
}