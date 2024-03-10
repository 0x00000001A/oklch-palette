export enum LCH_CHANNELS_NAMES {
  LIGHTNESS,
  CHROMA,
  HUE
}

export type SchemaColor = {
  hex: string
  oklch: [number, number, number]
  rgb: [number, number, number]
  updatedAt: number
}

export type ColorsState = {
  colNames: string[]
  colors: SchemaColor[][]
  getCurrentAndNextColors: (index: number) => SchemaColor['oklch'][]
  getSelectedColor: () => SchemaColor
  name: string
  rowNames: string[]
  selectedCol: number
  selectedRow: number
  setSelectedCol: (index: number) => void
  setSelectedColorChannelValue: (channel: LCH_CHANNELS_NAMES, value: number) => void
  setSelectedRow: (index: number) => void
  updateColorImageData: (index: number, channel: number, data: ImageData) => void
}
