"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";

import type { Category } from "../../types/category";

type CategoryFormModalProps = {
  open: boolean;
  mode: "add" | "edit";
  category?: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
};

export default function CategoryFormModal({
  open,
  mode,
  category,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [status, setStatus] =
    useState<Category["status"]>("Active");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && category) {
      setName(category.name);
      setDescription(category.description);
      setStatus(category.status);
    } else {
      setName("");
      setDescription("");
      setStatus("Active");
    }

    setError("");
  }, [open, mode, category]);

  if (!open) return null;

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    const newCategory: Category = {
      id: category?.id ?? crypto.randomUUID(),
      name: name.trim(),
      description:
        description.trim() ||
        "No description available.",
      status,
      createdAt:
        category?.createdAt ??
        new Date().toISOString().slice(0, 10),
    };

    onSave(newCategory);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {mode === "add"
                ? "Add Category"
                : "Edit Category"}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {mode === "add"
                ? "Create a new product category."
                : "Update category information."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-square"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-xs font-medium text-error">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Category Name{" "}
              <span className="text-error">*</span>
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Smartphone"
              className="input h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Write a short description..."
              rows={4}
              className="textarea w-full resize-none rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>

          {/* Status */}
          <div className="mt-5">
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as Category["status"],
                )
              }
              className="select h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* Footer */}
          <div className="mt-7 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm h-11 rounded-xl border-slate-200 bg-white px-5 text-xs text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-sm h-11 rounded-xl px-5 text-xs"
            >
              <FiCheck className="h-4 w-4" />

              {mode === "add"
                ? "Add Category"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}