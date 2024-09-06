import {DeleteOutlined, HolderOutlined} from '@ant-design/icons'
import {DndContext} from '@dnd-kit/core'
import type {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities'
import {restrictToVerticalAxis} from '@dnd-kit/modifiers'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {Button, Input, Space, Table} from 'antd'
import {createStyles, css} from 'antd-style'
import {TableRef} from 'antd/es/table'
import {
  CSSProperties,
  FC,
  HTMLAttributes,
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import {useColorsStore} from '../../state'
import {arrayCompare} from '../../utils/compare.ts'

type DataType = Record<string, number | string>

interface RowContextProps {
  listeners?: SyntheticListenerMap
  setActivatorNodeRef?: (element: HTMLElement | null) => void
}

interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

const RowContext = createContext<RowContextProps>({})

const DragHandle: FC = () => {
  const {listeners, setActivatorNodeRef} = useContext(RowContext)
  return (
    <Button
      icon={<HolderOutlined />}
      ref={setActivatorNodeRef}
      size="small"
      style={{cursor: 'move'}}
      type="text"
      {...listeners}
    />
  )
}

const Row: FC<RowProps> = (props) => {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition
  } = useSortable({id: props['data-row-key']})

  const style: CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? {position: 'relative', zIndex: 9999} : {})
  }

  const contextValue = useMemo<RowContextProps>(
    () => ({listeners, setActivatorNodeRef}),
    [setActivatorNodeRef, listeners]
  )

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  )
}

const useStyles = createStyles(({token}) => ({
  root: css`
    .ant-table {
      border-radius: 0;
    }
    .ant-table .ant-table-container .ant-table-tbody > tr > .ant-table-cell:first-child {
      min-width: 160px;
      padding: 0 ${token.sizeXS}px;
    }
    .ant-table .ant-table-container .ant-table-tbody > tr > .ant-table-cell:last-child {
      padding: 0 ${token.sizeXS}px;
    }
    .ant-table .ant-table-container .ant-table-tbody > tr > .ant-table-cell {
      padding: 0;
      width: 64px;
      max-width: 64px;
      white-space: nowrap;
      border-width: 0;
    }
    .ant-table-summary .ant-table-cell.ant-table-cell-fix-left:first-child {
      z-index: 123;
    }
    overflow: hidden;
  `
}))

const ColorPalette = () => {
  const {styles} = useStyles()
  const tableRef = useRef<TableRef>(null)
  const rowNames = useColorsStore((state) => state.rowNames, arrayCompare)
  const colNames = useColorsStore((state) => state.colNames, arrayCompare)
  const colors = useColorsStore((state) => state.colors)
  const [tableHeight, setTableHeight] = useState(600)
  const [tableWidth, setTableWidth] = useState(600)

  const setSelectedColor = useColorsStore((state) => state.setSelectedColor)

  const handleColorClick = useCallback(
    (row: number, col: number) => {
      setSelectedColor(row, col)
    },
    [setSelectedColor]
  )

  const columns = useMemo(() => {
    return [
      {
        fixed: 'left',
        key: 'operation',
        render: (_: string, data: Record<string, string>) => {
          return (
            <Space size={'small'}>
              <DragHandle />
              <Input size={'small'} value={data.rowName} variant={'filled'} />
            </Space>
          )
        },
        title: ''
      },
      ...colNames.map((columnName, colIndex) => ({
        dataIndex: 'value',
        key: columnName,
        render: (_: string, data: Record<string, string>) => {
          return (
            <div
              style={{background: data[columnName], height: 40, width: 64}}
              onClick={() => {
                handleColorClick(data.rowIndex as never, colIndex as never)
              }}
            ></div>
          )
        },
        title: () => {
          return <Input size={'small'} value={columnName} variant={'filled'} />
        },
        width: 64
      })),
      {
        fixed: 'right',
        key: 'operation',
        render: () => {
          return <Button icon={<DeleteOutlined />} size={'small'} />
        },
        width: '100%'
      }
    ]
  }, [colNames, handleColorClick])

  const dataSource = useMemo(() => {
    const result: DataType[] = []

    rowNames.forEach((rowName, rowIndex) => {
      const entry: Record<string, number | string> = {
        key: rowName
      }

      colNames.forEach((colName, colIndex) => {
        entry[colName] = colors[rowIndex][colIndex].hex
        entry.rowName = rowName
        entry.colName = colName
        entry.rowIndex = rowIndex
      })

      result.push(entry)
    })

    return result
  }, [colNames, colors, rowNames])

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

  useLayoutEffect(initTableHeightHandler, [initTableHeightHandler])

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={console.log}>
      <SortableContext
        items={dataSource.map((i) => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          summary={() => (
            <Table.Summary fixed={'bottom'}>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} />
                {colNames.map((_, index) => (
                  <Table.Summary.Cell align={'center'} index={index} key={index}>
                    <Button icon={<DeleteOutlined />} size={'small'} />
                  </Table.Summary.Cell>
                ))}
                <Table.Summary.Cell index={colNames.length} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
          className={styles.root}
          columns={columns as never}
          components={{body: {row: Row}}}
          dataSource={dataSource}
          pagination={false}
          ref={tableRef}
          scroll={{x: tableWidth, y: tableHeight}}
          size={'small'}
          sticky={true}
          style={{width: '100%'}}
          tableLayout={'auto'}
        />
      </SortableContext>
    </DndContext>
  )
}

export default ColorPalette
