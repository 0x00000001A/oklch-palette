import {useCallback} from 'react'

import {useColorsStore} from '../../state'

import ColorCell from './ColorCell.tsx'

import './index.css'

const ColorPalette = () => {
  const rowNames = useColorsStore((state) => state.rowNames)
  const colNames = useColorsStore((state) => state.colNames)
  const setSelectedCol = useColorsStore((state) => state.setSelectedCol)
  const setSelectedRow = useColorsStore((state) => state.setSelectedRow)

  const handleColorClick = useCallback(
    (row: number, col: number) => {
      setSelectedRow(row)
      setSelectedCol(col)
    },
    [setSelectedCol, setSelectedRow]
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
