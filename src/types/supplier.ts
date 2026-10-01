export type SupplierBalanceType = "Payable" | "Receivable";

export type Supplier = {
  id: string;
  showroom: string;
  name: string;
  contactPerson: string;
  mobile: string;
  address: string;
  initialBalance: number;
  balanceType: SupplierBalanceType;
  createdAt: string;
};

export type SupplierPaymentType = "Payment" | "Receive";

export type SupplierPaymentMethod =
  | "Cash"
  | "Bank"
  | "Mobile Banking"
  | "Cheque";

export type SupplierPayment = {
  id: string;
  supplierId: string;
  supplierName: string;
  showroom: string;
  amount: number;
  paymentType: SupplierPaymentType;
  paymentMethod: SupplierPaymentMethod;
  reference: string;
  note: string;
  date: string;
  createdAt: string;
};