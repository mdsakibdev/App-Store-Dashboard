"use client";

import { useMemo, useState } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiRotateCcw,
  FiSearch,
} from "react-icons/fi";

type Sale = {
  id: string;
  date: string;
  voucher: string;
  client: string;
  mobile: string;
  product: string;
  model: string;
  qty: number;
  price: number;
  discount: number;
  total: number;
  type: string;
};

const CLIENTS = [
  { name: "Walk-in Customer", mobile: "01700000000" },
  { name: "Rahim Ahmed", mobile: "01711111111" },
  { name: "Karim Hossain", mobile: "01822222222" },
  { name: "Nusrat Jahan", mobile: "01933333333" },
];

const SHOWROOMS = [
  "Phone Store (53, New Market)",
  "Main Showroom",
  "Uttara Showroom",
];

const DEMO_SALES: Sale[] = [
  {
    id: "1",
    date: "2026-10-04",
    voucher: "SL-1001",
    client: "Walk-in Customer",
    mobile: "01700000000",
    product: "iPhone 16 Pro Max",
    model: "A3296",
    qty: 1,
    price: 145000,
    discount: 2000,
    total: 143000,
    type: "Retail Sale",
  },
  {
    id: "2",
    date: "2026-10-03",
    voucher: "SL-1002",
    client: "Rahim Ahmed",
    mobile: "01711111111",
    product: "Samsung Galaxy S25 Ultra",
    model: "SM-S938B",
    qty: 1,
    price: 132000,
    discount: 1000,
    total: 131000,
    type: "Credit Sale",
  },
  {
    id: "3",
    date: "2026-10-02",
    voucher: "SL-1003",
    client: "Karim Hossain",
    mobile: "01822222222",
    product: "OnePlus 13",
    model: "CPH2653",
    qty: 2,
    price: 89000,
    discount: 3000,
    total: 175000,
    type: "Retail Sale",
  },
  {
    id: "4",
    date: "2026-10-01",
    voucher: "SL-1004",
    client: "Rahim Ahmed",
    mobile: "01711111111",
    product: "Google Pixel 10 Pro",
    model: "G5J7N",
    qty: 1,
    price: 118000,
    discount: 1500,
    total: 116500,
    type: "Retail Sale",
  },
];

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

export default function ClientWiseSale() {
  const [client, setClient] = useState("");
  const [mobile, setMobile] = useState("");
  const [showroom, setShowroom] = useState("");
  const [voucher, setVoucher] = useState("");
  const [saleType, setSaleType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [searched, setSearched] = useState(false);

  const rows = useMemo(() => {
    if (!searched) return [];

    return DEMO_SALES.filter((sale) => {
      return (
        (!client || sale.client === client) &&
        (!mobile || sale.mobile.includes(mobile)) &&
        // Showroom is kept as a frontend filter placeholder until sale records
        // carry showroom information.
        (!showroom || showroom === SHOWROOMS[0]) &&
        (!voucher ||
          sale.voucher.toLowerCase().includes(voucher.toLowerCase())) &&
        (!saleType || sale.type === saleType) &&
        (!from || sale.date >= from) &&
        (!to || sale.date <= to)
      );
    });
  }, [searched, client, mobile, showroom, voucher, saleType, from, to]);

  const totalQty = rows.reduce((sum, row) => sum + row.qty, 0);
  const totalDiscount = rows.reduce((sum, row) => sum + row.discount, 0);
  const totalAmount = rows.reduce((sum, row) => sum + row.total, 0);

  function reset() {
    setClient("");
    setMobile("");
    setShowroom("");
    setVoucher("");
    setSaleType("");
    setFrom("");
    setTo("");
    setSearched(false);
  }

  return (
    <section className="w-full space-y-5">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5">
          <h1 className="text-lg font-bold text-slate-800">
            Search Client Wise
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Search sales by client, mobile number, voucher and date range.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SelectField
              label="Client"
              value={client}
              onChange={(value) => {
                setClient(value);
                setMobile(
                  CLIENTS.find((item) => item.name === value)?.mobile || ""
                );
              }}
              placeholder="-- Select Client's Name --"
              options={CLIENTS.map((item) => item.name)}
            />

            <input
              aria-label="Mobile number"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              placeholder="Mobile"
              className={inputClass}
            />

            <SelectField
              label="Showroom"
              value={showroom}
              onChange={setShowroom}
              placeholder="-- Select Showroom --"
              options={SHOWROOMS}
            />

            <input
              aria-label="Voucher number"
              value={voucher}
              onChange={(event) => setVoucher(event.target.value)}
              placeholder="Voucher No"
              className={inputClass}
            />

            <SelectField
              label="Sale Type"
              value={saleType}
              onChange={setSaleType}
              placeholder="-- Select Sale Type --"
              options={["Retail Sale", "Credit Sale", "Credit Chalan"]}
            />

            <DateField label="From" value={from} onChange={setFrom} />
            <DateField label="To" value={to} onChange={setTo} />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearched(true)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-content shadow-sm transition hover:opacity-90"
              >
                <FiSearch className="h-4 w-4" />
                Show
              </button>

              <button
                type="button"
                onClick={reset}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:bg-slate-50"
              >
                <FiRotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {searched && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard label="Total Quantity" value={totalQty.toLocaleString()} />
            <SummaryCard
              label="Total Discount"
              value={totalDiscount.toLocaleString()}
            />
            <SummaryCard
              label="Total Amount"
              value={totalAmount.toLocaleString()}
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5">
              <h2 className="font-bold text-slate-800">Client Wise Sale List</h2>
              <p className="mt-1 text-xs text-slate-500">
                {rows.length} result{rows.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1150px] w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                  <tr>
                    {[
                      "SL",
                      "Date",
                      "Voucher No.",
                      "Client",
                      "Mobile",
                      "Product Name",
                      "Model",
                      "QTY",
                      "Sale Price",
                      "Discount",
                      "Total",
                      "Sale Type",
                    ].map((heading) => (
                      <th key={heading} className="px-4 py-3">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={12}
                        className="px-4 py-12 text-center text-slate-500"
                      >
                        No sale found for the selected client filters.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, index) => (
                      <tr key={row.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                        <td className="px-4 py-3 text-slate-600">{row.date}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {row.voucher}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {row.client}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.mobile}
                        </td>
                        <td className="px-4 py-3 text-slate-800">
                          {row.product}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{row.model}</td>
                        <td className="px-4 py-3 text-slate-700">{row.qty}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {row.price.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.discount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {row.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {row.type}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                {rows.length > 0 && (
                  <tfoot className="border-t border-slate-200 bg-slate-50">
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-3 text-right font-bold text-slate-700"
                      >
                        Total
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {totalQty}
                      </td>
                      <td />
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {totalDiscount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {totalAmount.toLocaleString()}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function SelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} appearance-none pr-9`}
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

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <input
        aria-label={label}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
      <FiCalendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </label>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
