import {Input} from 'antd'
import {Fragment, useCallback} from 'react'

import {useColorsStore} from '../../state'
import {arrayCompare} from '../../utils/compare.ts'

import ColorCell from './ColorCell.tsx'

import './index.css'

const ColorPalette = () => {
  const rowNames = useColorsStore((state) => state.rowNames, arrayCompare)
  const colNames = useColorsStore((state) => state.colNames, arrayCompare)

  const setSelectedColor = useColorsStore((state) => state.setSelectedColor)

  const handleColorClick = useCallback(
    (row: number, col: number) => {
      setSelectedColor(row, col)
    },
    [setSelectedColor]
  )

  const cellSize = 48

  return (
    <div
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.075)',
        height: '100%',
        overflow: 'auto',
        overscrollBehavior: 'none',
        width: '100%'
      }}
    >
      <div
        style={{
          alignContent: 'start',
          display: 'inline-grid',
          gridTemplateColumns: `100px repeat(${colNames.length}, ${cellSize}px)`,
          gridTemplateRows: `max-content repeat(${rowNames.length}, ${cellSize}px)`,
          justifyContent: 'start',
          padding: '0 8px 8px 0'
        }}
      >
        <div
          style={{
            left: 0,
            position: 'sticky',
            top: 0,
            zIndex: 4
          }}
        >
          {/*  0,0 cell */}
        </div>
        {colNames.map((col) => (
          <div
            style={{
              alignItems: 'end',
              display: 'flex',
              fontSize: 12,
              justifyContent: 'center',
              lineHeight: '18px',
              padding: '8px 4px',
              position: 'sticky',
              top: 0,
              zIndex: 3
            }}
            key={col}
          >
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <Input size={'small'} value={col} variant={'filled'} />
            </span>
          </div>
        ))}
        {rowNames.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                fontSize: 12,
                left: 0,
                overflow: 'hidden',
                padding: '4px 8px 4px 8px',
                position: 'sticky',
                textAlign: 'right',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                zIndex: 3
              }}
              key={rowIndex}
            >
              <Input size={'small'} value={row} variant={'filled'} />
            </div>
            {colNames.map((col, colIndex) => (
              <ColorCell
                col={colIndex}
                key={col}
                row={rowIndex}
                onClick={handleColorClick}
              >
                50
              </ColorCell>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default ColorPalette
