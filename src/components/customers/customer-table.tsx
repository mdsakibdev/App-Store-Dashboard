"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  FiPrinter,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiUser,
  FiFilter,
} from "react-icons/fi";
import type { Customer } from "../../types/customer";
import { getCustomersFromStorage } from "../../lib/customer-demo-data";

export default function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedShowroom, setSelectedShowroom] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Load data from localStorage
  const loadData = () => {
    const data = getCustomersFromStorage();
    setCustomers(data);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("phone-store-customers-updated", handleUpdate);
    return () => {
      window.removeEventListener("phone-store-customers-updated", handleUpdate);
    };
  }, []);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchShowroom = selectedShowroom
        ? cust.showroom === selectedShowroom
        : true;
      const matchClient = selectedClient ? cust.id === selectedClient : true;
      const matchSearch = searchTerm
        ? cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cust.mobile.includes(searchTerm) ||
          cust.id.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return matchShowroom && matchClient && matchSearch;
    });
  }, [customers, selectedShowroom, selectedClient, searchTerm]);

  // Showroom options list
  const showrooms = useMemo(() => {
    const set = new Set(customers.map((c) => c.showroom));
    return Array.from(set);
  }, [customers]);

  // Delete Customer
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      const updated = customers.filter((c) => c.id !== id);
      localStorage.setItem("phone-store-customers", JSON.stringify(updated));
      setCustomers(updated);
    }
  };

  // Trigger Print Browser window
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Printable Area - Printable CSS setup */}
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

      {/* Filter and Top Actions Card (Hidden during print) */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-800">All Customers</h1>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
              Total: {filteredCustomers.length}
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition flex items-center gap-2 cursor-pointer"
          >
            <FiPrinter className="h-4 w-4 text-primary" /> Print List
          </button>
        </div>

        {/* Filters */}
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

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {(selectedShowroom || selectedClient || searchTerm) && (
            <button
              onClick={() => {
                setSelectedShowroom("");
                setSelectedClient("");
                setSearchTerm("");
              }}
              className="h-10 px-3 text-xs text-rose-600 font-medium hover:bg-rose-50 rounded-xl transition cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Legend Indicator */}
        <div className="text-xs font-semibold flex items-center gap-4 pt-1">
          <span className="text-emerald-600 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            Green = Receivable (বকেয়া)
          </span>
          <span className="text-rose-600 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            Red = Payable (এডভান্স)
          </span>
        </div>
      </div>

      {/* Printable Area Wrapper */}
      <div id="printable-area" className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Printable Header - Visible during Print */}
        <div className="hidden print:block mb-6">
          <div className="flex items-center gap-4 border-b border-black pb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl shrink-0">
              PS
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-rose-600 tracking-tight uppercase">
                PHONE STORE
              </h1>
              <p className="text-xs font-semibold text-slate-700">
                Next Level Of Technology
              </p>
              <p className="text-[10px] text-slate-600">|| +8801206010201</p>
              <p className="text-[10px] text-slate-600">Dhaka, Bangladesh</p>
            </div>
          </div>
          <h2 className="text-center font-bold text-base mt-4 underline uppercase">
            All Customer
          </h2>
        </div>

        {/* Customer Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">SL</th>
                <th className="py-3.5 px-4">C.ID</th>
                <th className="py-3.5 px-4 w-14 text-center">Photo</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Address</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4 text-right">Balance</th>
                <th className="py-3.5 px-4">Showroom</th>
                <th className="py-3.5 px-4 text-center no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust, idx) => {
                  const isReceivable = cust.balanceType === "Receivable";
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-center font-medium text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {cust.id}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden mx-auto flex items-center justify-center text-slate-400 shrink-0">
                          {cust.photoUrl ? (
                            <Image
                              src={cust.photoUrl}
                              alt={cust.name}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FiUser className="h-4 w-4" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          {cust.name}
                        </div>
                        {cust.fatherName && (
                          <div className="text-[11px] text-slate-400">
                            S/O: {cust.fatherName}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">
                        {cust.address || "N/A"}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {cust.mobile}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold ${
                          isReceivable ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        ৳{cust.initialBalance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {cust.showroom}
                      </td>
                      <td className="py-3 px-4 text-center no-print">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            title="View"
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <button
                            title="Edit"
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => handleDelete(cust.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}