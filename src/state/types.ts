import {LCH_CHANNELS_NAMES} from '../constants/colors.ts'
import defaultPalette from '../palettes/default.ts'

export type SchemaColor = {
  hex: string
  oklch: [number, number, number]
  rgb: [number, number, number]
  updatedAt: number
}

export type ColorsState = {
  colNames: string[]
  colors: SchemaColor[][]
  getSelectedColor: () => SchemaColor
  name: string
  rowNames: string[]
  selectedCol: number
  selectedRow: number
  setPalette: (palette: typeof defaultPalette) => void
  setSelectedColor: (row: number, col: number) => void
  setSelectedColorChannelValue: (channel: LCH_CHANNELS_NAMES, value: number) => void
  setSelectedColorInDirection: (direction: 'column' | 'row', value: number) => void
}
