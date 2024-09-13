import type {DragEndEvent} from '@dnd-kit/core'
import {DndContext} from '@dnd-kit/core'
import {restrictToVerticalAxis} from '@dnd-kit/modifiers'
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {useCallback, useMemo} from 'react'

import {useColorsStore} from '../../state'
import useColorStore from '../../state/store.ts'
import {arrayCompare} from '../../utils/compare.ts'

import ColorCell from './Cell.tsx'
import CellRemoveColumn from './CellRemoveColumn.tsx'
import CellRemoveRow from './CellRemoveRow.tsx'
import ColumnNameCell from './ColumnNameCell.tsx'
import Row from './Row.tsx'
import RowNameCell from './RowNameCell.tsx'
import {useTableStyles} from './styles.ts'

const ColorPalette = () => {
  const {styles} = useTableStyles()

  const rows = useColorsStore((state) => state.rows, arrayCompare)
  const columns = useColorsStore((state) => state.columns, arrayCompare)

  const removeColumn = useColorsStore((state) => state.removeColumn)
  const removeRow = useColorsStore((state) => state.removeRow)
  const swapRows = useColorStore((state) => state.swapRows)

  const handleRowRemove = useCallback(
    (rowId: string) => {
      removeRow(rowId)
    },
    [removeRow]
  )

  const handleColumnRemove = useCallback(
    (columnId: string) => {
      removeColumn(columnId)
    },
    [removeColumn]
  )

  const onDragEnd = useCallback(
    ({active, over}: DragEndEvent) => {
      if (active.id === over?.id) {
        return
      }
      const activeIndex = rows.findIndex((record) => record.id === active?.id)
      const overIndex = rows.findIndex((record) => record.id === over?.id)

      swapRows(activeIndex, overIndex)
    },
    [rows, swapRows]
  )

  const tableHead = useMemo(() => {
    return (
      <thead>
        <tr className={styles.tableRowHead}>
          <th className={styles.tableColNameCell} />
          {columns.map((col, colIndex) => (
            <th className={styles.tableColNameCell} key={col.id}>
              <ColumnNameCell colIndex={colIndex} column={col} />
            </th>
          ))}
          <td className={styles.tableColNameCell} />
        </tr>
      </thead>
    )
  }, [columns, styles.tableColNameCell, styles.tableRowHead])

  const tableBody = useMemo(() => {
    return rows.map((row, rowIndex) => (
      <Row data-row-key={row.id} key={row.id}>
        <td className={styles.tableRowNameCell}>
          <RowNameCell row={row} rowIndex={rowIndex} />
        </td>
        {columns.map((column, colIndex) => (
          <td className={styles.tableCell} key={column.id}>
            <ColorCell colIndex={colIndex} rowIndex={rowIndex} />
          </td>
        ))}
        <td className={styles.tableRowActionCell}>
          {rows.length > 1 && <CellRemoveRow rowId={row.id} onRemove={handleRowRemove} />}
        </td>
      </Row>
    ))
  }, [
    columns,
    handleRowRemove,
    rows,
    styles.tableCell,
    styles.tableRowActionCell,
    styles.tableRowNameCell
  ])

  const tableFooter = useMemo(() => {
    return (
      <tr className={styles.tableRowFooter}>
        <td></td>
        {columns.map((column) => (
          <td className={styles.tableColumnRemoveCell} key={column.id}>
            {columns.length > 1 && (
              <CellRemoveColumn columnId={column.id} onRemove={handleColumnRemove} />
            )}
          </td>
        ))}
        <td></td>
      </tr>
    )
  }, [columns, handleColumnRemove, styles.tableColumnRemoveCell, styles.tableRowFooter])

  return (
    <div className={styles.root}>
      <DndContext
        autoScroll={{enabled: false, layoutShiftCompensation: false}}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={rows.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <table className={styles.table}>
            {tableHead}
            <tbody>
              {tableBody}
              {tableFooter}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default ColorPalette
