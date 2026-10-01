"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiSave,
  FiRotateCcw,
  FiUser,
  FiPhone,
  FiMapPin,
  FiHome,
  FiCreditCard,
  FiUpload,
  FiCheckCircle,
} from "react-icons/fi";
import type { Customer, CustomerBalanceType, GuarantorInfo } from "../../types/customer";
import { saveCustomerToStorage } from "../../lib/customer-demo-data";

export default function CustomerForm() {
  const router = useRouter();

  // Basic Info
  const [showroom, setShowroom] = useState("Phone Store ( 53,New Market )");
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [idCardNo, setIdCardNo] = useState("");

  // 1st Guarantor
  const [g1, setG1] = useState<GuarantorInfo>({
    isPreviousClient: false,
    name: "",
    mobile: "",
    address: "",
  });

  // 2nd Guarantor
  const [g2, setG2] = useState<GuarantorInfo>({
    isPreviousClient: false,
    name: "",
    mobile: "",
    address: "",
  });

  // Balance & Photo
  const [initialBalance, setInitialBalance] = useState<number | "">("");
  const [balanceType, setBalanceType] = useState<CustomerBalanceType>("Receivable");
  const [photo, setPhoto] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("Photo size should be maximum 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setShowroom("Phone Store ( 53,New Market )");
    setName("");
    setFatherName("");
    setMobile("");
    setAddress("");
    setIdCardNo("");
    setG1({ isPreviousClient: false, name: "", mobile: "", address: "" });
    setG2({ isPreviousClient: false, name: "", mobile: "", address: "" });
    setInitialBalance("");
    setBalanceType("Receivable");
    setPhoto(null);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Customer Name is required");
      return;
    }
    if (!fatherName.trim()) {
      setErrorMsg("Father's Name is required");
      return;
    }
    if (!mobile.trim()) {
      setErrorMsg("Mobile number is required");
      return;
    }

    setLoading(true);

    const newCustomer: Customer = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      showroom,
      name: name.trim(),
      fatherName: fatherName.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      idCardNo: idCardNo.trim() || undefined,
      guarantor1: g1,
      guarantor2: g2,
      initialBalance: Number(initialBalance) || 0,
      balanceType,
      photoUrl: photo || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      saveCustomerToStorage(newCustomer);
      setSuccessMsg("Customer added successfully!");

      setTimeout(() => {
        router.push("/customers/all");
      }, 1000);
    } catch {
      setErrorMsg("Failed to save customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Main Customer Details */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <h3 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">
          Customer Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Showroom */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiHome className="text-slate-400" /> Showroom <span className="text-rose-500">*</span>
            </label>
            <select
              value={showroom}
              onChange={(e) => setShowroom(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            >
              <option value="Phone Store ( 53,New Market )">Phone Store ( 53,New Market )</option>
              <option value="Main Branch">Main Branch</option>
              <option value="Uttara Branch">Uttara Branch</option>
            </select>
          </div>

          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiUser className="text-slate-400" /> Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Tanvir Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {/* Father's Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiUser className="text-slate-400" /> Father&apos;s Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Father's full name"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              required
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiPhone className="text-slate-400" /> Mobile <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="017xxxxxxxx"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiMapPin className="text-slate-400" /> Address
            </label>
            <textarea
              rows={2}
              placeholder="House/Street, Village/Area, City"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          {/* ID Card No */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <FiCreditCard className="text-slate-400" /> ID Card No (NID/Smart Card)
            </label>
            <input
              type="text"
              placeholder="NID or Smart Card Number"
              value={idCardNo}
              onChange={(e) => setIdCardNo(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>
        </div>
      </div>

      {/* 1st Guarantor */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="text-base font-semibold text-slate-800">1st Guarantor</h3>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
            <span>Previous Client?</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="g1_prev"
                checked={g1.isPreviousClient === true}
                onChange={() => setG1({ ...g1, isPreviousClient: true })}
                className="radio radio-xs radio-primary"
              />
              Yes
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="g1_prev"
                checked={g1.isPreviousClient === false}
                onChange={() => setG1({ ...g1, isPreviousClient: false })}
                className="radio radio-xs radio-primary"
              />
              No
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Name</label>
            <input
              type="text"
              placeholder="1st Guarantor Name"
              value={g1.name}
              onChange={(e) => setG1({ ...g1, name: e.target.value })}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Mobile</label>
            <input
              type="text"
              placeholder="1st Guarantor Mobile"
              value={g1.mobile}
              onChange={(e) => setG1({ ...g1, mobile: e.target.value })}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Address</label>
            <input
              type="text"
              placeholder="1st Guarantor Address"
              value={g1.address}
              onChange={(e) => setG1({ ...g1, address: e.target.value })}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>
        </div>
      </div>

      {/* 2nd Guarantor */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="text-base font-semibold text-slate-800">2nd Guarantor</h3>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
            <span>Previous Client?</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="g2_prev"
                checked={g2.isPreviousClient === true}
                onChange={() => setG2({ ...g2, isPreviousClient: true })}
                className="radio radio-xs radio-primary"
              />
              Yes
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="g2_prev"
                checked={g2.isPreviousClient === false}
                onChange={() => setG2({ ...g2, isPreviousClient: false })}
                className="radio radio-xs radio-primary"
              />
              No
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Name</label>
            <input
              type="text"
              placeholder="2nd Guarantor Name"
              value={g2.name}
              onChange={(e) => setG2({ ...g2, name: e.target.value })}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Mobile</label>
            <input
              type="text"
              placeholder="2nd Guarantor Mobile"
              value={g2.mobile}
              onChange={(e) => setG2({ ...g2, mobile: e.target.value })}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Address</label>
            <input
              type="text"
              placeholder="2nd Guarantor Address"
              value={g2.address}
              onChange={(e) => setG2({ ...g2, address: e.target.value })}
              className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
            />
          </div>
        </div>
      </div>

      {/* Balance & Photo */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <h3 className="text-base font-semibold text-slate-800 border-b border-slate-100 pb-3">
          Account & Photo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Initial Balance + Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Initial Balance (TK)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition"
              />
              <select
                value={balanceType}
                onChange={(e) => setBalanceType(e.target.value as CustomerBalanceType)}
                className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-primary focus:outline-hidden transition shrink-0"
              >
                <option value="Receivable">Receivable</option>
                <option value="Payable">Payable</option>
              </select>
            </div>
          </div>

          {/* Photo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Photo</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs font-medium hover:bg-slate-100 cursor-pointer flex items-center justify-between transition">
                <span className="truncate">{photo ? "Photo Selected" : "Browse..."}</span>
                <FiUpload className="h-4 w-4 text-slate-400 shrink-0" />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {photo && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <FiCheckCircle className="h-4 w-4" /> Selected
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="h-11 px-5 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 text-sm font-medium transition flex items-center gap-2 cursor-pointer"
        >
          <FiRotateCcw className="h-4 w-4" /> Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className="h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary/90 text-sm font-medium shadow-md shadow-primary/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <FiSave className="h-4 w-4" /> {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}