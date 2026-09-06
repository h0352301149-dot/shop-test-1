// ============================================================
// FILE: types/index.ts
// MỤC ĐÍCH:
// - Định nghĩa TypeScript types dùng chung cho toàn bộ website
// - Tránh viết type lặp lại ở nhiều Component
// - Giúp code an toàn và dễ giải thích khi phỏng vấn
// ============================================================

// ------------------------------------------------------------
// USER
// Dữ liệu người dùng được API /login và /me trả về
// ------------------------------------------------------------
export interface User {
  id: string;
  email: string;
}

// ------------------------------------------------------------
// LOGIN RESPONSE
// Response thành công từ POST /login
// ------------------------------------------------------------
export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: User;
}

// ------------------------------------------------------------
// REGISTER RESPONSE
// API có thể trả về dữ liệu khác nhau tùy server.
// Vì vậy phần response được để linh hoạt.
// ------------------------------------------------------------
export interface RegisterResponse {
  message?: string;
  user?: User;
}

// ------------------------------------------------------------
// PRODUCT STATUS
// Chỉ cho phép đúng 3 trạng thái mà API cung cấp.
// ------------------------------------------------------------
export type ProductStatus =
  | "con_hang"
  | "het_hang"
  | "ngung_ban";

// ------------------------------------------------------------
// PRODUCT
// Cấu trúc sản phẩm.
// Một số API có thể trả thêm field nên chúng ta giữ các
// field phổ biến và cho phép mở rộng bằng index signature.
// ------------------------------------------------------------
export interface Product {
  id: string | number;
  name: string;
  status: ProductStatus;
  [key: string]: unknown;
}

// ------------------------------------------------------------
// API ERROR
// Chuẩn hóa lỗi API để UI có thể hiển thị thông báo rõ ràng.
// Ví dụ:
// 400 → Dữ liệu không hợp lệ
// 401 → Email hoặc mật khẩu không chính xác
// 409 → Email đã tồn tại
// ------------------------------------------------------------
export interface ApiError {
  status: number;
  message: string;
}