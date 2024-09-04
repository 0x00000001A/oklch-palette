import {SchemaColor} from '../../state'

export type PaletteExporterHandler = (
  rowNames: string[],
  colNames: string[],
  palette: SchemaColor[][]
) => string

export type PaletteExporter = {
  handler: PaletteExporterHandler
  name: string
}
