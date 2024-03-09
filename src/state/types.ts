import {AnalyzerResult} from '../components/ContrastChecker/analyzers/wcag22.ts'

export enum LCH_CHANNELS_NAMES {
  LIGHTNESS,
  CHROMA,
  HUE
}

export type SchemaColor = {
  oklch: [number, number, number]
  rgb: [number, number, number]
  hex: string
  imageData: [ImageData | null, ImageData | null, ImageData | null]
  imageDataUpdatedAt: number
  updatedAt: number
  analyzersReports: {
    wcag: {
      white: AnalyzerResult
      black: AnalyzerResult
    }
  }
}

export type ColorsState = {
  name: string
  colors: SchemaColor[][]
  rowNames: string[]
  colNames: string[]
  selectedRow: number
  selectedCol: number
  getSelectedColor: () => SchemaColor
  updateColorImageData: (index: number, channel: number, data: ImageData) => void
  getCurrentAndNextColors: (index: number) => SchemaColor['oklch'][]
  setSelectedRow: (index: number) => void
  setSelectedCol: (index: number) => void
  setSelectedColorChannelValue: (channel: LCH_CHANNELS_NAMES, value: number) => void
}
