import React from "react";
import { TableProps, Column } from "@/src/types/types";

// Table component to display data in tabular format
export default function Table<T>({
  columns, // Column definitions
  data, // Data array
  renderRow, // Function to render each row
  emptyMessage = "No data found", // Message when there's no data
  className = "", // Additional CSS classes
}: TableProps<T>) {
  return (
    <div
      className={`overflow-x-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg ${className}`}
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-zinc-800">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-400 ${
                  column.className || ""
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={(item as any).id || index}
                className="border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                {renderRow(item, index)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
