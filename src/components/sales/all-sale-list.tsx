"use client";

import { useState } from "react";
import { FiCalendar, FiChevronDown, FiSearch } from "react-icons/fi";

const SHOWROOMS = [
  "Phone Store (53, New Market)",
  "Main Showroom",
  "Uttara Showroom",
];

const CLIENTS = [
  "Walk-in Customer",
  "Rahim Ahmed",
  "Karim Hossain",
];

const PRODUCTS = [
  "iPhone 16 Pro Max",
  "Samsung Galaxy S25 Ultra",
  "Google Pixel 10 Pro",
];

const SALE_TYPES = [
  "Retail Sale",
  "Credit Sale",
  "Quotation",
];

export default function AllSaleList() {
  const [showroom, setShowroom] = useState("");
  const [voucherNo, setVoucherNo] = useState("");
  const [client, setClient] = useState("");
  const [saleType, setSaleType] = useState("");
  const [product, setProduct] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function handleShow() {
    // Filtering/result rendering will be connected to the sales data
    // in the next All Sale step. This button intentionally keeps the
    // reference layout and interaction ready.
  }

  function handleReset() {
    setShowroom("");
    setVoucherNo("");
    setClient("");
    setSaleType("");
    setProduct("");
    setFrom("");
    setTo("");
  }

  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 sm:px-5">
          <h1 className="text-base font-bold text-slate-800 sm:text-lg">
            View All Sale
          </h1>
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
              ariaLabel="Voucher number"
              value={voucherNo}
              onChange={setVoucherNo}
              placeholder="Voucher No"
            />

            <SelectField
              ariaLabel="Select client's name"
              value={client}
              onChange={setClient}
              placeholder="-- Select Client's Name --"
              options={CLIENTS}
            />

            <SelectField
              ariaLabel="Select sale type"
              value={saleType}
              onChange={setSaleType}
              placeholder="-- Select Sale Type --"
              options={SALE_TYPES}
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

            <div className="flex items-center justify-start gap-2">
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
                className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type SelectFieldProps = {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
};

function SelectField({
  ariaLabel,
  value,
  onChange,
  placeholder,
  options,
}: SelectFieldProps) {
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

type InputFieldProps = {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

function InputField({
  ariaLabel,
  value,
  onChange,
  placeholder,
}: InputFieldProps) {
  return (
    <label className="block">
      <span className="sr-only">{ariaLabel}</span>
      <input
        type="text"
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-gray-800 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

type DateFieldProps = {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

function DateField({
  ariaLabel,
  value,
  onChange,
  placeholder,
}: DateFieldProps) {
  return (
    <label className="relative block">
      <span className="sr-only">{ariaLabel}</span>
      <input
        type="date"
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${
          !value ? "text-slate-400" : ""
        }`}
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
