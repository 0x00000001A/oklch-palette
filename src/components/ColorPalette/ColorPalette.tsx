import {useCallback} from 'react'

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
        alignContent: 'start',
        display: 'grid',
        gridTemplateColumns: `96px repeat(${colNames.length}, ${cellSize}px)`,
        gridTemplateRows: `max-content repeat(${colNames.length}, ${cellSize}px)`,
        justifyContent: 'start',
        overflow: 'auto',
        overscrollBehavior: 'none',
        padding: '0 8px 8px 0',
        width: '100%'
      }}
    >
      <div
        style={{
          background: '#fff',
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
            background: '#fff',
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
            {col}
          </span>
        </div>
      ))}
      {rowNames.map((row, rowIndex) => (
        <>
          <div
            style={{
              alignItems: 'center',
              background: '#fff',
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
            {row}
          </div>
          {colNames.map((col, colIndex) => (
            <ColorCell col={colIndex} key={col} row={rowIndex} onClick={handleColorClick}>
              50
            </ColorCell>
          ))}
        </>
      ))}
    </div>
  )
}

export default ColorPalette
