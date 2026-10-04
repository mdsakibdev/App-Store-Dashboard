import type { IconType } from "react-icons";
import {
  FiBarChart2,
  FiBox,
  FiCreditCard,
  FiDollarSign,
  FiGrid,
  FiPackage,
  FiSettings,
  FiShoppingCart,
  FiTruck,
  FiUsers,
} from "react-icons/fi";

export type NavigationItem = {
  title: string;
  href?: string;
  icon: IconType;
  children?: {
    title: string;
    href: string;
  }[];
};

export const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: FiGrid,
  },
  {
    title: "Products",
    icon: FiPackage,
    children: [
      { title: "All Products", href: "/products" },
      { title: "Categories", href: "/categories" },
      { title: "Brands", href: "/brands" },
    ],
  },
  {
    title: "Suppliers",
    icon: FiTruck,
    children: [
      { title: "01. Add Supplier", href: "/suppliers/add" },
      { title: "02. All Supplier", href: "/suppliers/all" },
      { title: "03. Supplier Payment", href: "/suppliers/payments" },
      { title: "04. All Payment", href: "/suppliers/all-payments" },
    ],
  },
  {
    title: "Customers",
    icon: FiUsers,
    children: [
      { title: "01. Add New", href: "/customers/add" },
      { title: "02. View All", href: "/customers/all" },
      { title: "03. Customer Collection", href: "/customers/payments" },
      { title: "04. All Customer Collection", href: "/customers/all-payments" },
    ],
  },
  {
    title: "Purchases",
    icon: FiShoppingCart,
    children: [
      { title: "01. Add Purchase", href: "/purchase/add" },
      { title: "02. All Purchase", href: "/purchase/all" },           // Updated to /purchase/all
      { title: "03. Item Wise", href: "/purchase/item-wise" },
      { title: "04. Add Purchase Return", href: "/purchase/return/add" },
      { title: "05. All Purchase Return", href: "/purchase/return/all" }, // Updated to /purchase/return/all
    ],
  },
  {
    title: "Sales",
    icon: FiDollarSign,
    children: [
      { title: "01. Retail Sale", href: "/sales/retail" },
      { title: "02. Due Sale", href: "/sales/due" },
      { title: "03. All Sale", href: "/sales" },
      { title: "04. Quotation", href: "/sales/quotation" },
      { title: "05. All Quotation", href: "/sales/quotations" },
      { title: "06. Search Item Wise", href: "/sales/item-wise" },
      { title: "07. Search Client Wise", href: "/sales/client-wise" },
      { title: "08. Sale Return", href: "/sales/returns" },
      { title: "09. All Sale Return", href: "/sales/returns/all" },
    ],
  },
  {
    title: "Cost",
    icon: FiCreditCard,
    children: [
      { title: "01. Cost Category", href: "/cost/categories" },
      { title: "02. Field of Cost", href: "/cost/fields" },
      { title: "03. New Cost", href: "/cost/new" },
      { title: "04. All Cost", href: "/cost" },
    ],
  },
  {
    title: "Inventory",
    icon: FiBox,
    children: [
      { title: "Stock", href: "/inventory/stock" },
      { title: "Warranty", href: "/inventory/warranty" },
    ],
  },
  {
    title: "Accounts",
    icon: FiCreditCard,
    children: [
      { title: "Cash Book", href: "/accounts/cash-book" },
      { title: "Expenses", href: "/accounts/expenses" },
      { title: "Cost Categories", href: "/accounts/cost-categories" },
    ],
  },
  {
    title: "Reports",
    icon: FiBarChart2,
    children: [
      { title: "Sales Report", href: "/reports/sales" },
      { title: "Purchase Report", href: "/reports/purchases" },
      { title: "Stock Report", href: "/reports/stock" },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: FiSettings,
  },
];

export const navigationItems = navigation;
export default navigation;


