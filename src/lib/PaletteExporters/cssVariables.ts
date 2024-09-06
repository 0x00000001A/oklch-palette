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
        const familyName = rowNames[rowIndex].replace(' ', '-').toLowerCase()
        const tonesName = colNames[colorIndex].replace(' ', '-').toLowerCase()

        return `--color-${familyName}-${tonesName}: ${color.hex};\n`
      })
    )

    result.push('\n')
  })

  return result.join('')
}
