import {createStore} from '../lib/StateManager'
import defaultPalette from '../palettes/default.ts'
import {
  hexToRgb,
  oklabToOklch,
  oklchToRgb,
  rgbFloatToInt,
  rgbToHex,
  rgbToXyz,
  xyzToOklab
} from '../utils/colors.ts'

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

export const hexToSchemaColor = (hex: string): SchemaColor => {
  const rgb = hexToRgb(hex)

  const oklch = oklabToOklch(xyzToOklab(rgbToXyz(rgb)))

  return {
    hex,
    oklch,
    rgb,
    updatedAt: Date.now()
  }
}

export const colorsStore = createStore<ColorsState>((set, get) => ({
  addToPalette(data) {
    set((state) => {
      const updatedColors = [...state.colors]
      const colNames = [...state.colNames]
      const rowNames = [...state.rowNames]

      const name = 'No name'

      if (data.direction === 'col') {
        updatedColors.forEach((row) => {
          row.push(hexToSchemaColor('#333'))
        })
        colNames.push(name)
        // do something
      } else {
        updatedColors.push(Array(state.colNames.length).fill(hexToSchemaColor('#333')))
        rowNames.push(name)
      }

      return {
        colNames,
        colors: updatedColors,
        rowNames
      }
    })
  },
  colNames: defaultPalette.colNames,
  colors: defaultPalette.colors.map((colorsRow) => {
    return (colorsRow as string[]).map(hexToSchemaColor)
  }),
  getSelectedColor() {
    const {colors, selectedCol, selectedRow} = get()
    return colors[selectedRow][selectedCol]
  },
  imageData: [],
  name: 'Default palette',
  rowNames: defaultPalette.rowNames,
  selectedCol: 0,
  selectedRow: 0,
  setPalette(palette) {
    console.log(palette)
    set({
      ...palette,
      colors: palette.colors.map((paletteColors) => paletteColors.map(hexToSchemaColor)),
      selectedCol: 0,
      selectedRow: 0
    })
  },
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
    const key = direction === 'col' ? 'selectedRow' : 'selectedCol'

    set({[key]: value})
  },
  setSelectedColorValue(hex: string) {
    // shallow copy wtf
    set(({colors, selectedCol, selectedRow}) => {
      colors[selectedRow][selectedCol] = hexToSchemaColor(hex)

      return {
        colors
      }
    })
  }
}))

const useColorStore = colorsStore.useStoreHook

export default useColorStore
