export type CustomerBalanceType = "Receivable" | "Payable";

export type GuarantorInfo = {
  isPreviousClient: boolean;
  name: string;
  mobile: string;
  address: string;
};

export type Customer = {
  id: string;
  showroom: string;
  name: string;
  fatherName: string;
  mobile: string;
  address: string;
  idCardNo?: string;
  guarantor1?: GuarantorInfo;
  guarantor2?: GuarantorInfo;
  initialBalance: number;
  balanceType: CustomerBalanceType;
  photoUrl?: string;
  createdAt: string;
};

export type CustomerPaymentType = "Receive" | "Pay";

export type CustomerPaymentMethod =
  | "Cash"
  | "Bank"
  | "Mobile Banking"
  | "Cheque";

export type CustomerPayment = {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentType: CustomerPaymentType;
  paymentMethod: CustomerPaymentMethod;
  reference: string;
  note: string;
  date: string;
  createdAt: string;
};