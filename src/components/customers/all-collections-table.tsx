"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FiPrinter,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiEye,
  FiCalendar,
} from "react-icons/fi";
import { Customer } from "../../types/customer";
import { getCustomersFromStorage } from "../../lib/customer-demo-data";

export type CollectionRecord = {
  id: string;
  date: string;
  showroom: string;
  customerId: string;
  customerName: string;
  voucherNo: string;
  dueAmount: number;
  installmentAmount: number;
  collectionMethod: string;
  paymentAmount: number;
  remissionAmount: number;
  totalDue: number;
  paidBy: string;
  createdAt: string;
};

export default function AllCollectionsTable() {
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Filter States
  const [selectedShowroom, setSelectedShowroom] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadData = () => {
    const custData = getCustomersFromStorage();
    setCustomers(custData);

    const storedCollections = localStorage.getItem("phone-store-collections");
    if (storedCollections) {
      try {
        setCollections(JSON.parse(storedCollections));
      } catch {
        setCollections([]);
      }
    } else {
      // Demo fallback collection records
      const demoCollections: CollectionRecord[] = [
        {
          id: "COLL-1001",
          date: "2026-10-01",
          showroom: "Phone Store ( 53,New Market )",
          customerId: "CUST-001",
          customerName: "Tanvir Ahmed",
          voucherNo: "INV-2026-001",
          dueAmount: 15000,
          installmentAmount: 5000,
          collectionMethod: "Cash",
          paymentAmount: 5000,
          remissionAmount: 0,
          totalDue: 10000,
          paidBy: "Tanvir Ahmed",
          createdAt: new Date().toISOString(),
        },
        {
          id: "COLL-1002",
          date: "2026-09-28",
          showroom: "Main Branch",
          customerId: "CUST-002",
          customerName: "Rahim Uddin",
          voucherNo: "INV-2026-002",
          dueAmount: 8500,
          installmentAmount: 3000,
          collectionMethod: "bKash",
          paymentAmount: 3000,
          remissionAmount: 100,
          totalDue: 5400,
          paidBy: "Rahim Uddin",
          createdAt: new Date().toISOString(),
        },
      ];
      setCollections(demoCollections);
      localStorage.setItem("phone-store-collections", JSON.stringify(demoCollections));
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("phone-store-customers-updated", handleUpdate);
    return () => {
      window.removeEventListener("phone-store-customers-updated", handleUpdate);
    };
  }, []);

  // Filtered collections
  const filteredCollections = useMemo(() => {
    return collections.filter((item) => {
      const matchShowroom = selectedShowroom ? item.showroom === selectedShowroom : true;
      const matchClient = selectedClient ? item.customerId === selectedClient : true;
      const matchInvoice = invoiceNo
        ? item.voucherNo.toLowerCase().includes(invoiceNo.toLowerCase()) ||
          item.id.toLowerCase().includes(invoiceNo.toLowerCase())
        : true;
      const matchFrom = fromDate ? item.date >= fromDate : true;
      const matchTo = toDate ? item.date <= toDate : true;

      return matchShowroom && matchClient && matchInvoice && matchFrom && matchTo;
    });
  }, [collections, selectedShowroom, selectedClient, invoiceNo, fromDate, toDate]);

  // Showrooms list
  const showrooms = useMemo(() => {
    const set = new Set(customers.map((c) => c.showroom));
    return Array.from(set);
  }, [customers]);

  // Total summary calculations
  const totalCollected = filteredCollections.reduce((acc, curr) => acc + curr.paymentAmount, 0);
  const totalRemission = filteredCollections.reduce((acc, curr) => acc + curr.remissionAmount, 0);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this collection record?")) {
      const updated = collections.filter((c) => c.id !== id);
      setCollections(updated);
      localStorage.setItem("phone-store-collections", JSON.stringify(updated));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetFilters = () => {
    setSelectedShowroom("");
    setSelectedClient("");
    setInvoiceNo("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="space-y-6">
      {/* Printable CSS Setup */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area,
          #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white;
            color: black;
          }
          .no-print {
            display: none !important;
          }
          table {
            width: 100%;
            border-collapse: collapse !important;
          }
          th,
          td {
            border: 1px solid #000 !important;
            padding: 6px 8px !important;
            font-size: 11px !important;
            color: #000 !important;
          }
        }
      `}</style>

      {/* Filters Box */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-800">All Customer Collection</h1>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
              Records: {filteredCollections.length}
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition flex items-center gap-2 cursor-pointer"
          >
            <FiPrinter className="h-4 w-4 text-primary" /> Print Report
          </button>
        </div>

        {/* Demo Screenshot Exact Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Showroom */}
          <select
            value={selectedShowroom}
            onChange={(e) => setSelectedShowroom(e.target.value)}
            className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-primary focus:outline-hidden transition"
          >
            <option value="">-- Select Showroom --</option>
            {showrooms.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Select Client */}
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-primary focus:outline-hidden transition"
          >
            <option value="">-- Select Client --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id})
              </option>
            ))}
          </select>

          {/* Invoice No */}
          <input
            type="text"
            placeholder="Invoice No"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            className="h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-primary focus:outline-hidden transition min-w-[130px]"
          />

          {/* From Date */}
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {/* To Date */}
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {/* Show / Filter Button */}
          <button
            onClick={() => {}}
            className="h-10 px-5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            Show
          </button>

          {(selectedShowroom || selectedClient || invoiceNo || fromDate || toDate) && (
            <button
              onClick={handleResetFilters}
              className="h-10 px-3 text-xs text-rose-600 font-medium hover:bg-rose-50 rounded-xl transition cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Collection Totals Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Total Collection</span>
            <span className="text-sm font-bold text-emerald-700">৳{totalCollected.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Total Remission</span>
            <span className="text-sm font-bold text-amber-700">৳{totalRemission.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Printable Area Wrapper */}
      <div id="printable-area" className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Printable Document Header */}
        <div className="hidden print:block mb-6">
          <div className="flex items-center gap-4 border-b border-black pb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl shrink-0">
              PS
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-rose-600 tracking-tight uppercase">
                PHONE STORE
              </h1>
              <p className="text-xs font-semibold text-slate-700">Next Level Of Technology</p>
              <p className="text-[10px] text-slate-600">|| +8801206010201</p>
              <p className="text-[10px] text-slate-600">Dhaka, Bangladesh</p>
            </div>
          </div>
          <h2 className="text-center font-bold text-base mt-4 underline uppercase">
            All Customer Collection Report
          </h2>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">SL</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">C.ID</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Voucher No</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4 text-right">Payment (TK)</th>
                <th className="py-3.5 px-4 text-right">Remission (TK)</th>
                <th className="py-3.5 px-4">Paid By</th>
                <th className="py-3.5 px-4">Showroom</th>
                <th className="py-3.5 px-4 text-center no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-slate-400">
                    No collection records found.
                  </td>
                </tr>
              ) : (
                filteredCollections.map((col, idx) => (
                  <tr key={col.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{col.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{col.customerId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{col.customerName}</td>
                    <td className="py-3 px-4 font-medium text-slate-600">{col.voucherNo}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {col.collectionMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                      ৳{col.paymentAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-amber-600">
                      ৳{col.remissionAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{col.paidBy || "-"}</td>
                    <td className="py-3 px-4 text-slate-600">{col.showroom}</td>
                    <td className="py-3 px-4 text-center no-print">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          title="View Voucher"
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(col.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}