// ============================================================
// FILE: app/layout.tsx
// ============================================================

import type { Metadata } from "next";

import "./globals.css";

/*
 * NOTE:
 * Metadata dùng để thiết lập thông tin cơ bản cho website.
 *
 * title:
 *   Tên hiển thị trên tab trình duyệt.
 *
 * description:
 *   Mô tả ngắn cho ứng dụng, có thể được sử dụng
 *   bởi công cụ tìm kiếm.
 *
 * Metadata được Next.js xử lý ở phía framework,
 * không cần tự thao tác với document.head.
 */

export const metadata: Metadata = {
  title: "Shop Manager",
  description:
    "Product management application",
};

/*
 * NOTE:
 * RootLayout là layout gốc của toàn bộ ứng dụng Next.js.
 *
 * Tất cả các page trong thư mục app/
 * đều được render bên trong {children}.
 *
 * Ví dụ:
 *
 * /login
 * /register
 * /products
 *
 * đều sử dụng RootLayout này.
 */

export default function RootLayout({
  children,
}: Readonly<{
  /*
   * NOTE:
   * children là nội dung của route hiện tại.
   *
   * Readonly giúp TypeScript đảm bảo object props này
   * không bị thay đổi ngoài ý muốn.
   */
  children: React.ReactNode;
}>) {
  return (
    /*
     * NOTE:
     * lang="vi" khai báo ngôn ngữ chính của website
     * là tiếng Việt.
     *
     * Điều này tốt cho:
     * - Accessibility
     * - Screen reader
     * - SEO
     */
    <html lang="vi">

      {/*
       * NOTE:
       * globals.css chứa CSS dùng chung cho toàn bộ ứng dụng.
       *
       * Vì import ở RootLayout nên các page
       * đều có thể sử dụng global styles.
       */}

      <body>{children}</body>

    </html>
  );
}