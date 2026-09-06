"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser, getProducts } from "@/lib/api";
import { getToken, logout } from "@/lib/auth";
import type { Product, ProductStatus, User } from "@/types";

const ITEMS_PER_PAGE = 10;

type StatusFilter = "all" | ProductStatus;

const STATUS_OPTIONS: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "con_hang", label: "Còn hàng" },
  { value: "het_hang", label: "Hết hàng" },
  { value: "ngung_ban", label: "Ngừng bán" },
];

/* =========================================================
   ICONS
========================================================= */

function PackageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="m21 8-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3 4.7-5" />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function PauseCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9v6" />
      <path d="M14 9v6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
      <path d="M13 21h6a2 2 0 0 0 2-2" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3.5 w-3.5"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3.5 w-3.5"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ProductsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [authChecking, setAuthChecking] = useState(true);

  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");

  const [status, setStatus] =
    useState<StatusFilter>("all");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const [page, setPage] = useState(1);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [loggingOut, setLoggingOut] = useState(false);

  const abortControllerRef =
    useRef<AbortController | null>(null);

  /* =========================================================
     AUTH CHECK
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function verifySession() {
      const token = getToken();

      if (!token) {
        router.replace("/login?redirect=/products");
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (!mounted) return;

        setUser(currentUser);
        setAuthError("");
      } catch (err: unknown) {
        if (!mounted) return;

        const message =
          err instanceof Error
            ? err.message
            : "Không thể xác thực phiên đăng nhập.";

        setAuthError(message);
      } finally {
        if (mounted) {
          setAuthChecking(false);
        }
      }
    }

    verifySession();

    return () => {
      mounted = false;
    };
  }, [router]);

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  useEffect(() => {
    if (authChecking || authError) return;

    let mounted = true;

    async function loadProducts() {
      abortControllerRef.current?.abort();

      const controller = new AbortController();

      abortControllerRef.current = controller;

      setLoading(true);
      setError("");

      try {
        const data = await getProducts(
          status === "all" ? undefined : status,
          controller.signal
        );

        if (!mounted) return;

        setProducts(data);
        setPage(1);
        setSelectedIds([]);
      } catch (err: unknown) {
        if (!mounted) return;

        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Không thể tải danh sách sản phẩm.";

        setError(message);
        setProducts([]);
        setSelectedIds([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [status, authChecking, authError]);

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const categories = useMemo(() => {
    const values = products
      .map((product) =>
        typeof product.category === "string"
          ? product.category
          : ""
      )
      .filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const productName =
        typeof product.name === "string"
          ? product.name.toLowerCase()
          : "";

      const productId =
        String(product.id).toLowerCase();

      const productCategory =
        typeof product.category === "string"
          ? product.category
          : "";

      const matchesSearch =
        !keyword ||
        productName.includes(keyword) ||
        productId.includes(keyword) ||
        productCategory
          .toLowerCase()
          .includes(keyword);

      const matchesCategory =
        category === "all" ||
        productCategory === category;

      const price =
        typeof product.price === "number"
          ? product.price
          : 0;

      let matchesPrice = true;

      if (priceRange === "under10") {
        matchesPrice = price < 10_000_000;
      }

      if (priceRange === "10to20") {
        matchesPrice =
          price >= 10_000_000 &&
          price <= 20_000_000;
      }

      if (priceRange === "over20") {
        matchesPrice = price > 20_000_000;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice
      );
    });
  }, [
    products,
    search,
    category,
    priceRange,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedProducts = useMemo(() => {
    const start =
      (page - 1) * ITEMS_PER_PAGE;

    return filteredProducts.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredProducts, page]);

  const currentPageIds =
    paginatedProducts.map((product) =>
      String(product.id)
    );

  const allCurrentPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) =>
      selectedIds.includes(id)
    );

  const someCurrentPageSelected =
    currentPageIds.some((id) =>
      selectedIds.includes(id)
    );

  const pageStart =
    filteredProducts.length === 0
      ? 0
      : (page - 1) * ITEMS_PER_PAGE + 1;

  const pageEnd = Math.min(
    page * ITEMS_PER_PAGE,
    filteredProducts.length
  );

  /* =========================================================
     METRICS
  ========================================================= */

  const totalProducts = products.length;

  const activeProducts =
    products.filter(
      (product) =>
        product.status === "con_hang"
    ).length;

  const outOfStockProducts =
    products.filter(
      (product) =>
        product.status === "het_hang"
    ).length;

  const stoppedProducts =
    products.filter(
      (product) =>
        product.status === "ngung_ban"
    ).length;

  /* =========================================================
     HANDLERS
  ========================================================= */

  function handleStatusChange(
    nextStatus: StatusFilter
  ) {
    setStatus(nextStatus);
    setPage(1);
    setSelectedIds([]);
  }

  function handleSearchChange(
    value: string
  ) {
    setSearch(value);
    setPage(1);
    setSelectedIds([]);
  }

  function handleCategoryChange(
    value: string
  ) {
    setCategory(value);
    setPage(1);
    setSelectedIds([]);
  }

  function handlePriceChange(
    value: string
  ) {
    setPriceRange(value);
    setPage(1);
    setSelectedIds([]);
  }

  function handleSelectAllPage() {
    if (allCurrentPageSelected) {
      setSelectedIds((current) =>
        current.filter(
          (id) =>
            !currentPageIds.includes(id)
        )
      );

      return;
    }

    setSelectedIds((current) =>
      Array.from(
        new Set([
          ...current,
          ...currentPageIds,
        ])
      )
    );
  }

  function handleSelectProduct(
    productId: string
  ) {
    setSelectedIds((current) => {
      if (current.includes(productId)) {
        return current.filter(
          (id) => id !== productId
        );
      }

      return [...current, productId];
    });
  }

  function handlePreviousPage() {
    setPage((current) =>
      Math.max(1, current - 1)
    );
    setSelectedIds([]);
  }

  function handleNextPage() {
    setPage((current) =>
      Math.min(
        totalPages,
        current + 1
      )
    );
    setSelectedIds([]);
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
    } finally {
      router.replace("/login");
    }
  }

  function handleView(product: Product) {
    setSelectedProduct(product);
  }

  function handleEdit(product: Product) {
    setSelectedProduct(product);
  }

  /* =========================================================
     AUTH LOADING
  ========================================================= */

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950">
        <div className="flex flex-col items-center">

          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/30" />
          </div>

          <p className="mt-5 text-sm font-bold text-white">
            Đang xác thực phiên đăng nhập...
          </p>

          <p className="mt-1 text-xs font-medium text-blue-200/60">
            Vui lòng chờ trong giây lát
          </p>

        </div>
      </div>
    );
  }

  /* =========================================================
     AUTH ERROR
  ========================================================= */

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 px-6">

        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white p-8 text-center shadow-2xl shadow-blue-950/40">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/50">
            <AlertCircleIcon />
          </div>

          <h1 className="mt-6 text-lg font-black text-slate-900">
            Không thể xác thực phiên
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {authError}
          </p>

          <button
            type="button"
            onClick={() =>
              router.replace(
                "/login?redirect=/products"
              )
            }
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-cyan-600"
          >
            Đăng nhập lại
          </button>

        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_28%),radial-gradient(circle_at_85%_15%,_rgba(6,182,212,0.10),_transparent_25%),linear-gradient(135deg,#f1f5f9_0%,#eff6ff_48%,#ecfeff_100%)] font-sans text-slate-800">

      {/* =====================================================
         HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 border-b border-blue-200/60 bg-slate-950/95 shadow-lg shadow-blue-950/10 backdrop-blur-xl">

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* BRAND */}

          <div className="flex items-center gap-3">

            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-400 text-sm font-black text-white shadow-lg shadow-cyan-500/20">

              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/20 blur-sm" />

              <span className="relative">
                S
              </span>

            </div>

            <div>
              <p className="text-sm font-black tracking-tight text-white">
                Shop Admin
              </p>

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                Management
              </p>
            </div>

          </div>

          {/* NAV */}

          <nav className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 md:flex">

            <button
              type="button"
              className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20"
            >
              Sản phẩm
            </button>

            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg px-4 py-2 text-xs font-semibold text-slate-500"
            >
              Đơn hàng
            </button>

            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg px-4 py-2 text-xs font-semibold text-slate-500"
            >
              Khách hàng
            </button>

            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg px-4 py-2 text-xs font-semibold text-slate-500"
            >
              Thống kê
            </button>

          </nav>

          {/* USER */}

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="max-w-[220px] truncate text-xs font-bold text-white">
                {user?.email ?? "Administrator"}
              </p>

              <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                Administrator
              </p>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              title="Đăng xuất"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 shadow-sm transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOutIcon />
            </button>

          </div>

        </div>
      </header>

      {/* =====================================================
         MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* PAGE HEADER */}

        <section>

          <div className="flex flex-col gap-3">

            <div className="flex items-center gap-2">

              <span className="rounded-lg border border-blue-200 bg-blue-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm shadow-blue-500/20">
                Inventory
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />

              <span className="text-[10px] font-bold text-slate-500">
                Product Management
              </span>

            </div>

            <div>

              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">

                Quản lý{" "}

                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  sản phẩm
                </span>

              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Theo dõi sản phẩm, giá bán và trạng thái
                tồn kho trong hệ thống.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
           METRICS
        ================================================= */}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white via-white to-blue-50 p-5 shadow-md shadow-blue-100/50 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-200/50">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-xs font-bold text-slate-500">
                  Tổng sản phẩm
                </p>

                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {totalProducts}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
                <PackageIcon />
              </div>

            </div>

            <div className="relative mt-4 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500" />

              <span className="text-[11px] font-semibold text-blue-700">
                Tổng sản phẩm
              </span>

            </div>

          </div>

          {/* ACTIVE */}

          <div className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-white via-white to-emerald-50 p-5 shadow-md shadow-emerald-100/50 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-200/50">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-xs font-bold text-slate-500">
                  Còn hàng
                </p>

                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {activeProducts}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-105">
                <CheckCircleIcon />
              </div>

            </div>

            <div className="relative mt-4 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[11px] font-semibold text-emerald-700">
                Đang kinh doanh
              </span>

            </div>

          </div>

          {/* OUT OF STOCK */}

          <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-white via-white to-amber-50 p-5 shadow-md shadow-amber-100/50 transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-200/50">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-xs font-bold text-slate-500">
                  Hết hàng
                </p>

                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {outOfStockProducts}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25 transition-transform group-hover:scale-105">
                <AlertCircleIcon />
              </div>

            </div>

            <div className="relative mt-4 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

              <span className="text-[11px] font-semibold text-amber-700">
                Cần kiểm tra tồn kho
              </span>

            </div>

          </div>

          {/* STOPPED */}

          <div className="group relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-white via-white to-violet-50 p-5 shadow-md shadow-violet-100/50 transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-200/50">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />

            <div className="relative flex items-start justify-between">

              <div>
                <p className="text-xs font-bold text-slate-500">
                  Ngừng bán
                </p>

                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {stoppedProducts}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 transition-transform group-hover:scale-105">
                <PauseCircleIcon />
              </div>

            </div>

            <div className="relative mt-4 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />

              <span className="text-[11px] font-semibold text-violet-700">
                Không kinh doanh
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
           TABLE CARD
        ================================================= */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-xl shadow-blue-100/50">

          {/* FILTER BAR */}

          <div className="border-b border-blue-200 bg-gradient-to-r from-blue-100/80 via-white to-cyan-100/70 p-4">

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

              {/* SEARCH */}

              <div className="relative w-full xl:max-w-md">

                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                  <SearchIcon />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    handleSearchChange(
                      event.target.value
                    )
                  }
                  placeholder="Tìm theo tên, mã sản phẩm..."
                  className="h-10 w-full rounded-xl border border-blue-200 bg-white pl-9 pr-9 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      handleSearchChange("")
                    }
                    className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-blue-100 hover:text-blue-600"
                    aria-label="Xóa tìm kiếm"
                  >
                    <XIcon />
                  </button>
                )}

              </div>

              {/* FILTERS */}

              <div className="flex flex-col gap-2 sm:flex-row">

                {/* STATUS */}

                <div className="relative">

                  <select
                    value={status}
                    onChange={(event) =>
                      handleStatusChange(
                        event.target.value as StatusFilter
                      )
                    }
                    className="h-10 min-w-[175px] appearance-none rounded-xl border border-blue-200 bg-white px-3 pr-9 text-xs font-bold text-slate-700 outline-none transition hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >

                    {STATUS_OPTIONS.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      )
                    )}

                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <ChevronDownIcon />
                  </div>

                </div>

                {/* CATEGORY */}

                <div className="relative">

                  <select
                    value={category}
                    onChange={(event) =>
                      handleCategoryChange(
                        event.target.value
                      )
                    }
                    className="h-10 min-w-[160px] appearance-none rounded-xl border border-blue-200 bg-white px-3 pr-9 text-xs font-bold text-slate-700 outline-none transition hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >

                    <option value="all">
                      Tất cả danh mục
                    </option>

                    {categories.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <ChevronDownIcon />
                  </div>

                </div>

                {/* PRICE */}

                <div className="relative">

                  <select
                    value={priceRange}
                    onChange={(event) =>
                      handlePriceChange(
                        event.target.value
                      )
                    }
                    className="h-10 min-w-[155px] appearance-none rounded-xl border border-blue-200 bg-white px-3 pr-9 text-xs font-bold text-slate-700 outline-none transition hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >

                    <option value="all">
                      Tất cả mức giá
                    </option>

                    <option value="under10">
                      Dưới 10 triệu
                    </option>

                    <option value="10to20">
                      10 - 20 triệu
                    </option>

                    <option value="over20">
                      Trên 20 triệu
                    </option>

                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <ChevronDownIcon />
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* =================================================
             TABLE
          ================================================= */}

          <div className="overflow-x-auto">

            {loading ? (
              <div className="bg-gradient-to-b from-blue-50/40 to-white p-6">

                <div className="space-y-4">

                  {Array.from({
                    length: 7,
                  }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="flex animate-pulse items-center gap-4"
                      >

                        <div className="h-4 w-4 rounded bg-blue-200" />

                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100" />

                        <div className="flex-1 space-y-2">

                          <div className="h-3 w-40 rounded bg-slate-200" />

                          <div className="h-2.5 w-24 rounded bg-blue-100" />

                        </div>

                        <div className="hidden h-3 w-24 rounded bg-blue-100 md:block" />

                        <div className="hidden h-7 w-20 rounded-full bg-emerald-100 sm:block" />

                        <div className="h-3 w-24 rounded bg-slate-200" />

                      </div>
                    )
                  )}

                </div>

              </div>
            ) : error ? (

              <div className="flex min-h-[360px] flex-col items-center justify-center bg-gradient-to-br from-rose-50/50 via-white to-blue-50/40 px-6 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/50">
                  <AlertCircleIcon />
                </div>

                <h2 className="mt-5 text-sm font-black text-slate-900">
                  Không thể tải sản phẩm
                </h2>

                <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-cyan-600"
                >
                  Thử lại
                </button>

              </div>

            ) : filteredProducts.length === 0 ? (

              <div className="flex min-h-[360px] flex-col items-center justify-center bg-gradient-to-br from-blue-50/40 via-white to-cyan-50/50 px-6 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 shadow-sm">
                  <PackageIcon />
                </div>

                <h2 className="mt-5 text-sm font-black text-slate-900">
                  Không tìm thấy sản phẩm
                </h2>

                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                  Không có sản phẩm phù hợp với bộ lọc hiện tại.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                    setPriceRange("all");
                    setSelectedIds([]);
                  }}
                  className="mt-5 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-bold text-blue-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                >
                  Xóa bộ lọc
                </button>

              </div>

            ) : (

              <>

                <table className="w-full min-w-[980px] text-left text-xs">

                  <thead className="border-b border-blue-200 bg-gradient-to-r from-slate-100 via-blue-50 to-cyan-50">

                    <tr className="text-[10px] font-black uppercase tracking-wider text-slate-800">

                      {/* SELECT ALL */}

                      <th className="w-[52px] px-5 py-4">

                        <input
                          type="checkbox"
                          checked={
                            allCurrentPageSelected
                          }
                          ref={(element) => {
                            if (element) {
                              element.indeterminate =
                                !allCurrentPageSelected &&
                                someCurrentPageSelected;
                            }
                          }}
                          onChange={
                            handleSelectAllPage
                          }
                          aria-label="Chọn tất cả sản phẩm trong trang"
                          className="h-4 w-4 cursor-pointer rounded border-blue-300 accent-blue-600"
                        />

                      </th>

                      <th className="px-5 py-4">
                        Sản phẩm
                      </th>

                      <th className="px-5 py-4">
                        Mã sản phẩm
                      </th>

                      <th className="px-5 py-4">
                        Danh mục
                      </th>

                      <th className="px-5 py-4">
                        Trạng thái
                      </th>

                      <th className="px-5 py-4">
                        Giá bán
                      </th>

                      <th className="px-5 py-4 text-right">
                        Thao tác
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-blue-100">

                    {paginatedProducts.map(
                      (product) => {

                        const productId =
                          String(product.id);

                        const price =
                          typeof product.price ===
                          "number"
                            ? product.price
                            : 0;

                        const productCategory =
                          typeof product.category ===
                          "string"
                            ? product.category
                            : "—";

                        const isSelected =
                          selectedIds.includes(
                            productId
                          );

                        return (

                          <tr
                            key={productId}
                            className={`group transition-all duration-150 ${
                              isSelected
                                ? "bg-blue-100/70"
                                : "hover:bg-cyan-50/60"
                            }`}
                          >

                            {/* CHECKBOX */}

                            <td className="px-5 py-4">

                              <input
                                type="checkbox"
                                checked={
                                  isSelected
                                }
                                onChange={() =>
                                  handleSelectProduct(
                                    productId
                                  )
                                }
                                aria-label={`Chọn ${product.name}`}
                                className="h-4 w-4 cursor-pointer rounded border-blue-300 accent-blue-600"
                              />

                            </td>

                            {/* PRODUCT */}

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 text-sm font-black text-blue-700 ring-1 ring-blue-200 shadow-sm">

                                  {String(
                                    product.name ?? "?"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <div className="min-w-0">

                                  <p className="max-w-[230px] truncate font-black text-slate-950">
                                    {product.name}
                                  </p>

                                  <p className="mt-0.5 text-[10px] font-bold text-blue-500">
                                    Product
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* ID */}

                            <td className="px-5 py-4">

                              <span className="inline-flex rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-2.5 py-1 font-mono text-[11px] font-black text-blue-800 shadow-sm">
                                #{productId}
                              </span>

                            </td>

                            {/* CATEGORY */}

                            <td className="px-5 py-4 font-bold text-slate-600">
                              {productCategory}
                            </td>

                            {/* STATUS */}

                            <td className="px-5 py-4">

                              {product.status ===
                                "con_hang" && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 shadow-sm">

                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />

                                  Còn hàng

                                </span>
                              )}

                              {product.status ===
                                "het_hang" && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 shadow-sm">

                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500" />

                                  Hết hàng

                                </span>
                              )}

                              {product.status ===
                                "ngung_ban" && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 px-2.5 py-1 text-[10px] font-bold text-violet-700 shadow-sm">

                                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-sm shadow-violet-500" />

                                  Ngừng bán

                                </span>
                              )}

                            </td>

                            {/* PRICE */}

                            <td className="px-5 py-4">

                              <span className="font-black text-slate-950">
                                {price.toLocaleString(
                                  "vi-VN"
                                )}{" "}
                                ₫
                              </span>

                            </td>

                            {/* ACTIONS */}

                            <td className="px-5 py-4">

                              <div className="flex justify-end gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleView(
                                      product
                                    )
                                  }
                                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 text-[11px] font-bold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
                                >
                                  <EyeIcon />
                                  Xem
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      product
                                    )
                                  }
                                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 text-[11px] font-bold text-cyan-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-100"
                                >
                                  <EditIcon />
                                  Sửa
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

                {/* =================================================
                   PAGINATION
                ================================================= */}

                <div className="flex flex-col gap-3 border-t border-blue-200 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-3">

                    <p className="text-[11px] font-semibold text-slate-500">

                      Hiển thị{" "}

                      <span className="font-black text-blue-700">
                        {pageStart}
                      </span>{" "}

                      -{" "}

                      <span className="font-black text-blue-700">
                        {pageEnd}
                      </span>{" "}

                      trên{" "}

                      <span className="font-black text-blue-700">
                        {filteredProducts.length}
                      </span>{" "}

                      sản phẩm

                    </p>

                    {selectedIds.length > 0 && (
                      <span className="hidden rounded-lg border border-blue-200 bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700 sm:inline-flex">
                        Đã chọn {selectedIds.length}
                      </span>
                    )}

                  </div>

                  <div className="flex items-center gap-1.5">

                    <button
                      type="button"
                      onClick={
                        handlePreviousPage
                      }
                      disabled={page <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Trang trước"
                    >
                      <ChevronLeftIcon />
                    </button>

                    <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-2.5 text-[11px] font-black text-white shadow-md shadow-blue-500/25">
                      {page}
                    </div>

                    <span className="px-1 text-[11px] font-bold text-slate-400">
                      / {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={
                        handleNextPage
                      }
                      disabled={
                        page >= totalPages
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Trang sau"
                    >
                      <ChevronRightIcon />
                    </button>

                  </div>

                </div>

              </>

            )}

          </div>

        </section>

        {/* =================================================
           FOOTER
        ================================================= */}

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-blue-200 pt-5 text-[10px] font-semibold text-slate-400 sm:flex-row">

          <p>
            Shop Admin Management System
          </p>

          <p className="text-blue-500">
            Product Inventory
          </p>

        </footer>

      </main>

      {/* =====================================================
         PRODUCT DETAIL MODAL
      ===================================================== */}

      {selectedProduct && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
          onClick={() =>
            setSelectedProduct(null)
          }
        >

          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-2xl shadow-blue-950/30"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="relative flex items-center justify-between overflow-hidden border-b border-blue-200 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 px-5 py-4">

              <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />

              <div className="relative">

                <p className="text-[9px] font-black uppercase tracking-wider text-cyan-300">
                  Product Details
                </p>

                <h2 className="mt-1 text-base font-black text-white">
                  Chi tiết sản phẩm
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedProduct(null)
                }
                className="relative flex h-8 w-8 items-center justify-center rounded-lg text-blue-200 transition hover:bg-white/10 hover:text-white"
                aria-label="Đóng"
              >
                <XIcon />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-4 bg-gradient-to-br from-blue-50/60 via-white to-cyan-50/50 p-5">

              <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-100 via-white to-cyan-100/70 p-4 shadow-sm">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-base font-black text-white shadow-lg shadow-blue-500/25">

                  {String(
                    selectedProduct.name ?? "?"
                  )
                    .charAt(0)
                    .toUpperCase()}

                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-black text-slate-900">
                    {selectedProduct.name}
                  </p>

                  <p className="mt-1 font-mono text-[10px] font-bold text-blue-600">
                    #{String(
                      selectedProduct.id
                    )}
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm">

                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                    Danh mục
                  </p>

                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {typeof selectedProduct.category ===
                    "string"
                      ? selectedProduct.category
                      : "—"}
                  </p>

                </div>

                <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-white to-cyan-50 p-4 shadow-sm">

                  <p className="text-[10px] font-black uppercase tracking-wider text-cyan-600">
                    Giá bán
                  </p>

                  <p className="mt-1.5 text-sm font-black text-blue-700">

                    {typeof selectedProduct.price ===
                    "number"
                      ? selectedProduct.price.toLocaleString(
                          "vi-VN"
                        )
                      : "0"}{" "}
                    ₫

                  </p>

                </div>

                <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm sm:col-span-2">

                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Trạng thái
                  </p>

                  <div className="mt-2">

                    {selectedProduct.status ===
                      "con_hang" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        Còn hàng

                      </span>
                    )}

                    {selectedProduct.status ===
                      "het_hang" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">

                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

                        Hết hàng

                      </span>
                    )}

                    {selectedProduct.status ===
                      "ngung_ban" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">

                        <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />

                        Ngừng bán

                      </span>
                    )}

                  </div>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end border-t border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedProduct(null)
                }
                className="rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition hover:from-blue-700 hover:to-cyan-600"
              >
                Đóng
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}