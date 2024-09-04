import {PaletteExporterHandler} from './types'

export const cssVariablesExporter: PaletteExporterHandler = (
  rowNames,
  colNames,
  palette
) => {
  return palette.reduce((acc, row, rowIndex) => {
    const variables = row
      .map((color, colorIndex) => {
        return `--color-${rowNames[rowIndex]}-${colNames[colorIndex]}: ${color.hex};`
      })
      .join('\n')

    return `${acc}\n\n${variables}`
  }, '')
}
