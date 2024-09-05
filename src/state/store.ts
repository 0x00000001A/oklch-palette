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

import {ColorsState, INSERT_POSITIONS, SchemaColor} from './types.ts'

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
  addToPalette(insertType, insertDirection) {
    set((state) => {
      let updatedColors = [...state.colors]
      let updatedSelectedCol = state.selectedCol
      let updatedSelectedRow = state.selectedRow

      const updatedRowNames = [...state.rowNames]
      const updatedColNames = [...state.colNames]
      const insertPosition = insertDirection === INSERT_POSITIONS.AFTER ? 1 : 0

      if (insertType === 'row') {
        updatedSelectedRow = state.selectedRow + insertPosition

        updatedColors.splice(updatedSelectedRow, 0, [...updatedColors[state.selectedRow]])
        updatedRowNames.splice(updatedSelectedRow, 0, 'No name')
      } else {
        updatedSelectedCol = state.selectedCol + insertPosition

        updatedColors = updatedColors.map((row) => {
          row.splice(updatedSelectedCol, 0, row[state.selectedCol])
          return row
        })
        updatedColNames.splice(updatedSelectedCol, 0, 'No name')
      }

      updatedColors = updatedColors.map((row) => {
        return row.map((color) => {
          return {
            ...color,
            updatedAt: Date.now()
          }
        })
      })

      return {
        colNames: updatedColNames,
        colors: updatedColors,
        rowNames: updatedRowNames,
        selectedCol: updatedSelectedCol,
        selectedRow: updatedSelectedRow
      }
    })
  },
  applyChannelValueTo(direction, channel, value) {
    set((state) => {
      const updatedColors = [...state.colors]
      const updatedValue =
        typeof value === 'number'
          ? value
          : updatedColors[state.selectedRow][state.selectedCol].oklch[channel]

      if (direction === 'row') {
        updatedColors[state.selectedRow] = updatedColors[state.selectedRow].map(
          (color) => {
            const updatedColor = color.oklch
            updatedColor[channel] = updatedValue
            return createSchemaColor(updatedColor)
          }
        )
      } else {
        state.rowNames.forEach((_, rowIndex) => {
          const updatedColor = updatedColors[rowIndex][state.selectedCol].oklch
          updatedColor[channel] = updatedValue

          updatedColors[rowIndex][state.selectedCol] = createSchemaColor(updatedColor)
        })
      }

      return {colors: updatedColors}
    })
  },
  colNames: defaultPalette.colNames,
  colors: defaultPalette.colors.map((colorsRow) => {
    return (colorsRow as string[]).map(hexToSchemaColor)
  }),
  exportPalette(exporter) {
    const {colNames, colors, rowNames} = get()
    return exporter(rowNames, colNames, colors)
  },
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
