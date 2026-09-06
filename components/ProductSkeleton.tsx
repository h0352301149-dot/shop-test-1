"use client";

export default function ProductSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-xs">
        <thead className="border-b border-slate-200/80 bg-slate-50/80">
          <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <th className="px-6 py-4">Sản phẩm</th>
            <th className="px-6 py-4">SKU / ID</th>
            <th className="px-6 py-4">Danh mục</th>
            <th className="px-6 py-4">Trạng thái</th>
            <th className="px-6 py-4">Giá bán</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, index) => (
            <tr key={index}>
              {/* PRODUCT */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 animate-pulse rounded-xl bg-gradient-to-br from-slate-100 to-slate-200" />

                  <div className="space-y-2">
                    <div className="h-3.5 w-32 animate-pulse rounded-md bg-slate-200" />
                    <div className="h-2.5 w-20 animate-pulse rounded-md bg-slate-100" />
                  </div>
                </div>
              </td>

              {/* ID */}
              <td className="px-6 py-4">
                <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-100" />
              </td>

              {/* CATEGORY */}
              <td className="px-6 py-4">
                <div className="h-3 w-24 animate-pulse rounded-md bg-slate-100" />
              </td>

              {/* STATUS */}
              <td className="px-6 py-4">
                <div className="h-7 w-20 animate-pulse rounded-full bg-slate-100" />
              </td>

              {/* PRICE */}
              <td className="px-6 py-4">
                <div className="h-3.5 w-28 animate-pulse rounded-md bg-slate-200" />
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-4">
                <div className="flex justify-end gap-1.5">
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}