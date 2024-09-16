import {SchemaGroup} from '../../state'

import {PaletteRowData} from './types.ts'

export const buildDataSource = (rows: SchemaGroup[]) => {
  const result: PaletteRowData[] = []

  rows.forEach((rowData, rowIndex) => {
    result.push({
      key: rowData.id,
      rowIndex: rowIndex,
      rowName: rowData.name
    })
  })

  return result
}
