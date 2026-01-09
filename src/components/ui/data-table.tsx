"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import type { Payment } from "@/app/admin/payments/columns"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  refreshData?: () => void
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  refreshData,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({
    payment_method: false,
    userEmail: false,
    userContact: false,
    submitted_at: false,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) {
      setColumnVisibility({
        select: false,
        userName: true,
        templateName: true,
        payment_method: false,
        reference_number: false,
        notes: false,
        userEmail: false,
        userContact: false,
        templatePrice: false,
        status: true,
        submitted_at: false,
        receipt_img: false,
        actions: false,
      })
    } else {
      // On desktop: show default columns
      setColumnVisibility({
        payment_method: false,
        userEmail: false,
        userContact: false,
        submitted_at: false,
      })
    }
  }, [isMobile])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    meta: {
      refreshData,
    },
  })

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  return (
    <>
      <div>
        <div className="flex items-center py-2 md:py-4 gap-2">
          <Input
            placeholder="Search..."
            value={(table.getColumn("userName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("userName")?.setFilterValue(event.target.value)}
            className="max-w-sm text-xs md:text-sm h-8 md:h-10"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto bg-transparent text-xs md:text-sm h-8 md:h-10 px-2 md:px-4">
                Columns <ChevronDown className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-xs md:text-sm"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full overflow-x-auto rounded-md border">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs md:text-sm py-2 md:py-3 px-1 md:px-4 max-w-[100px] md:max-w-none truncate"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  const payment = row.original as Payment
                  const isExpanded = expandedRows.includes(payment.id)

                  const baseRow = (
                    <TableRow key={`row-${row.id}`} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="text-xs md:text-sm py-2 md:py-3 px-1 md:px-4 max-w-[100px] md:max-w-none truncate"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  )

                  const expandedRow = isExpanded ? (
                    <TableRow key={`expanded-${row.id}`} className="bg-gray-50">
                      <TableCell
                        colSpan={row.getVisibleCells().length + 1}
                        className="px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm text-gray-700"
                      >
                        <div className="flex flex-wrap gap-4 md:gap-8">
                          <div>
                            <strong>Template Price:</strong> ₱{payment.template?.price?.toLocaleString("en-PH") ?? "-"}
                          </div>
                          <div>
                            <strong>User Email:</strong> {payment.user?.email ?? "-"}
                          </div>
                          <div>
                            <strong>User Contact:</strong> {payment.user?.profile?.phone ?? "-"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null

                  return [baseRow, expandedRow].filter(Boolean)
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-16 md:h-24 text-center text-xs md:text-sm">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-2 md:py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-xs md:text-sm h-8 md:h-9"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-xs md:text-sm h-8 md:h-9"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}
