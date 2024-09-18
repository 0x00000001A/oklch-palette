export type PaletteExporterHandler = (
  rowNames: string[],
  colNames: string[],
  palette: {hex: string}[][]
) => string

export type PaletteExporter = {
  handler: PaletteExporterHandler
  name: string
}
