import {arrayMove} from '@dnd-kit/sortable'

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

const stringArrayToObjectWithIdArray = (source: string[]) => {
  return source.map((name) => ({
    id: crypto.randomUUID(),
    name
  }))
}

function objectsArrayToStringArray<
  R extends Record<number | string | symbol, unknown>,
  Z extends keyof R
>(source: R[], key: Z = 'name' as Z) {
  return source.map((entry) => {
    return String(entry[key])
  })
}

export const colorsStore = createStore<ColorsState>((set, get) => ({
  addToPalette(insertType, insertDirection) {
    set((state) => {
      let updatedColors = [...state.colors]
      let updatedSelectedCol = state.selectedCol
      let updatedSelectedRow = state.selectedRow

      const updatedRows = [...state.rows]
      const updatedColumns = [...state.columns]
      const insertPosition = insertDirection === INSERT_POSITIONS.AFTER ? 1 : 0

      if (insertType === 'row') {
        updatedSelectedRow = state.selectedRow + insertPosition

        updatedColors.splice(updatedSelectedRow, 0, [...updatedColors[state.selectedRow]])
        updatedRows.splice(updatedSelectedRow, 0, {
          id: crypto.randomUUID(),
          name: 'No name'
        })
      } else {
        updatedSelectedCol = state.selectedCol + insertPosition

        updatedColors = updatedColors.map((row) => {
          row.splice(updatedSelectedCol, 0, row[state.selectedCol])
          return row
        })
        updatedColumns.splice(updatedSelectedCol, 0, {
          id: crypto.randomUUID(),
          name: 'No name'
        })
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
        colors: updatedColors,
        columns: updatedColumns,
        rows: updatedRows,
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
        state.rows.forEach((_, rowIndex) => {
          const updatedColor = updatedColors[rowIndex][state.selectedCol].oklch
          updatedColor[channel] = updatedValue

          updatedColors[rowIndex][state.selectedCol] = createSchemaColor(updatedColor)
        })
      }

      return {colors: updatedColors}
    })
  },
  colors: defaultPalette.colors.map((colorsRow) => {
    return (colorsRow as string[]).map(hexToSchemaColor)
  }),
  columns: stringArrayToObjectWithIdArray(defaultPalette.colNames),
  exportPalette(exporter) {
    const {colors, columns, rows} = get()
    return exporter(
      objectsArrayToStringArray(rows),
      objectsArrayToStringArray(columns),
      colors
    )
  },
  getSelectedColor() {
    const {colors, selectedCol, selectedRow} = get()
    return colors[selectedRow][selectedCol]
  },
  getSelectedRowColor(columnId) {
    const {colors, columns, selectedRow} = get()
    return colors[selectedRow][columns.findIndex(({id}) => id === columnId)]
  },
  imageData: [],
  name: 'Default palette',
  removeColumn(id) {
    set(({colors, columns, selectedCol}) => {
      const columnIndex = columns.findIndex((column) => column.id === id)
      const updatedColors = colors.map((row) => {
        const updatedRow = [...row]

        updatedRow.splice(columnIndex, 1)

        return updatedRow
      })
      const updatedColumns = columns.filter((column) => column.id !== id)

      return {
        colors: updatedColors,
        columns: updatedColumns,
        selectedCol: selectedCol === columnIndex ? 0 : selectedCol
      }
    })
  },
  removeRow(id) {
    set(({colors, rows, selectedRow}) => {
      const rowIndex = rows.findIndex((row) => row.id === id)
      const updatedRows = rows.filter((row) => row.id !== id)
      const updatedColors = [...colors]

      updatedColors.splice(rowIndex, 1)

      return {
        colors: updatedColors,
        rows: updatedRows,
        selectedRow: selectedRow === rowIndex ? 0 : selectedRow
      }
    })
  },
  renameColumn(id, newName) {
    set(({columns}) => {
      return {
        columns: columns.map((data) => {
          if (data.id !== id) {
            return data
          }

          return {
            ...data,
            name: newName
          }
        })
      }
    })
  },
  renameRow(id, newName) {
    set(({rows}) => {
      return {
        rows: rows.map((data) => {
          if (data.id !== id) {
            return data
          }

          return {
            ...data,
            name: newName
          }
        })
      }
    })
  },
  rows: stringArrayToObjectWithIdArray(defaultPalette.rowNames),
  selectedCol: 0,
  selectedRow: 0,
  setPalette(palette) {
    set({
      ...palette,
      colors: palette.colors.map((paletteColors) => paletteColors.map(hexToSchemaColor)),
      columns: palette.colNames.map((name) => ({
        id: crypto.randomUUID(),
        name
      })),
      rows: palette.rowNames.map((name) => ({
        id: crypto.randomUUID(),
        name
      })),
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
  },
  setSelectedColumn(index: number) {
    set({selectedCol: index})
  },
  setSelectedRow(index: number) {
    set({selectedRow: index})
  },
  swapRows(rowA, rowB) {
    set(({colors, rows}) => {
      return {
        colors: arrayMove(colors, rowA, rowB),
        rows: arrayMove(rows, rowA, rowB),
        selectedRow: rowB
      }
    })
  }
}))

const useColorStore = colorsStore.useStoreHook

export default useColorStore
