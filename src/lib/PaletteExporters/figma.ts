import {PaletteExporterHandler} from './types'

export const figmaExporter: PaletteExporterHandler = (rowNames, colNames, palette) => {
  return JSON.stringify(
    palette.reduce(
      (acc, row, rowIndex) => {
        return {
          ...acc,
          [rowNames[rowIndex]]: Object.fromEntries(
            row.map<[string, {type: string; value: string}]>((color, colorIndex) => {
              return [
                colNames[colorIndex],
                {
                  type: 'color',
                  value: color.hex
                }
              ]
            })
          )
        }
      },
      {} as Record<string, Record<string, {type: string; value: string}>>
    )
  )
}
