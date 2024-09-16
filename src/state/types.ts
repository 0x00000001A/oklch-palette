import {LCH_CHANNELS_NAMES} from '../constants/colors.ts'
import {PaletteExporterHandler} from '../lib/PaletteExporters/types.ts'
import defaultPalette from '../palettes/default.ts'

export type SchemaColor = {
  hex: string
  isValid?: boolean
  oklch: [number, number, number]
  rgb: [number, number, number]
  updatedAt: number
}

export type SchemaGroup = {
  id: string
  name: string
}

export type ColorsDirection = 'col' | 'row'

export const INSERT_POSITIONS = {
  AFTER: 0,
  BEFORE: 1,
  END: 3,
  START: 4
} as const

export type INSERT_POSITION = (typeof INSERT_POSITIONS)[keyof typeof INSERT_POSITIONS]

export type ColorsState = {
  addToPalette: (insertType: ColorsDirection, insertDirection: INSERT_POSITION) => void
  applyChannelValueTo: (
    direction: ColorsDirection,
    channel: number,
    value?: number
  ) => void
  colors: SchemaColor[][]
  columns: SchemaGroup[]
  exportPalette: (exporter: PaletteExporterHandler) => string
  getSelectedColor: () => SchemaColor
  getSelectedRowColor: (columnId: string) => SchemaColor
  name: string
  removeColumn: (id: string) => void
  removeRow: (id: string) => void
  renameColumn: (id: string, newName: string) => void
  renameRow: (id: string, newName: string) => void
  rows: SchemaGroup[]
  selectedCol: number
  selectedRow: number
  setPalette: (palette: typeof defaultPalette) => void
  setSelectedColor: (row: number, col: number) => void
  setSelectedColorChannelValue: (channel: LCH_CHANNELS_NAMES, value: number) => void
  setSelectedColorInDirection: (direction: ColorsDirection, value: number) => void
  setSelectedColorValue: (hex: string) => void
  setSelectedColumn: (index: number) => void
  setSelectedRow: (index: number) => void
  swapRows: (rowA: number, rowB: number) => void
}
