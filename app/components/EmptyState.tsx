// ============================================================
// FILE: components/EmptyState.tsx
// MỤC ĐÍCH:
// - Hiển thị giao diện khi danh sách sản phẩm rỗng
// - Dùng cho filter: con_hang / het_hang / ngung_ban
// - Không để bảng trắng trơn khi API trả về []
// - UI thân thiện, hiện đại và dễ hiểu
// ============================================================

interface EmptyStateProps {
  status?: string;
}

// ------------------------------------------------------------
// Tên trạng thái hiển thị cho người dùng
// ------------------------------------------------------------
const statusLabels: Record<string, string> = {
  con_hang: "còn hàng",
  het_hang: "hết hàng",
  ngung_ban: "ngừng bán",
};

export default function EmptyState({
  status,
}: EmptyStateProps) {
  const statusText = status
    ? statusLabels[status] ?? "trạng thái này"
    : "trạng thái đã chọn";

  return (
    <div className="flex min-h-[360px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 shadow-sm">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* ----------------------------------------------------
            Icon
        ---------------------------------------------------- */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-10 w-10 text-indigo-500"
            aria-hidden="true"
          >
            <path
              d="M6.5 7.5h11M6.5 11.5h7M5 4.5h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z"
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
          Chưa có sản phẩm
        </h3>

        {/* ----------------------------------------------------
            Description
        ---------------------------------------------------- */}
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Hiện chưa tìm thấy sản phẩm nào thuộc trạng thái{" "}
          <span className="font-semibold text-slate-700">
            {statusText}
          </span>
          .
        </p>

        {/* ----------------------------------------------------
            Hint
        ---------------------------------------------------- */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          Hãy thử chọn trạng thái khác
        </div>
      </div>
    </div>
  );
}