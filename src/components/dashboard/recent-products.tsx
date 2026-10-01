import Link from "next/link";
import { FiArrowUpRight, FiMoreHorizontal } from "react-icons/fi";

const products = [
  {
    name: "iPhone 15 Pro Max",
    sku: "IP15PM-256",
    category: "Smartphone",
    stock: 18,
    price: "$1,199",
    status: "In Stock",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    sku: "SGS24U-256",
    category: "Smartphone",
    stock: 12,
    price: "$1,099",
    status: "In Stock",
  },
  {
    name: "Google Pixel 9 Pro",
    sku: "GP9P-128",
    category: "Smartphone",
    stock: 5,
    price: "$899",
    status: "Low Stock",
  },
  {
    name: "AirPods Pro 2",
    sku: "APP2-USB",
    category: "Accessories",
    stock: 31,
    price: "$249",
    status: "In Stock",
  },
];

export default function RecentProducts() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recent Products
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Recently added products
          </p>
        </div>

        <Link
          href="/products"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View all
          <FiArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.sku}
                className="border-b border-slate-50 last:border-0"
              >
                <td>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {product.name}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {product.sku}
                    </p>
                  </div>
                </td>

                <td className="text-xs text-slate-500">
                  {product.category}
                </td>

                <td>
                  <span
                    className={`text-xs font-semibold ${
                      product.stock <= 5
                        ? "text-rose-600"
                        : "text-slate-700"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>

                <td className="text-xs font-semibold text-slate-800">
                  {product.price}
                </td>

                <td>
                  <span
                    className={`badge badge-sm border-0 text-[10px] ${
                      product.status === "Low Stock"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                <td>
                  <button className="btn btn-ghost btn-square btn-xs">
                    <FiMoreHorizontal className="h-4 w-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}