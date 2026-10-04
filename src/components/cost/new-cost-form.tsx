"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewCostForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    fieldOfCost: "",
    amount: "",
    paymentMethod: "Cash",
    referenceNo: "",
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "1", name: "Office Expenses" },
    { id: "2", name: "Utility Bills" },
    { id: "3", name: "Salary & Wages" },
    { id: "4", name: "Marketing & Ads" },
  ];

  const fieldsOfCost = [
    { id: "1", name: "Rent" },
    { id: "2", name: "Electricity Bill" },
    { id: "3", name: "Internet Bill" },
    { id: "4", name: "Office Snacks" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Submitting New Cost:", formData);

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Cost added successfully!");
      router.push("/cost/fields");
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            Expense Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="fieldOfCost" className="text-sm font-medium">
            Field of Cost <span className="text-red-500">*</span>
          </label>
          <select
            id="fieldOfCost"
            name="fieldOfCost"
            required
            value={formData.fieldOfCost}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Field of Cost</option>
            {fieldsOfCost.map((field) => (
              <option key={field.id} value={field.name}>
                {field.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount (৳) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
            value={formData.amount}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="paymentMethod" className="text-sm font-medium">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="bKash / Mobile Banking">bKash / Mobile Banking</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="referenceNo" className="text-sm font-medium">
            Reference / Receipt No.
          </label>
          <input
            type="text"
            id="referenceNo"
            name="referenceNo"
            placeholder="e.g. EXP-2026-001"
            value={formData.referenceNo}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="note" className="text-sm font-medium">
          Note / Expense Description
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Add any additional details or remarks..."
          value={formData.note}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Expense"}
        </button>
      </div>
    </form>
  );
}