import type { ReactNode } from "react";

import { classNames } from "../../lib/utils";

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Array<Column<T>>;
  getRowKey: (row: T) => string;
  selectedRowId?: string;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
}

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  onRowClick,
  selectedRowId,
  emptyState
}: DataTableProps<T>) {
  if (!rows.length) {
    return <>{emptyState ?? null}</>;
  }

  return (
    <div className="table-shell">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rowId = getRowKey(row);
            return (
              <tr
                key={rowId}
                className={classNames(
                  "data-table__row",
                  selectedRowId === rowId && "data-table__row--selected",
                  onRowClick && "data-table__row--interactive"
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
