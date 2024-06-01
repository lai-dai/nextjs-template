import {
  ColumnOrderState,
  TableOptions,
  Updater,
  VisibilityState,
} from '@tanstack/react-table'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import _ from 'lodash'

type Column = {
  visibility: Updater<VisibilityState>
  order: Updater<ColumnOrderState>
}

const tableColAtom = atomWithStorage<Record<string, Column>>(
  'table-columns-cache',
  {}
)

export const tableColumnAtom = atom(
  (get) => get(tableColAtom),
  (
    get,
    set,
    key: string,
    visibility?: Column['visibility'],
    order?: Column['order']
  ) => {
    const tableColPrev = _.get(get(tableColAtom), 'key')
    const newVisibility =
      visibility instanceof Function
        ? visibility(_.get(tableColPrev, 'visibility') as VisibilityState)
        : visibility
    const newOrder =
      order instanceof Function
        ? order(_.get(tableColPrev, 'order') as ColumnOrderState)
        : order

    set(tableColAtom, (prev) => {
      return {
        ...prev,
        [key]: {
          visibility: Object.assign(
            {},
            _.get(prev, `${key}.visibility`, {}),
            newVisibility || {}
          ) as Column['visibility'],
          order: (newOrder ||
            _.get(prev, `${key}.order`, [])) as Column['order'],
        },
      }
    })
  }
)

export function useReactTableProps<TData = any>(props: {
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
