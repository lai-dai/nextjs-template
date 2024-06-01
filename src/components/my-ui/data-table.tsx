'use client'

import * as React from 'react'
import {
  ColumnOrderState,
  flexRender,
  getCoreRowModel,
  Header,
  RowData,
  TableOptions,
  Table as TableType,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useAtom, useAtomValue } from 'jotai'
import _ from 'lodash'

import { tableColumnAtom } from '@/lib/atom/table-columns'
import { PAGE_SIZE_OPTIONS } from '@/lib/constants'
import { arrayMove, cn } from '@/lib/utils'
import { PageSize } from '@/lib/validations/common'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/my-ui/spinner'

import { Icons, iconVariants } from '../icons'
import { Button, buttonVariants } from '../ui/button'

export type DataTableType<T> = TableType<T>

interface DataTableProps<TData>
  extends Omit<TableOptions<TData>, 'getCoreRowModel'> {
  status?: 'error' | 'success' | 'pending'
  isLoading?: boolean
  isPending?: boolean
  isError?: boolean
  isFetching?: boolean
  error?: any
  renderExpanded?: React.ReactNode | ((row: RowData) => React.ReactNode)
  renderError?: React.ReactNode | ((error?: any) => React.ReactNode)
  renderLoading?: React.ReactNode | (() => React.ReactNode)
  renderEmpty?: React.ReactNode | (() => React.ReactNode)
  setApi?: (api: TableType<TData>) => void
  headerDropdownEnabled?: boolean
  tableProps?: React.HTMLAttributes<HTMLTableElement>
  tableHeaderProps?: React.HTMLAttributes<HTMLTableSectionElement>
  tableRowProps?: React.HTMLAttributes<HTMLTableRowElement>
  tableHeadProps?: React.ThHTMLAttributes<HTMLTableCellElement>
  tableBodyProps?: React.HTMLAttributes<HTMLTableSectionElement>
  tableCellProps?: React.ThHTMLAttributes<HTMLTableCellElement>
}

export function DataTable<TData>({
  setApi,
  status,
  isLoading,
  isPending,
  isError,
  isFetching,
  error,
  renderExpanded,
  renderError,
  renderLoading,
  renderEmpty,
  headerDropdownEnabled = false,
  tableProps,
  tableHeaderProps,
  tableRowProps,
  tableHeadProps,
  tableBodyProps,
  tableCellProps,
  ...props
}: DataTableProps<TData>) {
  const table = useReactTable({
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    ...props,
    getCoreRowModel: getCoreRowModel(),
  })

  React.useEffect(() => {
    if (setApi && setApi instanceof Function) {
      setApi(table)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setApi])

  return (
    <Table {...tableProps}>
      <TableHeader {...tableHeaderProps}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} {...tableRowProps}>
            {headerGroup.headers.map((header) => {
              const sticky = _.get(header.column.columnDef.meta, 'sticky')
              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  {...tableHeadProps}
                  style={Object.assign(
                    {
                      width:
                        header.getSize() === Number.MAX_SAFE_INTEGER
                          ? 'auto'
                          : header.getSize(),
                      minWidth:
                        header.column.columnDef.minSize ===
                        Number.MAX_SAFE_INTEGER
                          ? 0
                          : header.column.columnDef.minSize,
                      maxWidth:
                        header.column.columnDef.maxSize ===
                        Number.MAX_SAFE_INTEGER
                          ? 'none'
                          : header.column.columnDef.maxSize,
                    },
                    _.get(header.column.columnDef.meta, 'style', {}),
                    tableHeadProps?.style || {}
                  )}
                  className={cn(
                    'break-words bg-muted',
                    _.get(header.column.columnDef.meta, 'className'),
                    {
                      'sticky z-10 bg-muted': sticky,
                      'right-0 text-end': sticky === 'right',
                      'left-0': sticky === 'left',
                    },
                    tableHeadProps?.className
                  )}
                >
                  <TableHeaderDropdown
                    headerApi={header}
                    tableApi={table}
                    enabled={headerDropdownEnabled}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHeaderDropdown>
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody {...tableBodyProps}>
        {status === 'pending' || isLoading || isPending ? (
          <TableRow {...tableRowProps}>
            <TableCell
              colSpan={props.columns.length}
              {...tableCellProps}
              className="h-24"
            >
              {renderLoading instanceof Function
                ? renderLoading()
                : renderLoading || (
                    <div className="grid place-content-center">
                      <Spinner />
                    </div>
                  )}
            </TableCell>
          </TableRow>
        ) : status === 'error' || isError ? (
          <TableRow {...tableRowProps}>
            <TableCell
              colSpan={props.columns.length}
              {...tableCellProps}
              className="h-24"
            >
              {renderError instanceof Function
                ? renderError(error)
                : renderError || (
                    <div className="text-center">{error?.message}</div>
                  )}
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          <Spinner isSpinning={isFetching}>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  {...tableRowProps}
                >
                  {row.getVisibleCells().map((cell) => {
                    const sticky = _.get(cell.column.columnDef.meta, 'sticky')
                    return (
                      <TableCell
                        key={cell.id}
                        {...tableCellProps}
                        style={Object.assign(
                          {
                            width:
                              cell.column.getSize() === Number.MAX_SAFE_INTEGER
                                ? 'auto'
                                : cell.column.getSize(),
                            minWidth:
                              cell.column.columnDef.minSize ===
                              Number.MAX_SAFE_INTEGER
                                ? 0
                                : cell.column.columnDef.minSize,
                            maxWidth:
                              cell.column.columnDef.maxSize ===
                              Number.MAX_SAFE_INTEGER
                                ? 'none'
                                : cell.column.columnDef.maxSize,
                          },
                          _.get(cell.column.columnDef.meta, 'style', {}),
                          tableCellProps?.style || {}
                        )}
                        className={cn(
                          'break-words',
                          _.get(cell.column.columnDef.meta, 'className'),
                          {
                            'bg-content1 dark:bg-content2 sticky z-10': sticky,
                            'right-0': sticky === 'right',
                            'left-0': sticky === 'left',
                          },
                          tableCellProps?.className
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>

                {row.getIsExpanded() && (
                  <TableRow {...tableRowProps}>
                    <TableCell
                      colSpan={row.getVisibleCells().length}
                      {...tableCellProps}
                    >
                      {renderExpanded && renderExpanded instanceof Function
                        ? renderExpanded(row)
                        : null}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </Spinner>
        ) : (
          <TableRow {...tableRowProps}>
            <TableCell
              colSpan={props.columns.length}
              {...tableCellProps}
              className="h-24"
            >
              {renderEmpty instanceof Function
                ? renderEmpty()
                : renderEmpty || <div className="text-center">No results.</div>}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export function TableRowsPerPage(props: {
  pageSize?: number
  onPageSizeChange?: (pageSize: PageSize) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={cn(
            buttonVariants({
              variant: 'link',
              className: 'text-sm text-gray-500',
            })
          )}
        >
          <p>
            {'Số hàng'}: {props.pageSize}
          </p>
          <Icons.ChevronDown className={cn(iconVariants({ size: 'sm' }))} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{'Kích thước'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={`${props.pageSize}`}
          onValueChange={(v) =>
            props.onPageSizeChange?.(_.toNumber(v) as PageSize)
          }
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <DropdownMenuRadioItem
              key={size}
              value={`${size}`}
              className="capitalize"
            >
              {size}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TableVisibleColumns<TData = any>(props: {
  tableApi?: TableType<TData>
}) {
  const tableColumn = useAtomValue(tableColumnAtom)

  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([])

  React.useEffect(() => {
    if (props.tableApi) {
      setSelectedKeys(
        props.tableApi
          .getAllLeafColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' &&
              column.getCanHide() &&
              column.getIsVisible()
          )
          .map((column) => column.id)
      )
    }
  }, [props.tableApi, tableColumn])

  const handleChecked = (value: string) => {
    return selectedKeys.includes(value)
  }

  if (!props.tableApi) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={cn(
            buttonVariants({
              variant: 'link',
              className: 'text-sm text-gray-500',
            })
          )}
        >
          <p>{'Ẩn/Hiện cột'}</p>
          <Icons.ChevronDown className={cn(iconVariants({ size: 'sm' }))} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{'Cột'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup>
          {props.tableApi
            .getAllLeafColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={handleChecked(column.id)}
                onCheckedChange={(v) => column.toggleVisibility(v)}
                className="capitalize"
              >
                {column.columnDef.header as any}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function useDataTableProps<TData = any>(props: {
  key: string
  defaultValue?: {
    visibility?: VisibilityState
    columnOrder?: ColumnOrderState
  }
}): Omit<TableOptions<TData>, 'getCoreRowModel' | 'data' | 'columns'> {
  const [tableColumn, setTableColumn] = useAtom(tableColumnAtom)

  return {
    state: {
      columnVisibility: _.get(
        tableColumn,
        `${props.key}.visibility`,
        props.defaultValue?.visibility || {}
      ) as VisibilityState,
      columnOrder: _.get(
        tableColumn,
        `${props.key}.order`,
        props.defaultValue?.columnOrder || []
      ) as ColumnOrderState,
    },
    onColumnVisibilityChange: (v) => {
      const result =
        v instanceof Function
          ? v(
              _.get(
                tableColumn,
                `${props.key}.visibility`,
                props.defaultValue?.visibility
              ) as VisibilityState
            )
          : v
      setTableColumn(
        props.key,
        Object.assign({}, props.defaultValue?.visibility, result),
        undefined
      )
    },
    onColumnOrderChange: (v) => {
      setTableColumn(props.key, undefined, v)
    },
  }
}

export function TableInfo(props: {
  page: number
  limit: number
  total?: number
}) {
  const total = props?.total || 0
  return (
    <div className="px-2 text-sm">
      {total ? (props.page - 1) * props.limit || 1 : 0} -{' '}
      {props.page * props.limit > total ? total : props.page * props.limit}{' '}
      {'trên'} {total} {'mục'}
    </div>
  )
}

export function TablePagination(props: {
  page: number
  limit: number
  total?: number
  onPageChange?: (page: number) => void
}) {
  const totalPages = Math.ceil(Number(props?.total || 0) / Number(props.limit))

  return (
    <div className="flex items-center gap-3 px-2">
      <div className="text-sm">
        {props.total ? props.page : 0} {'trên'} {totalPages}
      </div>
      <div className="flex gap-1">
        <Button
          disabled={props.page === 1}
          onClick={() => {
            const page = props.page - 1
            props.onPageChange?.(page <= 0 ? 1 : page)
          }}
          size={'icon'}
          variant="ghost"
        >
          <Icons.ArrowLeft />
        </Button>
        <Button
          disabled={totalPages === 0 || props.page === totalPages}
          onClick={() => {
            const page = props.page + 1
            props.onPageChange?.(page <= 0 ? 1 : page)
          }}
          size={'icon'}
          variant="ghost"
        >
          <Icons.ArrowRight />
        </Button>
      </div>
    </div>
  )
}

export function TableHeaderDropdown<TData = any>({
  enabled = true,
  ...props
}: React.PropsWithChildren<{
  headerApi: Header<TData, unknown>
  tableApi: TableType<TData>
  enabled?: boolean
}>) {
  const handleColumnOrder = (value: number) => {
    const columnIdArr = props.tableApi.getAllLeafColumns().map((c) => c.id)

    const targetIndex = columnIdArr.findIndex((e) => e === props.headerApi.id)

    const newColumnOrder = arrayMove(
      columnIdArr,
      targetIndex,
      targetIndex + value
    )
    props.tableApi.setColumnOrder(newColumnOrder)
  }

  if (
    !props.headerApi.column.getCanSort() &&
    !props.headerApi.column.getCanHide() &&
    !enabled
  )
    return props.children

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="group flex items-center">
          {props.children}
          <Icons.ChevronDown className="invisible ml-1 size-4 group-hover:visible" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {props.headerApi.column.getCanSort() && (
          <DropdownMenuItem
            key="move_left"
            onClick={() => handleColumnOrder(-1)}
          >
            <Icons.ArrowLeft
              className={iconVariants({ size: 'sm', className: 'mr-2' })}
            />
            {'Sang trái'}
          </DropdownMenuItem>
        )}
        {props.headerApi.column.getCanSort() && (
          <DropdownMenuItem
            key="move_right"
            onClick={() => handleColumnOrder(1)}
          >
            <Icons.ArrowRight
              className={iconVariants({ size: 'sm', className: 'mr-2' })}
            />
            {'Sang phải'}
          </DropdownMenuItem>
        )}
        {props.headerApi.column.getCanHide() &&
          ((
            <DropdownMenuItem
              key="hide_column"
              onClick={() => {
                props.headerApi.column.toggleVisibility()
              }}
            >
              <Icons.EyeOff
                className={iconVariants({ size: 'sm', className: 'mr-2' })}
              />
              {'Ẩn cột'}
            </DropdownMenuItem>
          ) as any)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
