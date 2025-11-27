"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  emptyState?: React.ReactElement;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, data, emptyState, onRowClick }: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange", // Enable column resizing
  });

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-white dark:bg-[#010101] border-[#E7E7E7] dark:border-[#282828B2] text-[#4C4C4C] dark:text-[#4C4C4C]"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="p-3 md:p-4 lg:p-6 text-xs md:text-sm"
                    style={{ width: header.getSize() }} // Apply dynamic width
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="bg-white dark:bg-[#010101] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0a0a0a] transition-colors"
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="p-3 md:p-4 lg:p-6 border-[#E7E7E7] dark:border-[#282828B2] border-b-[0.5px] text-xs md:text-sm"
                    style={{ width: cell.column.getSize() }} // Apply dynamic width
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="p-0">
              <TableCell colSpan={columns.length} className="p-0">
                {emptyState || (
                  <div className="h-24 text-center flex items-center justify-center text-sm md:text-base">
                    No results.
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}