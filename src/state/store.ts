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
  getSelectedColor() {
    const {colors, selectedCol, selectedRow} = get()
    return colors[selectedRow][selectedCol]
  },
  imageData: [],
  name: 'Default palette',
  rowNames: stripePalette.rowNames,
  selectedCol: 0,
  selectedRow: 0,
  setSelectedColor(selectedRow, selectedCol) {
    set({selectedCol, selectedRow})
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
  setSelectedColorInDirection(direction, value) {
    const key = direction === 'column' ? 'selectedRow' : 'selectedCol'

    set({[key]: value})
  }
}))

const useColorStore = colorsStore.useStoreHook

export default useColorStore
