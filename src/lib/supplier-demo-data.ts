import type { Supplier } from "../types/supplier";

export const DEMO_SUPPLIERS: Supplier[] = [
  {
    id: "demo-supplier-001",
    showroom: "Phone Store ( 53, New Market )",
    name: "Rahim Telecom",
    contactPerson: "Rahim Uddin",
    mobile: "01711123456",
    address: "New Market, Dhaka",
    initialBalance: 250000,
    balanceType: "Payable",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-supplier-002",
    showroom: "Phone Store ( 53, New Market )",
    name: "Karim Mobile Center",
    contactPerson: "Karim Hasan",
    mobile: "01822234567",
    address: "Bashundhara City, Dhaka",
    initialBalance: 150000,
    balanceType: "Payable",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-supplier-003",
    showroom: "Phone Store ( 53, New Market )",
    name: "Smart Phone Distribution",
    contactPerson: "Sakib Ahmed",
    mobile: "01933345678",
    address: "Elephant Road, Dhaka",
    initialBalance: 85000,
    balanceType: "Receivable",
    createdAt: new Date().toISOString(),
  },
];