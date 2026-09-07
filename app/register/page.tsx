// ============================================================
// FILE: app/register/page.tsx
// ============================================================

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerUser } from "@/lib/api";

/*
 * NOTE:
 * Đây là Client Component vì trang đăng ký cần:
 * - useState để quản lý dữ liệu form
 * - xử lý sự kiện submit
 * - hiển thị loading/error/success
 * - useRouter để điều hướng
 *
 * Phần gọi API vẫn được tách riêng trong lib/api.ts,
 * UI không gọi fetch trực tiếp.
 */

export default function RegisterPage() {
  const router = useRouter();

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ==========================================================
  // PASSWORD VISIBILITY
  // ==========================================================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ==========================================================
  // REQUEST STATE
  // ==========================================================

  const [loading, setLoading] = useState(false);

  // ==========================================================
  // GLOBAL MESSAGE
  // ==========================================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // FIELD VALIDATION ERROR
  // ==========================================================

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPasswordError, setConfirmPasswordError] =
    useState("");

  // ==========================================================
  // VALIDATION
  // ==========================================================

  function validateForm() {
    let isValid = true;

    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const normalizedEmail = email.trim();

    // ========================================================
    // EMAIL VALIDATION
    // ========================================================

    if (!normalizedEmail) {
      setEmailError("Vui lòng nhập email.");
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      setEmailError("Email không hợp lệ.");
      isValid = false;
    }

    // ========================================================
    // PASSWORD VALIDATION
    // ========================================================

    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(
        "Mật khẩu phải có ít nhất 6 ký tự."
      );
      isValid = false;
    }

    // ========================================================
    // CONFIRM PASSWORD VALIDATION
    // ========================================================

    if (!confirmPassword) {
      setConfirmPasswordError(
        "Vui lòng xác nhận mật khẩu."
      );
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(
        "Mật khẩu xác nhận không khớp."
      );
      isValid = false;
    }

    return isValid;
  }

  // ==========================================================
  // REGISTER
  // ==========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Không gọi API nếu form không hợp lệ.
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      /*
       * Component không gọi fetch trực tiếp.
       * API service nằm trong lib/api.ts
       */

      await registerUser(
        email.trim(),
        password
      );

      /*
       * API đăng ký thành công.
       *
       * Không tự động login vì API register
       * không trả token theo flow hiện tại.
       */

      setSuccess(
        "Tạo tài khoản thành công. Bạn có thể đăng nhập để tiếp tục."
      );

      // Xóa form sau khi đăng ký thành công.
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Đăng ký thất bại. Vui lòng thử lại.";

      setError(message);

    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // CLEAR MESSAGES WHEN USER TYPES
  // ==========================================================

  function handleEmailChange(value: string) {
    setEmail(value);
    setEmailError("");
    setError("");
    setSuccess("");
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setPasswordError("");
    setError("");
    setSuccess("");
  }

  function handleConfirmPasswordChange(value: string) {
    setConfirmPassword(value);
    setConfirmPasswordError("");
    setError("");
    setSuccess("");
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07090E] p-4 text-slate-100 sm:p-6 lg:p-8">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[140px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.03] blur-[120px]"
        aria-hidden="true"
      />

      {/* Grid */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ======================================================
          MAIN CARD
      ====================================================== */}

      <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 shadow-2xl shadow-black/80 backdrop-blur-2xl">

        <div className="grid min-h-[680px] lg:grid-cols-12">

          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <section className="relative hidden flex-col justify-between border-r border-white/5 bg-gradient-to-br from-white/[0.025] via-transparent to-cyan-500/[0.02] p-10 lg:col-span-7 lg:flex xl:p-12">

            {/* Brand */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                {/* ==================================================
                    LOGO - ĐÃ ĐỔI SANG ẢNH
                ================================================== */}

                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 shadow-lg shadow-cyan-500/10">

                  <img
                    src="/2aOboQws3Jga5zWour3pS6E7WtLQnNGJPgCAZgsy.jpg"
                    alt="Shop Admin Logo"
                    className="h-full w-full object-cover"
                  />

                </div>

                <div>

                  <h3 className="font-bold leading-none text-white">
                    Shop Admin
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Management System
                  </p>

                </div>

              </div>

              {/* System Status */}

              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400">

                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                Hệ thống hoạt động

              </div>

            </div>

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <div className="my-auto py-12">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5">

                <span className="text-cyan-400">
                  ✦
                </span>

                <span className="text-[11px] font-medium text-cyan-300">
                  SHOP MANAGEMENT
                </span>

              </div>

              <h1 className="max-w-xl text-4xl font-extrabold leading-[1.15] tracking-tight text-white xl:text-5xl">

                Bắt đầu quản lý

                <br />

                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  cửa hàng của bạn.
                </span>

              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
                Tạo tài khoản quản trị để truy cập hệ thống
                và bắt đầu quản lý sản phẩm một cách nhanh chóng,
                trực quan và hiệu quả.
              </p>

              {/* ==================================================
                  FEATURES
              ================================================== */}

              <div className="mt-8 space-y-4">

                {/* Feature 1 */}

                <div className="group flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-500/10 text-lg transition group-hover:border-cyan-400/20 group-hover:bg-cyan-500/15">
                    📦
                  </div>

                  <div>

                    <h3 className="text-sm font-semibold text-white">
                      Quản lý sản phẩm
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Theo dõi danh sách và trạng thái sản phẩm
                      trong cửa hàng.
                    </p>

                  </div>

                </div>

                {/* Feature 2 */}

                <div className="group flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10 text-lg transition group-hover:border-blue-400/20 group-hover:bg-blue-500/15">
                    📊
                  </div>

                  <div>

                    <h3 className="text-sm font-semibold text-white">
                      Kiểm soát tồn kho
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Dễ dàng nhận biết sản phẩm còn hàng,
                      hết hàng hoặc ngừng bán.
                    </p>

                  </div>

                </div>

                {/* Feature 3 */}

                <div className="group flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10 text-lg transition group-hover:border-indigo-400/20 group-hover:bg-indigo-500/15">
                    🔐
                  </div>

                  <div>

                    <h3 className="text-sm font-semibold text-white">
                      Truy cập an toàn
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Khu vực quản trị chỉ dành cho tài khoản
                      đã được xác thực.
                    </p>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  INFO BOX
              ================================================== */}

              <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-4">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 text-cyan-400">
                    ✨
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-slate-200">
                      Tạo tài khoản chỉ mất vài giây
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Sử dụng email và mật khẩu của bạn để
                      tạo tài khoản quản trị mới.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex items-center justify-between text-[10px] text-slate-600">

              <span>
                © 2026 Shop Admin Platform
              </span>

              <div className="flex items-center gap-4">

                <span>
                  Secure Access
                </span>

                <span>
                  v1.0.0
                </span>

              </div>

            </div>

          </section>

          {/* ==================================================
              RIGHT SIDE - REGISTER
          ================================================== */}

          <section className="flex flex-col justify-center bg-slate-900/40 p-6 sm:p-10 lg:col-span-5">

            <div className="mx-auto w-full max-w-sm">

              {/* ==================================================
                  BACK TO HOME
              ================================================== */}

              <div className="mb-6">

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  disabled={loading}
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-400 transition-all duration-200 hover:border-cyan-400/20 hover:bg-cyan-500/5 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <span className="text-base transition-transform duration-200 group-hover:-translate-x-1">
                    ←
                  </span>

                  Về trang chủ

                </button>

              </div>

              {/* ==================================================
                  HEADER
              ================================================== */}

              <div className="mb-7">

                {/* ==================================================
                    MOBILE LOGO - ĐÃ ĐỔI SANG ẢNH
                ================================================== */}

                <div className="mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/20 bg-cyan-500/10 lg:hidden">

                  <img
                    src="/2aOboQws3Jga5zWour3pS6E7WtLQnNGJPgCAZgsy.jpg"
                    alt="Shop Admin Logo"
                    className="h-full w-full object-cover"
                  />

                </div>

                <span className="inline-flex items-center rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-cyan-400">
                  CREATE ACCOUNT
                </span>

                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
                  Tạo tài khoản
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Đăng ký tài khoản quản trị mới để bắt đầu
                </p>

              </div>

              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5"
                >

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-sm">
                    ⚠
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-semibold text-rose-200">
                      Đăng ký thất bại
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-rose-300/80">
                      {error}
                    </p>

                  </div>

                </div>
              )}

              {/* ==================================================
                  SUCCESS
              ================================================== */}

              {success && (
                <div
                  role="status"
                  className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"
                >

                  <div className="flex items-start gap-3">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-sm">
                      ✓
                    </div>

                    <div>

                      <p className="text-xs font-semibold text-emerald-200">
                        Đăng ký thành công
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-emerald-300/80">
                        {success}
                      </p>

                    </div>

                  </div>

                  {/* CTA đăng nhập */}

                  <Link
                    href="/login"
                    className="mt-3 block text-center text-xs font-semibold text-emerald-400 transition hover:text-emerald-300 hover:underline"
                  >
                    Đăng nhập ngay →
                  </Link>

                </div>
              )}

              {/* ==================================================
                  FORM
              ================================================== */}

              {!success && (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-4"
                >

                  {/* ==================================================
                      EMAIL
                  ================================================== */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-300"
                    >
                      Email
                    </label>

                    <div className="relative">

                      <span
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                        aria-hidden="true"
                      >

                        <svg
                          width="17"
                          height="17"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          viewBox="0 0 24 24"
                        >

                          <rect
                            x="3"
                            y="5"
                            width="18"
                            height="14"
                            rx="2"
                          />

                          <path d="m3 7 9 6 9-6" />

                        </svg>

                      </span>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                          handleEmailChange(
                            event.target.value
                          )
                        }
                        placeholder="admin@example.com"
                        autoComplete="email"
                        disabled={loading}
                        aria-invalid={Boolean(emailError)}
                        aria-describedby={
                          emailError
                            ? "email-error"
                            : undefined
                        }
                        className={`w-full rounded-xl border bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 ${
                          emailError
                            ? "border-rose-500/50 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10"
                            : "border-white/10 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      />

                    </div>

                    {emailError && (
                      <p
                        id="email-error"
                        className="mt-1.5 text-[11px] text-rose-400"
                      >
                        {emailError}
                      </p>
                    )}

                  </div>

                  {/* ==================================================
                      PASSWORD
                  ================================================== */}

                  <div>

                    <label
                      htmlFor="password"
                      className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-300"
                    >
                      Mật khẩu
                    </label>

                    <div className="relative">

                      <span
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                        aria-hidden="true"
                      >

                        <svg
                          width="17"
                          height="17"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          viewBox="0 0 24 24"
                        >

                          <rect
                            x="4"
                            y="10"
                            width="16"
                            height="10"
                            rx="2"
                          />

                          <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                        </svg>

                      </span>

                      <input
                        id="password"
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(event) =>
                          handlePasswordChange(
                            event.target.value
                          )
                        }
                        placeholder="Ít nhất 6 ký tự"
                        autoComplete="new-password"
                        disabled={loading}
                        aria-invalid={Boolean(
                          passwordError
                        )}
                        aria-describedby={
                          passwordError
                            ? "password-error"
                            : undefined
                        }
                        className={`w-full rounded-xl border bg-slate-950/70 py-3 pl-11 pr-11 text-sm text-white outline-none transition-all placeholder:text-slate-700 ${
                          passwordError
                            ? "border-rose-500/50 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10"
                            : "border-white/10 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current
                          )
                        }
                        disabled={loading}
                        aria-label={
                          showPassword
                            ? "Ẩn mật khẩu"
                            : "Hiển thị mật khẩu"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-cyan-400 disabled:opacity-50"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>

                    </div>

                    {passwordError && (
                      <p
                        id="password-error"
                        className="mt-1.5 text-[11px] text-rose-400"
                      >
                        {passwordError}
                      </p>
                    )}

                  </div>

                  {/* ==================================================
                      CONFIRM PASSWORD
                  ================================================== */}

                  <div>

                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-300"
                    >
                      Xác nhận mật khẩu
                    </label>

                    <div className="relative">

                      <span
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                        aria-hidden="true"
                      >

                        <svg
                          width="17"
                          height="17"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          viewBox="0 0 24 24"
                        >

                          <rect
                            x="4"
                            y="10"
                            width="16"
                            height="10"
                            rx="2"
                          />

                          <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                        </svg>

                      </span>

                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(event) =>
                          handleConfirmPasswordChange(
                            event.target.value
                          )
                        }
                        placeholder="Nhập lại mật khẩu"
                        autoComplete="new-password"
                        disabled={loading}
                        aria-invalid={Boolean(
                          confirmPasswordError
                        )}
                        aria-describedby={
                          confirmPasswordError
                            ? "confirm-password-error"
                            : undefined
                        }
                        className={`w-full rounded-xl border bg-slate-950/70 py-3 pl-11 pr-11 text-sm text-white outline-none transition-all placeholder:text-slate-700 ${
                          confirmPasswordError
                            ? "border-rose-500/50 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10"
                            : "border-white/10 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current
                          )
                        }
                        disabled={loading}
                        aria-label={
                          showConfirmPassword
                            ? "Ẩn mật khẩu xác nhận"
                            : "Hiển thị mật khẩu xác nhận"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-cyan-400 disabled:opacity-50"
                      >
                        {showConfirmPassword
                          ? "🙈"
                          : "👁️"}
                      </button>

                    </div>

                    {confirmPasswordError && (
                      <p
                        id="confirm-password-error"
                        className="mt-1.5 text-[11px] text-rose-400"
                      >
                        {confirmPasswordError}
                      </p>
                    )}

                  </div>

                  {/* ==================================================
                      PASSWORD REQUIREMENT
                  ================================================== */}

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Yêu cầu mật khẩu
                    </p>

                    <div className="mt-2 flex items-center gap-2">

                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          password.length >= 6
                            ? "bg-emerald-400"
                            : "bg-slate-700"
                        }`}
                      />

                      <span
                        className={`text-[10px] ${
                          password.length >= 6
                            ? "text-emerald-400"
                            : "text-slate-600"
                        }`}
                      >
                        Ít nhất 6 ký tự
                      </span>

                    </div>

                  </div>

                  {/* ==================================================
                      REGISTER BUTTON
                  ================================================== */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <span
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                      aria-hidden="true"
                    />

                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        <span>
                          Đang tạo tài khoản...
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          Tạo tài khoản
                        </span>

                        <span className="text-base transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </>
                    )}

                  </button>

                </form>
              )}

              {/* ==================================================
                  LOGIN LINK
              ================================================== */}

              <div className="mt-6 text-center">

                <p className="text-xs text-slate-500">
                  Đã có tài khoản?
                </p>

                <Link
                  href="/login"
                  className="mt-1.5 inline-block text-xs font-semibold text-cyan-400 transition hover:text-cyan-300 hover:underline"
                >
                  Đăng nhập ngay →
                </Link>

              </div>

              {/* ==================================================
                  SECURITY NOTE
              ================================================== */}

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-600">

                <span className="text-emerald-500">
                  ●
                </span>

                Thông tin tài khoản được bảo vệ

              </div>

            </div>

          </section>

        </div>
      </div>

    </main>
  );
}