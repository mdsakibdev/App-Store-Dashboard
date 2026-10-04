export type SalePaymentMethod = "Cash" | "bKash" | "Bank" | "Cheque";

export type SaleItem = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  qty: number;
  unitPrice: number;
  total: number;
};

export type Sale = {
  id: string;
  date: string;
  showroom: string;
  invoiceNo: string;
  saleType: "Retail" | "Due";
  customerId: string;
  customerName: string;
  customerMobile: string;
  items: SaleItem[];
  subTotal: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: SalePaymentMethod;
  createdAt: string;
};
