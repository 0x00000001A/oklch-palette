import type {DragEndEvent} from '@dnd-kit/core'
import {DndContext} from '@dnd-kit/core'
import {restrictToVerticalAxis} from '@dnd-kit/modifiers'
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {observer} from 'mobx-react-lite'
import {useCallback} from 'react'

import {palette} from '../../main.tsx'
import {PaletteStore} from '../../store/PaletteStore.ts'

import ColorCell from './Cell.tsx'
import CellRemoveColumn from './CellRemoveColumn.tsx'
import CellRemoveRow from './CellRemoveRow.tsx'
import ColumnNameCell from './ColumnNameCell.tsx'
import Row from './Row.tsx'
import RowNameCell from './RowNameCell.tsx'
import {useTableStyles} from './styles.ts'

const ColorPalette = observer(
  ({palette: {columns, rows, swapRows}}: {palette: PaletteStore}) => {
    const {styles} = useTableStyles()

    const onDragEnd = useCallback(
      ({active, over}: DragEndEvent) => {
        if (!over || active.id === over?.id) {
          return
        }

        swapRows(active.id.toString(), over.id.toString())
      },
      [swapRows]
    )

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
              {
                <thead>
                  <tr className={styles.tableRowHead}>
                    <th className={styles.tableColNameCell} />
                    {columns.map((col) => (
                      <th className={styles.tableColNameCell} key={col.id}>
                        <ColumnNameCell column={col} />
                      </th>
                    ))}
                    <td className={styles.tableColNameCell} />
                  </tr>
                </thead>
              }
              <tbody>
                {rows.map((row, rowIndex) => (
                  <Row data-row-key={row.id} key={row.id}>
                    <td className={styles.tableRowNameCell}>
                      <RowNameCell row={row} />
                    </td>
                    {columns.map((column, colIndex) => (
                      <td className={styles.tableCell} key={column.id}>
                        <ColorCell
                          colIndex={colIndex}
                          palette={palette}
                          rowIndex={rowIndex}
                        />
                      </td>
                    ))}
                    <td className={styles.tableRowActionCell}>
                      {rows.length > 1 && <CellRemoveRow row={row} />}
                    </td>
                  </Row>
                ))}
                {
                  <tr className={styles.tableRowFooter}>
                    <td></td>
                    {columns.map((column) => (
                      <td className={styles.tableColumnRemoveCell} key={column.id}>
                        {columns.length > 1 && <CellRemoveColumn column={column} />}
                      </td>
                    ))}
                    <td></td>
                  </tr>
                }
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
    )
  }
)

export default ColorPalette
