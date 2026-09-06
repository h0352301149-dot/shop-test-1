// ============================================================
// FILE: components/ErrorState.tsx
// MỤC ĐÍCH:
// - Hiển thị giao diện lỗi khi gọi API thất bại
// - Hỗ trợ trường hợp mất mạng / Offline
// - Có nút "Thử lại"
// - UI rõ ràng, chuyên nghiệp
// ============================================================

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  const displayMessage =
    message || "Không thể tải dữ liệu. Vui lòng thử lại.";

  return (
    <div className="flex min-h-[360px] w-full items-center justify-center rounded-2xl border border-red-100 bg-white px-6 py-12 shadow-sm">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* ----------------------------------------------------
            Error Icon
        ---------------------------------------------------- */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-10 w-10 text-red-500"
            aria-hidden="true"
          >
            <path
              d="M12 8v4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M12 16h.01"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <path
              d="M10.3 4.6 3.7 16a2 2 0 0 0 1.73 3h13.14a2 2 0 0 0 1.73-3L13.7 4.6a2 2 0 0 0-3.4 0Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* ----------------------------------------------------
            Title
        ---------------------------------------------------- */}
        <h3 className="text-xl font-bold tracking-tight text-slate-900">
          Không thể tải dữ liệu
        </h3>

        {/* ----------------------------------------------------
            Error message
        ---------------------------------------------------- */}
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {displayMessage}
        </p>

        {/* ----------------------------------------------------
            Offline hint
        ---------------------------------------------------- */}
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Kiểm tra kết nối mạng hoặc máy chủ API.
        </div>

        {/* ----------------------------------------------------
            Retry button
        ---------------------------------------------------- */}
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:translate-y-0"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M20 11a8.1 8.1 0 0 0-14.9-4M4 5v4h4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M4 13a8.1 8.1 0 0 0 14.9 4M20 19v-4h-4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          Thử lại
        </button>
      </div>
    </div>
  );
}