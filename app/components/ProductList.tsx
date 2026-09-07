"use client";

import React from "react";
import type { Product } from "@/types";

interface ProductListProps {
  products: Product[];
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

function formatCurrency(value: unknown): string {
  if (typeof value !== "number") {
    return "—";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusConfig(status: Product["status"]) {
  switch (status) {
    case "con_hang":
      return {
        label: "Còn hàng",
        className:
          "border-emerald-200/70 bg-emerald-50 text-emerald-700",
        dotClassName: "bg-emerald-500",
      };

    case "het_hang":
      return {
        label: "Hết hàng",
        className: "border-rose-200/70 bg-rose-50 text-rose-700",
        dotClassName: "bg-rose-500",
      };

    case "ngung_ban":
      return {
        label: "Ngừng bán",
        className: "border-amber-200/70 bg-amber-50 text-amber-700",
        dotClassName: "bg-amber-500",
      };

    default:
      return {
        label: "Không xác định",
        className: "border-slate-200 bg-slate-100 text-slate-600",
        dotClassName: "bg-slate-400",
      };
  }
}

/**
 * Tạo màu avatar ổn định từ tên sản phẩm.
 * Không dùng dữ liệu mock / không cần ảnh thật.
 */
function getAvatarGradient(name: string): string {
  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-indigo-500 to-violet-600",
    "from-fuchsia-500 to-pink-500",
    "from-cyan-500 to-blue-600",
    "from-violet-500 to-purple-600",
    "from-sky-500 to-indigo-500",
  ];

  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return gradients[Math.abs(hash) % gradients.length];
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "P";
}

function ProductAvatar({ name }: { name: string }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getAvatarGradient(
        name,
      )} text-sm font-extrabold text-white shadow-md shadow-slate-200`}
    >
      {getInitial(name)}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m16.862 4.487 1.651-1.65a2.121 2.121 0 0 1 3 3l-1.65 1.65M16.862 4.487 5.5 15.85 4 20l4.15-1.5L19.513 7.138M16.862 4.487l2.651 2.651"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"
      />
    </svg>
  );
}

export default function ProductList({
  products,
  onView,
  onEdit,
  onDelete,
}: ProductListProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-xs">
        {/* ================= TABLE HEADER ================= */}
        <thead className="border-b border-slate-200/80 bg-slate-50/80">
          <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <th className="px-6 py-4">Sản phẩm</th>
            <th className="px-6 py-4">SKU / ID</th>
            <th className="px-6 py-4">Danh mục</th>
            <th className="px-6 py-4">Trạng thái</th>
            <th className="px-6 py-4">Giá bán</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>

        {/* ================= TABLE BODY ================= */}
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => {
            const status = getStatusConfig(product.status);

            const category =
              typeof product.category === "string"
                ? product.category
                : "Chưa phân loại";

            const price =
              typeof product.price === "number" ? product.price : null;

            return (
              <tr
                key={String(product.id)}
                className="group transition-colors duration-200 hover:bg-blue-50/40"
              >
                {/* PRODUCT */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ProductAvatar name={product.name} />

                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">
                        {product.name}
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                        Sản phẩm
                      </p>
                    </div>
                  </div>
                </td>

                {/* ID */}
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-semibold text-slate-600 transition-colors group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600">
                    #{String(product.id)}
                  </span>
                </td>

                {/* CATEGORY */}
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-600">
                    {category}
                  </span>
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`}
                    />

                    {status.label}
                  </span>
                </td>

                {/* PRICE */}
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900">
                    {price !== null ? formatCurrency(price) : "—"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* VIEW */}
                    <button
                      type="button"
                      title="Xem chi tiết"
                      onClick={() => onView?.(product)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 active:scale-95"
                    >
                      <EyeIcon />
                    </button>

                    {/* EDIT */}
                    <button
                      type="button"
                      title="Chỉnh sửa"
                      onClick={() => onEdit?.(product)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-amber-50 hover:text-amber-600 active:scale-95"
                    >
                      <EditIcon />
                    </button>

                    {/* DELETE */}
                    <button
                      type="button"
                      title="Xóa sản phẩm"
                      onClick={() => onDelete?.(product)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}