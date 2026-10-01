import type { Customer } from "../types/customer";

export const initialCustomers: Customer[] = [
  {
    id: "CUST-001",
    showroom: "Main Branch",
    name: "Rahim Uddin",
    mobile: "01711223344",
    email: "rahim@gmail.com",
    address: "Mirpur 10, Dhaka",
    initialBalance: 2500,
    balanceType: "Receivable",
    createdAt: "2026-01-15T10:30:00.000Z",
  },
  {
    id: "CUST-002",
    showroom: "Main Branch",
    name: "Karim Chowdhury",
    mobile: "01822334455",
    email: "karim.c@yahoo.com",
    address: "Uttara Sector 7, Dhaka",
    initialBalance: 0,
    balanceType: "Receivable",
    createdAt: "2026-02-01T11:20:00.000Z",
  },
  {
    id: "CUST-003",
    showroom: "Chittagong Branch",
    name: "Tanvir Hossain",
    mobile: "01933445566",
    email: "",
    address: "GEC Circle, Chittagong",
    initialBalance: 1200,
    balanceType: "Payable",
    createdAt: "2026-02-10T14:15:00.000Z",
  },
];

const CUSTOMER_STORAGE_KEY = "phone-store-customers";

export const getCustomersFromStorage = (): Customer[] => {
  if (typeof window === "undefined") return initialCustomers;
  
  const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(initialCustomers));
    return initialCustomers;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return initialCustomers;
  }
};

export const saveCustomerToStorage = (customer: Customer): Customer[] => {
  const current = getCustomersFromStorage();
  const updated = [customer, ...current];
  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("phone-store-customers-updated"));
  return updated;
};