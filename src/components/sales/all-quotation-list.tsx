"use client";

import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiEye,
  FiCalendar,
  FiSearch,
  FiRotateCcw,
} from "react-icons/fi";

type Quotation = {
  id: string;
  quotationNo?: string;
  date?: string;
  showroom?: string;
  client?: string;
  mobile?: string;
  items?: Array<{
    name: string;
    model?: string;
    quantity: number;
    salePrice: number;
  }>;
  grandTotal?: number;
  status?: string;
};

const SHOWROOMS = [
  "Phone Store (53, New Market)",
  "Main Showroom",
  "Uttara Showroom",
];

const CLIENTS = [
  "Walk-in Customer",
  "Rahim Ahmed",
  "Karim Hossain",
  "Nusrat Jahan",
];

const PRODUCTS = [
  "iPhone 16 Pro Max",
  "Samsung Galaxy S25 Ultra",
  "Google Pixel 10 Pro",
  "OnePlus 13",
];

const STATUSES = ["Pending", "Accepted", "Expired"];

export default function AllQuotationList() {
  const [showroom, setShowroom] = useState("");
  const [quotationNo, setQuotationNo] = useState("");
  const [client, setClient] = useState("");
  const [product, setProduct] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [submittedFilters, setSubmittedFilters] = useState({
    showroom: "",
    quotationNo: "",
    client: "",
    product: "",
    status: "",
    from: "",
    to: "",
  });
  const [selected, setSelected] = useState<Quotation | null>(null);

  const quotations = useMemo<Quotation[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(
        localStorage.getItem("phone-store-quotations") || "[]"
      );
    } catch {
      return [];
    }
  }, [selected]);

  const filtered = quotations.filter((quotation) => {
    const items = quotation.items || [];
    const matchesProduct =
      !submittedFilters.product ||
      items.some(
        (item) =>
          item.name === submittedFilters.product ||
          item.model === submittedFilters.product
      );

    const date = quotation.date || "";
    const matchesFrom =
      !submittedFilters.from || date >= submittedFilters.from;
    const matchesTo = !submittedFilters.to || date <= submittedFilters.to;

    return (
      (!submittedFilters.showroom ||
        quotation.showroom === submittedFilters.showroom) &&
      (!submittedFilters.quotationNo ||
        (quotation.quotationNo || "")
          .toLowerCase()
          .includes(submittedFilters.quotationNo.toLowerCase())) &&
      (!submittedFilters.client ||
        quotation.client === submittedFilters.client) &&
      matchesProduct &&
      (!submittedFilters.status || quotation.status === submittedFilters.status) &&
      matchesFrom &&
      matchesTo
    );
  });

  function handleShow() {
    setSubmittedFilters({
      showroom,
      quotationNo,
      client,
      product,
      status,
      from,
      to,
    });
  }

  function handleReset() {
    setShowroom("");
    setQuotationNo("");
    setClient("");
    setProduct("");
    setStatus("");
    setFrom("");
    setTo("");
    setSubmittedFilters({
      showroom: "",
      quotationNo: "",
      client: "",
      product: "",
      status: "",
      from: "",
      to: "",
    });
  }

  return (
    <section className="w-full space-y-5">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5">
          <h1 className="text-lg font-bold text-slate-800">View All Quotation</h1>
          <p className="mt-1 text-xs text-slate-500">
            Search and review quotations saved from the quotation form.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SelectField
              ariaLabel="Select showroom"
              value={showroom}
              onChange={setShowroom}
              placeholder="-- Select Showroom --"
              options={SHOWROOMS}
            />

            <InputField
              ariaLabel="Quotation number"
              value={quotationNo}
              onChange={setQuotationNo}
              placeholder="Quotation No"
            />

            <SelectField
              ariaLabel="Select client's name"
              value={client}
              onChange={setClient}
              placeholder="-- Select Client's Name --"
              options={CLIENTS}
            />

            <SelectField
              ariaLabel="Select status"
              value={status}
              onChange={setStatus}
              placeholder="-- Select Status --"
              options={STATUSES}
            />

            <SelectField
              ariaLabel="Select product model"
              value={product}
              onChange={setProduct}
              placeholder="-- Select Product Model --"
              options={PRODUCTS}
            />

            <DateField
              ariaLabel="From date"
              value={from}
              onChange={setFrom}
              placeholder="From"
            />

            <DateField
              ariaLabel="To date"
              value={to}
              onChange={setTo}
              placeholder="To"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShow}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-content shadow-sm transition hover:opacity-90"
              >
                <FiSearch className="h-4 w-4" />
                Show
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-slate-50"
              >
                <FiRotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold text-slate-800">Quotation List</h2>
            <p className="text-xs text-slate-500">
              {filtered.length} quotation{filtered.length === 1 ? "" : "s"} found
            </p>
          </div>
          <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
            Total: {filtered.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-3">SL</th>
                <th className="px-4 py-3">Quotation No.</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Grand Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <FiSearch className="h-5 w-5" />
                      </div>
                      <p className="font-semibold text-slate-700">
                        No quotation found
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Create a quotation first or change the filters above.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((quotation, index) => (
                  <tr key={quotation.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {quotation.quotationNo || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {quotation.date || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">
                        {quotation.client || "-"}
                      </p>
                      {quotation.mobile && (
                        <p className="text-xs text-slate-500">
                          {quotation.mobile}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {quotation.items?.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      ) || 0}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {(quotation.grandTotal || 0).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        {quotation.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelected(quotation)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-gray-800 shadow-sm hover:bg-slate-50"
                      >
                        <FiEye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="font-bold text-slate-800">Quotation Details</h3>
                <p className="text-xs text-slate-500">
                  {selected.quotationNo || "-"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Info label="Date" value={selected.date || "-"} />
                <Info label="Client" value={selected.client || "-"} />
                <Info label="Mobile" value={selected.mobile || "-"} />
                <Info
                  label="Grand Total"
                  value={(selected.grandTotal || 0).toLocaleString()}
                />
              </div>

              <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-[650px] w-full text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                    <tr>
                      <th className="px-3 py-3 text-left">Product</th>
                      <th className="px-3 py-3 text-left">Model</th>
                      <th className="px-3 py-3 text-right">Qty</th>
                      <th className="px-3 py-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selected.items || []).map((item, index) => (
                      <tr key={`${item.name}-${index}`}>
                        <td className="px-3 py-3 text-slate-800">{item.name}</td>
                        <td className="px-3 py-3 text-slate-600">
                          {item.model || "-"}
                        </td>
                        <td className="px-3 py-3 text-right text-slate-600">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-3 text-right font-medium text-slate-800">
                          {item.salePrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SelectField({
  ariaLabel,
  value,
  onChange,
  placeholder,
  options,
}: {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{ariaLabel}</span>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </label>
  );
}

function InputField({
  ariaLabel,
  value,
  onChange,
  placeholder,
}: {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="sr-only">{ariaLabel}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-gray-800 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

function DateField({
  ariaLabel,
  value,
  onChange,
  placeholder,
}: {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{ariaLabel}</span>
      <input
        type="date"
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
      {!value && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-white pr-1 text-sm text-slate-400">
          {placeholder}
        </span>
      )}
      <FiCalendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}
