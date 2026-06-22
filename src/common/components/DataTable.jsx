// Reusable table component
// Desktop: classic table layout
// Mobile: card layout (one card per row) for better UX
//
// Props:
//   columns : [{ key, title, dataIndex?, render?, hideOnMobile? }]
//   data    : array of row objects
const DataTable = ({ columns, data }) => {
  // Separate action column from data columns for mobile card layout
  const dataColumns = columns.filter((c) => c.key !== "actions");
  const actionColumn = columns.find((c) => c.key === "actions");

  return (
    <>
      {/* ════════════════════════════════
          DESKTOP — classic table (md+)
          ════════════════════════════════ */}
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-primary-100">
        <table className="w-full text-sm" dir="rtl">
          <thead>
            <tr className="bg-primary-50 border-b border-primary-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-right text-primary-600 font-medium px-5 py-3.5 whitespace-nowrap"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-primary-50">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className="hover:bg-primary-50/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-5 py-3.5 text-primary-800 whitespace-nowrap"
                  >
                    {col.render ? col.render(row) : row[col.dataIndex] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ════════════════════════════════
          MOBILE — card list (below md)
          ════════════════════════════════ */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((row, rowIndex) => (
          <div
            key={row.id ?? rowIndex}
            className="bg-white rounded-2xl border border-primary-100 px-4 py-4 flex flex-col gap-3"
          >
            {/* Data rows inside card */}
            <div className="flex flex-col gap-2">
              {dataColumns.map((col) => {
                const value = col.render
                  ? col.render(row)
                  : row[col.dataIndex] ?? "—";
                return (
                  <div
                    key={col.key}
                    className="flex items-start justify-between gap-3"
                  >
                    {/* Column label */}
                    <span className="text-primary-400 text-xs shrink-0 pt-0.5">
                      {col.title}
                    </span>
                    {/* Column value */}
                    <span className="text-primary-800 text-sm text-left">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action buttons at the bottom of each card */}
            {actionColumn && (
              <div className="pt-3 border-t border-primary-50">
                {actionColumn.render(row)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default DataTable;
