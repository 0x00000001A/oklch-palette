import {stripePalette} from '../palette.ts'
import {ColorsState, SchemaColor} from './types.ts'
import {oklchToRgb, rgbFloatToInt, rgbToHex} from '../utils/colors.ts'
import {wcag22} from '../components/ContrastChecker/analyzers'
import {createStore} from '../lib/StateManager'

export const createSchemaColor = (oklch: [number, number, number]): SchemaColor => {
  const rgb = rgbFloatToInt(oklchToRgb(oklch))
  const hex = rgbToHex(rgb)

  return {
    hex,
    rgb,
    oklch,
    imageData: [null, null, null],
    updatedAt: Date.now(),
    imageDataUpdatedAt: Date.now(),
    analyzersReports: {
      wcag: {
        white: wcag22([255, 255, 255], rgb),
        black: wcag22([0, 0, 0], rgb)
      }
    }
  }
}

export const colorsStore = createStore<ColorsState>((set, get) => ({
  name: 'Default palette',
  colors: stripePalette.colors.map((colorsRow) => {
    return (colorsRow as [number, number, number][]).map(createSchemaColor)
  }),
  colNames: stripePalette.columnNames,
  rowNames: stripePalette.rowNames,
  selectedCol: 0,
  selectedRow: 0,
  getColor(col: number) {
    const state = get()
    return state.colors[state.selectedRow][col]
  },
  setSelectedRow(index) {
    set((state) => ({...state, selectedRow: index}))
  },
  setSelectedCol(index) {
    set((state) => ({...state, selectedCol: index}))
  },
  getSelectedColor() {
    const {colors, selectedRow, selectedCol} = get()
    return colors[selectedRow][selectedCol]
  },
  getCurrentAndNextColors(index: number) {
    const state = get()
    const colors = state.colors[state.selectedRow]
    return [colors[index].oklch, colors[index + 1]?.oklch]
  },
  setSelectedColorChannelValue(channel, value) {
    set(({colors, getSelectedColor, selectedRow, selectedCol}) => {
      const {oklch} = getSelectedColor()
      oklch[channel] = value

      colors[selectedRow][selectedCol] = createSchemaColor(oklch)

      return {
        colors
      }
    })
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
