import {createStore} from '../lib/StateManager'
import {stripePalette} from '../palette.ts'
import {oklchToRgb, rgbFloatToInt, rgbToHex} from '../utils/colors.ts'

import {ColorsState, SchemaColor} from './types.ts'

export const createSchemaColor = (oklch: [number, number, number]): SchemaColor => {
  const rgb = rgbFloatToInt(oklchToRgb(oklch))
  const hex = rgbToHex(rgb)

  return {
    hex,
    oklch,
    rgb,
    updatedAt: Date.now()
  }
}

export const colorsStore = createStore<ColorsState>((set, get) => ({
  colNames: stripePalette.columnNames,
  colors: stripePalette.colors.map((colorsRow) => {
    return (colorsRow as [number, number, number][]).map(createSchemaColor)
  }),
  getCurrentAndNextColors(index: number) {
    const state = get()
    const colors = state.colors[state.selectedRow]
    return [colors[index].oklch, colors[index + 1]?.oklch]
  },
  getSelectedColor() {
    const {colors, selectedCol, selectedRow} = get()
    return colors[selectedRow][selectedCol]
  },
  imageData: [],
  name: 'Default palette',
  rowNames: stripePalette.rowNames,
  selectedCol: 0,
  selectedRow: 0,
  setSelectedCol(index) {
    set(() => ({selectedCol: index}))
  },
  setSelectedColorChannelValue(channel, value) {
    set(({colors, getSelectedColor, selectedCol, selectedRow}) => {
      const {oklch} = getSelectedColor()
      oklch[channel] = value

      colors[selectedRow][selectedCol] = createSchemaColor(oklch)

      return {
        colors
      }
    })
  },
  setSelectedRow(index) {
    set(() => ({selectedRow: index}))
  },
  updateColorImageData(index: number, channel: number, data: ImageData) {
    set(({colors, selectedRow}) => {
      const selectedColor = colors[selectedRow][index]

      selectedColor.imageData[channel] = data

      colors[selectedRow][index] = {
        ...selectedColor,
        imageDataUpdatedAt: Date.now()
      }

      return {colors}
    })
  }
}))

const useColorStore = colorsStore.useStoreHook

export default useColorStore
