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

  return (
    <table className={'color-palette'}>
      <thead>
        <tr>
          <th className={'color-palette__table-cell'} />
          {colNames.map((columnName, col) => (
            <th
              className={'color-palette__table-cell color-palette__column-label'}
              key={col}
            >
              {columnName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowNames.map((rowName, row) => (
          <tr key={row}>
            <td className={'color-palette__table-cell color-palette__row-label'}>
              {rowName}
            </td>
            {colNames.map((_, col) => (
              <td className={'color-palette__table-cell'} key={col}>
                <ColorCell col={col} row={row} onClick={handleColorClick}>
                  50
                </ColorCell>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ColorPalette
