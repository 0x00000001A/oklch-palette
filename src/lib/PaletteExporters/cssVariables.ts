import {PaletteExporterHandler} from './types'

export const cssVariablesExporter: PaletteExporterHandler = (
  rowNames,
  colNames,
  palette
) => {
  const result: string[] = []

  palette.forEach((row, rowIndex) => {
    result.push(
      ...row.map((color, colorIndex) => {
        return `--color-${rowNames[rowIndex]}-${colNames[colorIndex]}: ${color.hex};\n`
      })
    )

    result.push('\n')
  })

  return result.join('')
}
