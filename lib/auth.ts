// ============================================================
// FILE: lib/auth.ts
// MỤC ĐÍCH:
// - Quản lý token đăng nhập
// - Lưu / lấy / xóa token
// - Kiểm tra session bằng GET /me
// - Đăng nhập
// - Đăng xuất và revoke token trên server
// ============================================================

import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "@/lib/api";

import type {
  LoginResponse,
  User,
} from "@/types";

const TOKEN_KEY = "shop_token";

// ============================================================
// GET TOKEN
// ============================================================

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

// ============================================================
// CHECK TOKEN EXISTS
// ============================================================

export function hasToken(): boolean {
  return Boolean(getToken());
}

// ============================================================
// SAVE TOKEN
// ============================================================

export function saveToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
}

// ============================================================
// REMOVE TOKEN
// ============================================================

export function removeToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}

// ============================================================
// LOGIN
// ============================================================

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await loginUser(
    email,
    password,
  );

  saveToken(response.token);

  return response;
}

// ============================================================
// CHECK SESSION
//
// Quy tắc:
// - Không có token => chưa đăng nhập
// - GET /me thành công => session hợp lệ
// - HTTP 401 => token không hợp lệ => xóa token
// - Lỗi mạng => giữ token và ném lỗi ra ngoài
// ============================================================

export async function checkSession(): Promise<User | null> {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const user = await getCurrentUser();

    return user;
  } catch (error) {
    // ========================================================
    // KIỂM TRA HTTP 401
    // ========================================================

    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status?: unknown }).status === 401
    ) {
      removeToken();

      return null;
    }

    // ========================================================
    // LỖI MẠNG
    //
    // Không xóa token.
    // Để UI hiển thị Error + Retry.
    // ========================================================

    throw error;
  }
}

// ============================================================
// LOGOUT
//
// Quy trình:
// 1. Lấy token
// 2. Gọi POST /logout
// 3. Server revoke token
// 4. Xóa token Client
// ============================================================

export async function logout(): Promise<void> {
  const token = getToken();

  if (!token) {
    removeToken();
    return;
  }

  try {
    await logoutUser();
  } finally {
    removeToken();
  }
}