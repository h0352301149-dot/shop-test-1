"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getCurrentUser } from "@/lib/api";
import { getToken, logout, removeToken } from "@/lib/auth";
import type { User } from "@/types";

function Icon({
  name,
  size = 20,
}: {
  name:
    | "arrow"
    | "check"
    | "dashboard"
    | "box"
    | "shield"
    | "chart"
    | "menu"
    | "close"
    | "login"
    | "sparkle"
    | "phone"
    | "mail"
    | "users";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );

    case "box":
      return (
        <svg {...common}>
          <path d="m21 8-9-5-9 5 9 5 9-5Z" />
          <path d="M3 8v8l9 5 9-5V8" />
          <path d="M12 13v8" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3Z" />
          <path d="m8.5 12 2.2 2.2 4.8-5" />
        </svg>
      );

    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="m7 15 4-4 3 2 5-6" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    case "login":
      return (
        <svg {...common}>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M21 4v16" />
        </svg>
      );

    case "sparkle":
      return (
        <svg {...common}>
          <path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z" />
          <path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" />
        </svg>
      );

    case "phone":
      return (
        <svg {...common}>
          <path d="M6.5 3h3l1.2 4-2 1.5a15 15 0 0 0 6.8 6.8l1.5-2 4 1.2v3c0 1.1-.9 2-2 2C11.3 19.5 4.5 12.7 4.5 5c0-1.1.9-2 2-2Z" />
        </svg>
      );

    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
  }
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [appMessage, setAppMessage] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const token = getToken();

      if (!token) {
        if (mounted) {
          setAuthLoading(false);
        }
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (mounted) {
          setUser(currentUser);
        }
      } catch {
        removeToken();

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      setUser(null);
    } finally {
      setLoggingOut(false);
    }
  }

  function handleDownloadApp() {
    setAppMessage(true);

    window.setTimeout(() => {
      setAppMessage(false);
    }, 3000);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#06101f] text-white">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-180px] top-[120px] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[130px]" />

        <div className="absolute right-[-180px] top-[250px] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute bottom-[-250px] left-[35%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 75%)",
          }}
        />
      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-[#071426]/80 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex h-[70px] items-center justify-between px-4 sm:px-6">
              {/* LOGO */}

              <Link href="/" className="group flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 text-white shadow-lg shadow-blue-500/20">
                  <img
                    src="/2aOboQws3Jga5zWour3pS6E7WtLQnNGJPgCAZgsy.jpg"
                    alt="ShopAdmin Logo"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <div className="text-[17px] font-black tracking-tight">
                    Shop<span className="text-blue-400">Admin</span>
                  </div>

                  <div className="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    Management System
                  </div>
                </div>
              </Link>

              {/* DESKTOP NAV */}

              <nav className="hidden items-center gap-6 lg:flex">
                {[
                  ["Trang chủ", "#home"],
                  ["Tính năng", "#features"],
                  ["Sản phẩm", "#products"],
                  ["Giá cả", "#pricing"],
                  ["Trải nghiệm", "#reviews"],
                  ["Về chúng tôi", "#about"],
                  ["Liên hệ", "#contact"],
                ].map(([label, href], index) => (
                  <a
                    key={href}
                    href={href}
                    className={`text-[13px] font-semibold transition ${
                      index === 0
                        ? "text-blue-400"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </nav>

              {/* AUTH */}

              <div className="hidden items-center gap-2 sm:flex">
                {authLoading ? (
                  <div className="h-10 w-24 animate-pulse rounded-xl bg-white/5" />
                ) : user ? (
                  <>
                    <Link
                      href="/products"
                      className="rounded-xl px-4 py-2.5 text-xs font-bold text-blue-300 transition hover:bg-blue-500/10 hover:text-blue-200"
                    >
                      Quản trị
                    </Link>

                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-black">
                        {user.email.charAt(0).toUpperCase()}
                      </div>

                      <span className="max-w-[130px] truncate text-[11px] font-semibold text-slate-300">
                        {user.email}
                      </span>

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-500 transition hover:bg-white/10 hover:text-red-400"
                      >
                        {loggingOut ? "..." : "Thoát"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-3 py-2 text-sm font-semibold text-slate-300 transition hover:text-white"
                    >
                      Đăng nhập
                    </Link>

                    <button
                      type="button"
                      onClick={handleDownloadApp}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30 active:scale-95"
                    >
                      Tải app
                    </button>
                  </>
                )}
              </div>

              {/* MOBILE */}

              <button
                type="button"
                onClick={() => setMobileMenu((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 sm:hidden"
                aria-label="Mở menu"
              >
                <Icon name={mobileMenu ? "close" : "menu"} size={20} />
              </button>
            </div>

            {mobileMenu && (
              <div className="border-t border-white/10 px-4 pb-4 pt-3 sm:hidden">
                <nav className="flex flex-col">
                  {[
                    ["Trang chủ", "#home"],
                    ["Tính năng", "#features"],
                    ["Sản phẩm", "#products"],
                    ["Giá cả", "#pricing"],
                    ["Trải nghiệm", "#reviews"],
                    ["Về chúng tôi", "#about"],
                    ["Liên hệ", "#contact"],
                  ].map(([label, href]) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setMobileMenu(false)}
                      className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                      {label}
                    </a>
                  ))}

                  <Link
                    href={user ? "/products" : "/login"}
                    onClick={() => setMobileMenu(false)}
                    className="mt-2 flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    {user ? "Vào trang quản trị" : "Đăng nhập"}
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================
          APP MESSAGE
      ========================================================= */}

      {appMessage && (
        <div className="fixed right-5 top-24 z-[60] max-w-sm rounded-2xl border border-blue-400/20 bg-[#0b1a30]/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Icon name="sparkle" size={17} />
            </div>

            <div>
              <div className="text-sm font-bold text-white">
                Ứng dụng mobile
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Tính năng tải ứng dụng sẽ được cập nhật trong phiên bản tiếp
                theo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          HERO
      ========================================================= */}

      <section
        id="home"
        className="relative z-10 flex min-h-screen items-center pt-28"
      >
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 pb-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          {/* LEFT */}

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-[11px] font-bold text-blue-300 backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
                <Icon name="sparkle" size={11} />
              </span>

              Nền tảng quản lý cửa hàng hiện đại
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-[68px]">
              Quản lý cửa hàng
              <br />

              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                thông minh hơn.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              ShopAdmin là không gian quản trị tập trung dành cho việc theo
              dõi và quản lý sản phẩm trong cửa hàng. Hệ thống giúp bạn truy
              cập dữ liệu nhanh chóng, kiểm tra trạng thái hàng hóa và tìm
              kiếm thông tin cần thiết từ một giao diện thống nhất.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
              Từ quá trình đăng nhập, xác thực phiên làm việc đến danh sách
              sản phẩm, mọi bước đều được tổ chức rõ ràng để giảm thao tác dư
              thừa và giúp việc quản lý trở nên trực quan hơn.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login?redirect=/products"
                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-blue-500/35"
              >
                Bắt đầu quản lý

                <span className="transition-transform group-hover:translate-x-1">
                  <Icon name="arrow" size={17} />
                </span>
              </Link>

              <a
                href="tel:1900639963"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-slate-200 backdrop-blur-md transition hover:-translate-y-1 hover:border-blue-400/30 hover:bg-blue-500/10"
              >
                <Icon name="phone" size={16} />
                Gọi hotline
              </a>
            </div>

            {/* WORKFLOW */}

            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-7 sm:grid-cols-4">
              {[
                ["01", "Đăng nhập", "Xác thực tài khoản"],
                ["02", "Sản phẩm", "Quản lý danh sách"],
                ["03", "Trạng thái", "Phân loại hàng hóa"],
                ["04", "Dữ liệu", "Theo dõi trực quan"],
              ].map(([number, title, subtitle]) => (
                <div key={number}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-400">
                      {number}
                    </span>

                    <span className="text-sm font-black text-white">
                      {title}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] font-medium text-slate-500">
                    {subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT APP MOCKUP */}

          <div className="relative mx-auto w-full max-w-[390px] lg:mr-3">
            <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px]" />

            {/* FLOATING CARD */}

            <div className="absolute -left-12 top-24 z-20 hidden rounded-2xl border border-white/10 bg-[#0c1b30]/90 p-3 shadow-2xl backdrop-blur-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Icon name="check" size={19} />
                </div>

                <div>
                  <div className="text-xs font-bold text-white">
                    Hệ thống ổn định
                  </div>

                  <div className="mt-1 text-[10px] text-slate-500">
                    Dữ liệu được xác thực
                  </div>
                </div>
              </div>
            </div>

            {/* PHONE */}

            <div className="relative z-10 rounded-[43px] border-[7px] border-slate-800 bg-slate-950 p-2 shadow-[0_40px_100px_-25px_rgba(37,99,235,.45)]">
              <div className="absolute left-1/2 top-3 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-black" />

              <div className="overflow-hidden rounded-[34px] border border-blue-500/10 bg-[#081426]">
                {/* APP HEADER */}

                <div className="px-5 pb-4 pt-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-medium text-slate-500">
                        Xin chào
                      </div>

                      <div className="mt-1 text-sm font-black text-white">
                        Shop Admin
                      </div>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <Icon name="dashboard" size={16} />
                    </div>
                  </div>

                  {/* SEARCH */}

                  <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <span>⌕</span>
                      Tìm kiếm sản phẩm...
                    </div>
                  </div>

                  {/* CATEGORIES */}

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      ["Điện thoại", "📱"],
                      ["Máy tính", "💻"],
                      ["Laptop", "🖥️"],
                    ].map(([label, emoji], index) => (
                      <div
                        key={label}
                        className={`rounded-xl border p-2 text-center ${
                          index === 0
                            ? "border-blue-500/30 bg-blue-500/10"
                            : "border-white/5 bg-white/[0.025]"
                        }`}
                      >
                        <div className="text-sm">{emoji}</div>

                        <div className="mt-1 text-[8px] font-bold text-slate-400">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PRODUCT CARD */}

                <div className="px-5 pb-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[11px] font-black text-white">
                      Sản phẩm nổi bật
                    </span>

                    <span className="text-[9px] font-bold text-blue-400">
                      Xem tất cả
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
                    <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-950/80 to-slate-900">
                      <div className="relative h-28 w-16 rounded-[13px] border-2 border-slate-600 bg-slate-950 shadow-2xl shadow-blue-500/20">
                        <div className="absolute left-1/2 top-1.5 h-1 w-7 -translate-x-1/2 rounded-full bg-slate-700" />

                        <div className="absolute right-1.5 top-3 h-5 w-5 rounded-full border border-blue-400/40 bg-blue-500/10" />

                        <div className="absolute inset-x-2 bottom-3 h-1 rounded-full bg-slate-800" />
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="text-[11px] font-black text-white">
                        Thiết bị điện tử
                      </div>

                      <div className="mt-1 text-[9px] text-slate-500">
                        Quản lý thông tin sản phẩm
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[8px] font-bold text-emerald-400">
                          Đang hoạt động
                        </span>

                        <span className="text-[9px] font-bold text-blue-400">
                          Chi tiết →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM NAV */}

                <div className="grid grid-cols-4 border-t border-white/5 bg-black/10 px-3 py-3">
                  {[
                    ["dashboard", "Home"],
                    ["box", "Sản phẩm"],
                    ["chart", "Dữ liệu"],
                    ["users", "Tài khoản"],
                  ].map(([icon, label], index) => (
                    <div
                      key={label}
                      className={`flex flex-col items-center gap-1 ${
                        index === 0 ? "text-blue-400" : "text-slate-600"
                      }`}
                    >
                      <Icon
                        name={
                          icon as
                            | "dashboard"
                            | "box"
                            | "chart"
                            | "users"
                        }
                        size={14}
                      />

                      <span className="text-[7px] font-bold">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM FLOATING */}

            <div className="absolute -bottom-5 -right-7 z-20 hidden rounded-2xl border border-white/10 bg-[#0c1b30]/95 p-3 shadow-2xl backdrop-blur-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Icon name="chart" size={18} />
                </div>

                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Dashboard
                  </div>

                  <div className="mt-1 text-xs font-black text-white">
                    Theo dõi trực quan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}

      <section
        id="features"
        className="relative z-10 border-y border-white/5 bg-[#071426] py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
              Tính năng
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Một hệ thống.
              <br />

              <span className="text-blue-400">Mọi thứ rõ ràng.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              ShopAdmin tập trung vào những thao tác cần thiết trong quá
              trình quản lý cửa hàng. Thay vì phân tán thông tin ở nhiều khu
              vực, hệ thống tổ chức các chức năng theo một luồng rõ ràng từ
              xác thực người dùng đến quản lý và kiểm tra sản phẩm.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "dashboard" as const,
                title: "Không gian quản trị",
                text: "Giao diện tổng quan giúp người dùng nhanh chóng xác định khu vực cần thao tác và truy cập danh sách sản phẩm.",
              },
              {
                icon: "box" as const,
                title: "Quản lý sản phẩm",
                text: "Danh sách sản phẩm được lấy trực tiếp từ hệ thống API và trình bày theo cấu trúc rõ ràng, dễ kiểm tra.",
              },
              {
                icon: "chart" as const,
                title: "Phân loại trạng thái",
                text: "Có thể lọc sản phẩm theo các trạng thái còn hàng, hết hàng và ngừng bán để việc theo dõi trở nên nhanh hơn.",
              },
              {
                icon: "shield" as const,
                title: "Xác thực an toàn",
                text: "Khu vực quản trị yêu cầu xác thực phiên đăng nhập trước khi cho phép truy cập dữ liệu sản phẩm.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-blue-500/[0.05]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500 group-hover:text-white">
                    <Icon name={item.icon} size={21} />
                  </div>

                  <span className="text-xs font-black text-slate-700">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-sm font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCTS
      ========================================================= */}

      <section id="products" className="relative z-10 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
              Sản phẩm
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Quản lý sản phẩm
              <span className="block text-blue-400">
                dễ dàng hơn bao giờ hết.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Khu vực quản lý sản phẩm là nơi tập trung toàn bộ dữ liệu được
              trả về từ API. Người dùng có thể tìm kiếm, lọc theo trạng thái
              và xem thông tin sản phẩm trên một giao diện duy nhất.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
              Cách tổ chức này giúp hạn chế việc phải chuyển qua nhiều màn
              hình, đồng thời hỗ trợ kiểm tra nhanh tình trạng sản phẩm trong
              quá trình vận hành cửa hàng.
            </p>

            <div className="mt-7 space-y-3">
              {[
                "Lọc sản phẩm theo trạng thái",
                "Tìm kiếm thông tin sản phẩm",
                "Theo dõi trạng thái hàng hóa",
                "Dữ liệu lấy trực tiếp từ API",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-3 text-sm font-semibold text-slate-300"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                    <Icon name="check" size={13} />
                  </span>

                  {text}
                </div>
              ))}
            </div>

            <Link
              href="/login?redirect=/products"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Xem trang quản trị

              <Icon name="arrow" size={16} />
            </Link>
          </div>

          {/* UI PREVIEW */}

          <div className="relative">
            <div className="absolute inset-10 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-[#09182c] p-3 shadow-2xl shadow-black/30">
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#071426]">
                <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
                  <div>
                    <div className="h-3 w-28 rounded-full bg-slate-700" />

                    <div className="mt-2 h-2 w-20 rounded-full bg-slate-800" />
                  </div>

                  <div className="h-8 w-8 rounded-xl bg-blue-500/10" />
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Tất cả",
                      "Còn hàng",
                      "Hết hàng",
                      "Ngừng bán",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`rounded-lg px-3 py-2 text-[9px] font-bold ${
                          index === 0
                            ? "bg-blue-600 text-white"
                            : "bg-white/[0.04] text-slate-500"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/5">
                    <div className="grid grid-cols-[1.4fr_.8fr_.6fr] bg-white/[0.025] px-4 py-3 text-[8px] font-bold uppercase tracking-wider text-slate-600">
                      <span>Sản phẩm</span>

                      <span>Trạng thái</span>

                      <span>Giá</span>
                    </div>

                    {[1, 2, 3, 4].map((item, index) => (
                      <div
                        key={item}
                        className="grid grid-cols-[1.4fr_.8fr_.6fr] items-center border-t border-white/5 px-4 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/5" />

                          <div>
                            <div className="h-2 w-20 rounded-full bg-slate-700" />

                            <div className="mt-1.5 h-1.5 w-12 rounded-full bg-slate-800" />
                          </div>
                        </div>

                        <span
                          className={`w-fit rounded-full px-2 py-1 text-[7px] font-bold ${
                            index === 2
                              ? "bg-rose-500/10 text-rose-400"
                              : index === 3
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {index === 2
                            ? "Hết hàng"
                            : index === 3
                              ? "Ngừng bán"
                              : "Còn hàng"}
                        </span>

                        <div className="h-2 w-12 rounded-full bg-slate-700" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRICING / APPROACH
      ========================================================= */}

      <section
        id="pricing"
        className="border-y border-white/5 bg-[#071426] py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
              Giá trị
            </span>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Tập trung vào trải nghiệm quản trị
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Giao diện được xây dựng với mục tiêu giảm sự phức tạp trong quá
              trình sử dụng, giúp người quản trị dễ dàng chuyển từ đăng nhập
              sang khu vực sản phẩm và nhanh chóng tìm thấy thông tin cần
              thiết.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/[0.03] p-8 text-center shadow-2xl shadow-blue-950/20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Icon name="sparkle" size={25} />
            </div>

            <h3 className="mt-6 text-xl font-black text-white">
              Một quy trình quản lý rõ ràng
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              Từ xác thực tài khoản đến quản lý danh sách sản phẩm, từng bước
              được thiết kế để giữ cho dữ liệu và thao tác luôn dễ theo dõi.
            </p>

            <Link
              href="/login"
              className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              Truy cập quản trị
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          EXPERIENCE
      ========================================================= */}

      <section id="reviews" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
              Trải nghiệm
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Thiết kế cho
              <span className="text-blue-400"> thao tác hàng ngày.</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
              Mỗi khu vực trong hệ thống đều hướng đến một mục tiêu cụ thể:
              giúp người dùng hiểu mình đang ở đâu, đang xem dữ liệu gì và
              bước tiếp theo cần thực hiện là gì.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: "dashboard" as const,
                title: "Dễ quan sát",
                text: "Bố cục phân cấp rõ ràng giúp người dùng nhanh chóng nhận biết khu vực điều hướng, bộ lọc và dữ liệu sản phẩm.",
              },
              {
                icon: "shield" as const,
                title: "Có kiểm soát",
                text: "Các khu vực dữ liệu quản trị được bảo vệ bằng cơ chế xác thực phiên đăng nhập trước khi truy cập.",
              },
              {
                icon: "chart" as const,
                title: "Dễ thao tác",
                text: "Tìm kiếm, lọc trạng thái và xem thông tin được đặt trong cùng một luồng để giảm số bước xử lý.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition hover:border-blue-500/20 hover:bg-blue-500/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Icon name={item.icon} size={20} />
                </div>

                <h3 className="mt-5 text-base font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================= */}

      <section
        id="about"
        className="border-t border-white/5 bg-[#071426] py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-500/10 via-white/[0.02] to-cyan-500/[0.04] p-8 sm:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                  Về chúng tôi
                </span>

                <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                  Công nghệ phục vụ
                  <span className="text-blue-400">
                    {" "}
                    trải nghiệm đơn giản.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  ShopAdmin được xây dựng với định hướng tạo ra một không gian
                  quản trị đơn giản nhưng đủ rõ ràng cho các thao tác quản lý
                  sản phẩm. Thay vì tập trung quá nhiều chức năng trên một màn
                  hình, hệ thống ưu tiên cách tổ chức thông tin theo từng bước
                  để người dùng dễ làm quen và sử dụng.
                </p>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Quy trình bắt đầu từ việc xác thực tài khoản, sau đó người
                  dùng có thể truy cập khu vực quản trị, tìm kiếm sản phẩm và
                  lọc dữ liệu theo trạng thái. Dữ liệu được lấy trực tiếp từ
                  API giúp giao diện phản ánh thông tin thực tế của hệ thống
                  thay vì sử dụng dữ liệu minh họa cố định.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["01", "Đăng nhập"],
                  ["02", "Xác thực"],
                  ["03", "Quản lý"],
                  ["04", "Theo dõi"],
                ].map(([number, label]) => (
                  <div
                    key={number}
                    className="min-w-[120px] rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-blue-500/20 hover:bg-blue-500/[0.05]"
                  >
                    <div className="text-xl font-black text-blue-400">
                      {number}
                    </div>

                    <div className="mt-1 text-xs font-bold text-slate-400">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT
      ========================================================= */}

      <section id="contact" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-600 to-cyan-500 p-8 shadow-2xl shadow-blue-600/20 sm:p-12">
            <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">
                  Liên hệ
                </span>

                <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                  Bắt đầu quản lý sản phẩm
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-blue-50/80">
                  Đăng nhập để truy cập khu vực quản trị, kiểm tra danh sách
                  sản phẩm và sử dụng các bộ lọc trạng thái được cung cấp
                  trong hệ thống.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/login?redirect=/products"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  Vào trang quản trị

                  <Icon name="arrow" size={16} />
                </Link>

                <a
                  href="tel:1900639963"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <Icon name="phone" size={16} />

                  1900 63 99 63
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-white/5 bg-[#050d19]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-blue-600 text-white">
                <img
                  src="/2aOboQws3Jga5zWour3pS6E7WtLQnNGJPgCAZgsy.jpg"
                  alt="ShopAdmin Logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <div className="text-sm font-black">
                  Shop<span className="text-blue-400">Admin</span>
                </div>

                <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Management System
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
              <a href="#features" className="transition hover:text-blue-400">
                Tính năng
              </a>

              <a href="#products" className="transition hover:text-blue-400">
                Sản phẩm
              </a>

              <a href="#about" className="transition hover:text-blue-400">
                Về chúng tôi
              </a>

              <a href="#contact" className="transition hover:text-blue-400">
                Liên hệ
              </a>
            </div>

            <div className="text-xs text-slate-700">
              © {new Date().getFullYear()} ShopAdmin
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}