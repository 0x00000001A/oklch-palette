import {DndContext, DragEndEvent} from '@dnd-kit/core'
import {restrictToVerticalAxis} from '@dnd-kit/modifiers'
import {SortableContext, arrayMove, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {Table} from 'antd'
import {TableRef} from 'antd/es/table'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'

import {useColorsStore} from '../../state'
import {arrayCompare} from '../../utils/compare.ts'

import PaletteCell from './Cell.tsx'
import PaletteCellRemoveColumn from './CellRemoveColumn.tsx'
import CellRemoveRow from './CellRemoveRow.tsx'
import PaletteColumnNameCell from './ColumnNameCell.tsx'
import {buildDataSource} from './helpers.ts'
import PaletteRow from './Row.tsx'
import PaletteRowNameCell from './RowNameCell.tsx'
import {useTableStyles} from './styles.ts'
import {PaletteRowData} from './types.ts'

const Palette = () => {
  const {styles} = useTableStyles()
  const tableRef = useRef<TableRef>(null)

  const [tableHeight, setTableHeight] = useState(600)
  const rows = useColorsStore((state) => state.rows, arrayCompare)
  const columns = useColorsStore((state) => state.columns, arrayCompare)
  const [tableWidth, setTableWidth] = useState(600)
  const [dataSource, setDataSource] = useState(buildDataSource(rows))
  const removeColumn = useColorsStore((state) => state.removeColumn)
  const removeRow = useColorsStore((state) => state.removeRow)
  const swapRows = useColorsStore((state) => state.swapRows)

  const handleRowRemove = useCallback(
    (rowId: string) => {
      const newRows = rows.filter((row) => row.id !== rowId)

      removeRow(rowId)
      setDataSource(buildDataSource(newRows))
    },
    [removeRow, rows]
  )

  const handleColumnRemove = useCallback(
    (rowId: string) => {
      const newColumns = rows.filter((row) => row.id !== rowId)

      removeColumn(rowId)
      setDataSource(buildDataSource(newColumns))
    },
    [removeColumn, rows]
  )

  const tableColumns = useMemo(() => {
    return [
      {
        fixed: 'left' as never,
        key: 'first-column',
        render: (_: string, data: PaletteRowData) => {
          return <PaletteRowNameCell row={data} />
        },
        title: ''
      },
      ...columns.map((column, colIndex) => {
        return {
          dataIndex: 'value',
          key: column.id,
          render: (_: string, data: PaletteRowData) => {
            return <PaletteCell colIndex={colIndex} rowId={data.key} />
          },
          title: () => {
            return <PaletteColumnNameCell colIndex={colIndex} column={column} />
          },
          width: 64
        }
      }),
      {
        fixed: 'right' as never,
        key: 'last-column',
        render: (_: string, data: PaletteRowData) => {
          return <CellRemoveRow rowId={data.key} onRemove={handleRowRemove} />
        },
        width: '100%'
      }
    ]
  }, [columns, handleRowRemove])

  const handleWindowResized = useCallback(() => {
    const node = tableRef.current?.nativeElement

    if (!node) {
      return
    }

    const {left, top} = node.getBoundingClientRect()

    // normally TABLE_HEADER_HEIGHT would be 55.
    setTableHeight(window.innerHeight - top - 41 - 39)
    setTableWidth(window.innerHeight - left)
  }, [])

  const initTableHeightHandler = useCallback(() => {
    handleWindowResized()

    window.addEventListener('resize', handleWindowResized)

    return () => {
      window.removeEventListener('resize', handleWindowResized)
    }
  }, [handleWindowResized])

  const handleRowReorder = useCallback(
    ({active, over}: DragEndEvent) => {
      if (!over) {
        return
      }

      const activeIndex = dataSource.findIndex((record) => record.key === active?.id)
      const overIndex = dataSource.findIndex((record) => record.key === over?.id)

      const result = arrayMove(dataSource, activeIndex, overIndex)

      swapRows(activeIndex, overIndex)
      setDataSource(result as never)
    },
    [dataSource, swapRows]
  )

  const sortableContextItems = useMemo(() => {
    return dataSource.map((i) => i.key)
  }, [dataSource])

  const summaryColumnsElement = useMemo(() => {
    return tableColumns.map((column, columnIndex) => (
      <Table.Summary.Cell align={'center'} index={columnIndex} key={columnIndex}>
        <PaletteCellRemoveColumn columnId={column.key} onRemove={handleColumnRemove} />
      </Table.Summary.Cell>
    ))
  }, [handleColumnRemove, tableColumns])

  const renderSummaryElement = useCallback(() => {
    return (
      <Table.Summary fixed={'bottom'}>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} />
          {summaryColumnsElement}
          <Table.Summary.Cell index={tableColumns.length} />
        </Table.Summary.Row>
      </Table.Summary>
    )
  }, [summaryColumnsElement, tableColumns.length])

  useEffect(initTableHeightHandler, [initTableHeightHandler])

  const handleRowsChanged = useCallback(() => {
    setDataSource(buildDataSource(rows))
  }, [rows])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleRowsChanged, [rows])

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleRowReorder}>
      <SortableContext
        items={sortableContextItems}
        strategy={verticalListSortingStrategy}
      >
        <Table<PaletteRowData>
          className={styles.root}
          columns={tableColumns as never}
          components={{body: {row: PaletteRow}}}
          dataSource={dataSource}
          pagination={false}
          ref={tableRef}
          scroll={{x: tableWidth, y: tableHeight}}
          size={'small'}
          sticky={true}
          summary={renderSummaryElement}
          tableLayout={'auto'}
        />
      </SortableContext>
    </DndContext>
  )
}

export default Palette
