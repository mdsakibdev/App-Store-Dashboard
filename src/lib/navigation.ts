import type { IconType } from "react-icons";

import {
  FiBarChart2,
  FiBox,
  FiBriefcase,
  FiChevronDown,
  FiClipboard,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiGrid,
  FiLayers,
  FiPackage,
  FiPieChart,
  FiRefreshCcw,
  FiSettings,
  FiShoppingCart,
  FiTag,
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
    icon: FiBox,
    children: [
      {
        title: "All Products",
        href: "/products",
      },
      {
        title: "Categories",
        href: "/categories",
      },
      {
        title: "Brands",
        href: "/brands",
      },
    ],
  },

  // Supplier Module
  {
    title: "Suppliers",
    icon: FiTruck,
    children: [
      {
        title: "01. Add Supplier",
        href: "/suppliers/add",
      },
      {
        title: "02. All Supplier",
        href: "/suppliers/all",
      },
      {
        title: "03. Supplier Payment",
        href: "/suppliers/payments",
      },
      {
        title: "04. All Payment",
        href: "/suppliers/all-payments",
      },
    ],
  },

  {
    title: "Purchases",
    icon: FiShoppingCart,
    children: [
      {
        title: "All Purchases",
        href: "/purchases",
      },
      {
        title: "Purchase Return",
        href: "/purchase-returns",
      },
    ],
  },

  {
    title: "Sales",
    icon: FiDollarSign,
    children: [
      {
        title: "All Sales",
        href: "/sales",
      },
      {
        title: "Sales Return",
        href: "/sales-returns",
      },
    ],
  },

  {
    title: "People",
    icon: FiUsers,
    children: [
      {
        title: "Customers",
        href: "/customers",
      },
    ],
  },

  {
    title: "Inventory",
    icon: FiLayers,
    children: [
      {
        title: "Stock",
        href: "/stock",
      },
      {
        title: "Warranty",
        href: "/warranty",
      },
    ],
  },

  {
    title: "Accounts",
    icon: FiCreditCard,
    children: [
      {
        title: "Cash Book",
        href: "/cash-book",
      },
      {
        title: "Expenses",
        href: "/expenses",
      },
      {
        title: "Cost Categories",
        href: "/cost-categories",
      },
    ],
  },

  {
    title: "Reports",
    icon: FiPieChart,
    children: [
      {
        title: "Sales Report",
        href: "/reports/sales",
      },
      {
        title: "Purchase Report",
        href: "/reports/purchases",
      },
      {
        title: "Stock Report",
        href: "/reports/stock",
      },
    ],
  },

  {
    title: "Settings",
    href: "/settings",
    icon: FiSettings,
  },
];