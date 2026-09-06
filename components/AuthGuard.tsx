// ============================================================
// FILE: components/AuthGuard.tsx
// MỤC ĐÍCH:
// - Bảo vệ các trang yêu cầu đăng nhập
// - Kiểm tra token bằng GET /me
// - F5 vẫn xác thực lại session
// - Token không hợp lệ → redirect /login
// - Không cho nội dung protected bị flash trước khi xác thực
// ============================================================

"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { checkSession } from "@/lib/auth";

interface AuthGuardProps {
  children: ReactNode;
}

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [status, setStatus] =
    useState<AuthStatus>("checking");

  useEffect(() => {
    let mounted = true;

    async function validateSession() {
      // ------------------------------------------------------
      // Mỗi lần mount → kiểm tra token + GET /me
      // ------------------------------------------------------
      const user = await checkSession();

      if (!mounted) {
        return;
      }

      if (user) {
        setStatus("authenticated");
        return;
      }

      // ------------------------------------------------------
      // Không có session hợp lệ
      // → redirect về login
      // ------------------------------------------------------
      setStatus("unauthenticated");

      const redirectPath = pathname
        ? `?redirect=${encodeURIComponent(pathname)}`
        : "";

      router.replace(`/login${redirectPath}`);
    }

    validateSession();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  // ==========================================================
  // ĐANG KIỂM TRA SESSION
  // ==========================================================
  if (status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl border border-white/10 bg-white p-8 text-center shadow-2xl">
            {/* Logo */}
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7 text-white"
                aria-hidden="true"
              >
                <path
                  d="M5 8.5 12 4l7 4.5v8L12 21l-7-4.5v-8Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />

                <path
                  d="m8 10.5 4 2.5 4-2.5M12 13v5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Spinner */}
            <div className="mx-auto flex h-10 w-10 items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Đang xác thực phiên đăng nhập
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Vui lòng chờ trong giây lát...
            </p>

            {/* Skeleton */}
            <div className="mt-6 space-y-3">
              <div className="h-3 animate-pulse rounded-full bg-slate-100" />
              <div className="mx-auto h-3 w-3/4 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // CHƯA ĐĂNG NHẬP
  // ==========================================================
  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />

          <p className="mt-4 text-sm font-medium text-white/70">
            Đang chuyển đến trang đăng nhập...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // ĐÃ XÁC THỰC
  // ==========================================================
  return <>{children}</>;
}