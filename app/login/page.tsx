// ============================================================
// FILE: app/login/page.tsx
// CHỨC NĂNG: Màn hình đăng nhập tài khoản Quản trị viên (Admin)
// ============================================================

"use client";

// NOTE:
// Trang này sử dụng:
// - useState: quản lý form
// - useRouter: điều hướng
// - useSearchParams: đọc redirect URL
//
// Vì Next.js 16 yêu cầu useSearchParams() phải nằm trong
// Suspense Boundary khi build production, nên phần sử dụng
// useSearchParams được tách vào LoginForm và được bọc Suspense
// ở LoginPage.

// React
import {
  FormEvent,
  Suspense,
  useState,
} from "react";

// Next.js
import { useRouter, useSearchParams } from "next/navigation";

// Authentication service
import { login } from "@/lib/auth";

// ============================================================
// LOGIN FORM
// ============================================================

function LoginForm() {
  // ==========================================================
  // ROUTING HOOKS
  // ==========================================================

  const router = useRouter();

  /*
   * NOTE:
   * useSearchParams() được đặt trong component này.
   *
   * Component LoginForm sẽ được bọc bởi <Suspense>
   * bên dưới để Next.js có thể prerender/build trang
   * mà không báo lỗi.
   */
  const searchParams = useSearchParams();

  /*
   * NOTE:
   * Nếu URL có:
   *
   * /login?redirect=/products
   *
   * thì sau khi login thành công sẽ quay lại /products.
   *
   * Nếu không có redirect thì mặc định chuyển đến /products.
   */
  const redirectTo =
    searchParams.get("redirect") || "/products";

  // ==========================================================
  // STATE MANAGEMENT
  // ==========================================================

  // Dữ liệu form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Trạng thái giao diện
  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  // Trạng thái API
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // Lỗi validation từng field
  const [emailError, setEmailError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  // ==========================================================
  // VALIDATE FORM
  // ==========================================================

  function validateForm() {
    let isValid = true;

    // Reset lỗi cũ
    setEmailError("");
    setPasswordError("");

    const normalizedEmail =
      email.trim();

    // --------------------------------------------------------
    // EMAIL
    // --------------------------------------------------------

    if (!normalizedEmail) {
      setEmailError(
        "Vui lòng nhập email."
      );

      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      setEmailError(
        "Email không hợp lệ."
      );

      isValid = false;
    }

    // --------------------------------------------------------
    // PASSWORD
    // --------------------------------------------------------

    if (!password) {
      setPasswordError(
        "Vui lòng nhập mật khẩu."
      );

      isValid = false;
    } else if (
      password.length < 6
    ) {
      setPasswordError(
        "Mật khẩu phải có ít nhất 6 ký tự."
      );

      isValid = false;
    }

    return isValid;
  }

  // ==========================================================
  // HANDLE LOGIN
  // ==========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    /*
     * NOTE:
     * Ngăn browser reload trang mặc định
     * khi submit form.
     */
    event.preventDefault();

    // Xóa lỗi cũ
    setError("");

    // Không gọi API nếu validation thất bại
    if (!validateForm()) {
      return;
    }

    try {
      // Bật loading
      setLoading(true);

      /*
       * NOTE:
       * Không fetch trực tiếp ở UI.
       *
       * login() nằm trong:
       * lib/auth.ts
       *
       * lib/auth.ts tiếp tục gọi:
       * lib/api.ts
       */
      await login(
        email.trim(),
        password
      );

      /*
       * NOTE:
       * Lưu lựa chọn "Ghi nhớ đăng nhập".
       *
       * Token thực tế được lưu bởi login()
       * trong lib/auth.ts.
       */
      if (
        typeof window !==
        "undefined"
      ) {
        localStorage.setItem(
          "shop_remember_me",
          rememberMe
            ? "true"
            : "false"
        );
      }

      /*
       * NOTE:
       * Login thành công:
       * - replace để không quay lại form login bằng Back
       * - redirectTo giữ đúng trang người dùng cần vào
       */
      router.replace(
        redirectTo
      );

    } catch (err: unknown) {
      /*
       * NOTE:
       * err là unknown để TypeScript
       * kiểm tra kiểu an toàn.
       */
      const message =
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng thử lại.";

      setError(message);

    } finally {
      /*
       * NOTE:
       * finally luôn chạy sau request,
       * dù thành công hay thất bại.
       */
      setLoading(false);
    }
  }

  // ==========================================================
  // FORGOT PASSWORD
  // ==========================================================

  function handleForgotPassword() {
    /*
     * NOTE:
     * API hiện tại chưa có endpoint
     * khôi phục mật khẩu.
     */
    setError(
      "Tính năng khôi phục mật khẩu hiện chưa được hỗ trợ."
    );
  }

  // ==========================================================
  // GO REGISTER
  // ==========================================================

  function handleRegister() {
    router.push("/register");
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07090E] p-4 text-slate-100 sm:p-6 lg:p-8">

      {/* ======================================================
          BACKGROUND EFFECTS
      ====================================================== */}

      {/* Cyan glow */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]"
        aria-hidden="true"
      />

      {/* Indigo glow */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[140px]"
        aria-hidden="true"
      />

      {/* Blue center glow */}
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
          backgroundSize:
            "32px 32px",
        }}
      />

      {/* ======================================================
          MAIN CARD
      ====================================================== */}

      <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 shadow-2xl shadow-black/80 backdrop-blur-2xl">

        <div className="grid min-h-[650px] lg:grid-cols-12">

          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <section className="relative hidden flex-col justify-between border-r border-white/5 bg-gradient-to-br from-white/[0.025] via-transparent to-cyan-500/[0.02] p-10 lg:col-span-7 lg:flex xl:p-12">

            {/* Brand */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-lg font-bold text-cyan-300 shadow-lg shadow-cyan-500/10">
                  S
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

              {/* Status */}
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400">

                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                Hệ thống hoạt động

              </div>

            </div>

            {/* Main content */}
            <div className="my-auto py-12">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5">

                <span className="text-cyan-400">
                  ✦
                </span>

                <span className="text-[11px] font-medium text-cyan-300">
                  ADMIN MANAGEMENT
                </span>

              </div>

              <h1 className="max-w-xl text-4xl font-extrabold leading-[1.15] tracking-tight text-white xl:text-5xl">

                Quản lý cửa hàng

                <br />

                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  đơn giản & hiệu quả.
                </span>

              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
                Một không gian quản trị tập trung giúp bạn dễ dàng
                theo dõi sản phẩm, kiểm soát tồn kho và quản lý
                trạng thái kinh doanh.
              </p>

              {/* Features */}
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
                      Xem và quản lý danh sách sản phẩm trên hệ thống.
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
                      Theo dõi tồn kho
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Nhanh chóng kiểm tra sản phẩm còn hàng,
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
                      Xác thực an toàn
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Chỉ tài khoản đã xác thực mới có quyền
                      truy cập khu vực quản trị.
                    </p>

                  </div>

                </div>

              </div>

              {/* Info box */}
              <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-4">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 text-cyan-400">
                    ✨
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-slate-200">
                      Không gian quản trị tập trung
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Đăng nhập để truy cập các chức năng quản lý
                      được bảo vệ của hệ thống.
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
              RIGHT SIDE
          ================================================== */}

          <section className="flex flex-col justify-center bg-slate-900/40 p-6 sm:p-10 lg:col-span-5">

            <div className="mx-auto w-full max-w-sm">

              {/* Back Home */}
              <div className="mb-6">

                <button
                  type="button"
                  onClick={() =>
                    router.push("/")
                  }
                  disabled={loading}
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-400 transition-all duration-200 hover:border-cyan-400/20 hover:bg-cyan-500/5 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <span className="text-base transition-transform duration-200 group-hover:-translate-x-1">
                    ←
                  </span>

                  Về trang chủ

                </button>

              </div>

              {/* Header */}
              <div className="mb-7">

                {/* Mobile logo */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-xl text-cyan-300 lg:hidden">
                  S
                </div>

                <span className="inline-flex items-center rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-cyan-400">
                  ADMIN PORTAL
                </span>

                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
                  Chào mừng trở lại
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Đăng nhập vào tài khoản quản trị của bạn
                </p>

              </div>

              {/* Error */}
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
                      Đăng nhập thất bại
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-rose-300/80">
                      {error}
                    </p>

                  </div>

                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >

                {/* Email */}
                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Email
                  </label>

                  <div className="relative">

                    {/* Email icon */}
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
                      onChange={(event) => {
                        setEmail(
                          event.target.value
                        );

                        setEmailError("");

                        setError("");
                      }}
                      placeholder="admin@example.com"
                      autoComplete="email"
                      disabled={loading}
                      aria-invalid={Boolean(
                        emailError
                      )}
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

                {/* Password */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-[11px] font-semibold uppercase tracking-wider text-slate-300"
                    >
                      Mật khẩu
                    </label>

                    <button
                      type="button"
                      onClick={
                        handleForgotPassword
                      }
                      disabled={loading}
                      className="text-[11px] font-medium text-cyan-400 transition hover:text-cyan-300 hover:underline disabled:opacity-50"
                    >
                      Quên mật khẩu?
                    </button>

                  </div>

                  <div className="relative">

                    {/* Password icon */}
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
                      onChange={(event) => {
                        setPassword(
                          event.target.value
                        );

                        setPasswordError("");

                        setError("");
                      }}
                      placeholder="Nhập mật khẩu"
                      autoComplete="current-password"
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

                    {/* Show / Hide password */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
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

                      {showPassword ? (
                        <svg
                          width="17"
                          height="17"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          viewBox="0 0 24 24"
                        >

                          <path d="M3 3l18 18" />

                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />

                          <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 8.5 4 9.8 6a17 17 0 0 1-3.1 3.4" />

                          <path d="M6.1 6.1C3.9 7.5 2.5 9.4 2.2 10c1.3 2 4.8 6 9.8 6 1 0 2-.2 2.9-.5" />

                        </svg>
                      ) : (
                        <svg
                          width="17"
                          height="17"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          viewBox="0 0 24 24"
                        >

                          <path d="M2.2 12S5.5 5 12 5s9.8 7 9.8 7-3.3 7-9.8 7-9.8-7-9.8-7Z" />

                          <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                          />

                        </svg>
                      )}

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

                {/* Remember me */}
                <div className="flex items-center gap-2">

                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                    disabled={loading}
                    className="h-4 w-4 cursor-pointer rounded border-white/20 bg-slate-950 accent-cyan-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <label
                    htmlFor="remember"
                    className="cursor-pointer select-none text-xs text-slate-500"
                  >
                    Ghi nhớ đăng nhập
                  </label>

                </div>

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {/* Shine */}
                  <span
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden="true"
                  />

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      <span>
                        Đang xác thực...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Đăng nhập
                      </span>

                      <span className="text-base transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </>
                  )}

                </button>

              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">

                <div className="h-px flex-1 bg-white/5" />

                <span className="text-[10px] text-slate-600">
                  HOẶC
                </span>

                <div className="h-px flex-1 bg-white/5" />

              </div>

              {/* Register */}
              <div className="text-center">

                <p className="text-xs text-slate-500">
                  Chưa có tài khoản?
                </p>

                <button
                  type="button"
                  onClick={
                    handleRegister
                  }
                  disabled={loading}
                  className="mt-1.5 text-xs font-semibold text-cyan-400 transition hover:text-cyan-300 hover:underline disabled:opacity-50"
                >
                  Tạo tài khoản mới →
                </button>

              </div>

              {/* Security */}
              <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-slate-600">

                <span className="text-emerald-500">
                  ●
                </span>

                Kết nối được bảo vệ bởi hệ thống xác thực

              </div>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================

export default function LoginPage() {
  /*
   * NOTE QUAN TRỌNG:
   *
   * Next.js 16 yêu cầu useSearchParams()
   * phải nằm trong Suspense Boundary.
   *
   * LoginForm sử dụng useSearchParams(),
   * vì vậy LoginForm được đặt bên trong Suspense.
   *
   * fallback là giao diện loading đơn giản trong lúc
   * Next.js xử lý phần client-side search params.
   */
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#07090E] text-slate-100">

          <div className="flex flex-col items-center gap-4">

            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

            <p className="text-sm text-slate-500">
              Đang tải trang đăng nhập...
            </p>

          </div>

        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}