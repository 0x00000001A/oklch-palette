import {Input} from 'antd'
import {Fragment} from 'react'

import {useColorsStore} from '../../state'
import {arrayCompare} from '../../utils/compare.ts'

import ColorCell from './Cell.tsx'

const ColorPalette = () => {
  const rows = useColorsStore((state) => state.rows, arrayCompare)
  const columns = useColorsStore((state) => state.columns, arrayCompare)

  return (
    <div
      style={{
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
          gridTemplateColumns: `100px repeat(${columns.length}, 64px)`,
          gridTemplateRows: `max-content repeat(${rows.length}, 40px)`,
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
        {columns.map((col) => (
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
            key={col.id}
          >
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <Input size={'small'} value={col.name} variant={'filled'} />
            </span>
          </div>
        ))}
        {rows.map((row, rowIndex) => (
          <Fragment key={row.id}>
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
              key={row.id}
            >
              <Input size={'small'} value={row.name} variant={'filled'} />
            </div>
            {columns.map((col, colIndex) => (
              <ColorCell col={colIndex} key={col.id} row={rowIndex} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default ColorPalette
