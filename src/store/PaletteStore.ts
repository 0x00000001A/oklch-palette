import {arrayMove} from '@dnd-kit/sortable'
import {makeAutoObservable} from 'mobx'

import {LCH_CHANNELS_NAMES} from '../constants/colors.ts'
import defaultPalette from '../palettes/default.ts'
import {
  Color,
  hexToRgb,
  isWithinGamut,
  oklabToOklch,
  oklchToRgb,
  rgbFloatToInt,
  rgbToFloat,
  rgbToHex,
  rgbToXyz,
  xyzToOklab
} from '../utils/colors.ts'
import {toFixedTruncate} from '../utils/math.ts'

import {INSERT_POSITION, INSERT_POSITIONS} from './types.ts'

export class PaletteStore {
  againstColumn: PaletteColumn
  colors: PaletteColor[][]
  columns: PaletteColumn[]
  name: string
  rows: PaletteRow[]
  selectedColor: PaletteColor

  constructor(data = defaultPalette) {
    makeAutoObservable(this, {}, {autoBind: true})

    this.load(data)
  }

  cloneColumn(insertPlacement: INSERT_POSITION) {
    const insertPosition = insertPlacement === INSERT_POSITIONS.AFTER ? 1 : 0
    const updatedSelectedCol = this.selectedColIndex + insertPosition

    this.columns.splice(
      updatedSelectedCol,
      0,
      new PaletteColumn(this, this.selectedColor.column.name)
    )

    this.colors = this.colors.map((colorsRow, colorsRowIndex) => {
      colorsRow.splice(
        updatedSelectedCol,
        0,
        new PaletteColor(
          this,
          this.colors[colorsRowIndex][this.selectedColIndex].hex,
          this.rows[colorsRowIndex],
          this.columns[updatedSelectedCol]
        )
      )

      return colorsRow
    })
  }

  cloneRow(insertPlacement: INSERT_POSITION) {
    const insertPosition = insertPlacement === INSERT_POSITIONS.AFTER ? 1 : 0
    const updatedSelectedRow = this.selectedRowIndex + insertPosition

    this.colors.splice(
      updatedSelectedRow,
      0,
      [...this.colors[this.selectedRowIndex]].map((color) => {
        return new PaletteColor(
          this,
          color.hex,
          this.rows[updatedSelectedRow],
          color.column
        )
      })
    )

    this.rows.splice(
      updatedSelectedRow,
      0,
      new PaletteRow(this, this.selectedColor.row.name)
    )
  }

  load(data: typeof defaultPalette) {
    this.name = data.name

    this.rows = data.rowNames.map((name) => {
      return new PaletteRow(this, name)
    })

    this.columns = data.colNames.map((name) => {
      return new PaletteColumn(this, name)
    })

    this.againstColumn = this.columns[0]

    this.colors = data.colors.map((colorsRow, rowIndex) => {
      return colorsRow.map((color, columnIndex) => {
        return new PaletteColor(
          this,
          color,
          this.rows[rowIndex],
          this.columns[columnIndex]
        )
      })
    })

    this.selectedColor = this.colors[0][0]
  }

  removeColumn(column: PaletteColumn) {
    const index = this.columns.indexOf(column)
    const newColumns = this.columns.filter(({id}) => id !== column.id)

    if (this.againstColumn.id === column.id) {
      this.againstColumn = newColumns[0]
    }

    this.columns = newColumns
    this.colors.forEach((row) => {
      row.splice(index, 1)
    })

    this.selectColorByIndex(0, 0)
  }

  removeRow(row: PaletteRow) {
    const index = this.rows.indexOf(row)

    this.rows.splice(this.rows.indexOf(row), 1)
    this.colors.splice(index, 1)

    this.selectColorByIndex(0, 0)
  }

  selectColorByColumn(column: PaletteColumn) {
    this.colors[this.selectedRowIndex][
      this.columns.findIndex(({id}) => id === column.id)
    ].setSelected()
  }

  selectColorByIndex(row: number, col: number) {
    this.colors[row][col].setSelected()
  }

  selectColorByRow(row: PaletteRow) {
    this.colors[this.rows.findIndex(({id}) => id === row.id)][
      this.selectedColIndex
    ].setSelected()
  }

  setAgainstColumnById(id: PaletteColumn['id']) {
    const newAgainstColumn = this.columns.find((column) => column.id === id)

    if (newAgainstColumn) {
      this.againstColumn = newAgainstColumn
    }
  }

  setSelectedColor(color: PaletteColor) {
    this.selectedColor = color
  }

  swapRows(a: string, b: string) {
    const indexA = this.rows.findIndex((row) => row.id == a)
    const indexB = this.rows.findIndex((row) => row.id == b)

    this.rows = arrayMove(this.rows, indexA, indexB)
    this.colors = arrayMove(this.colors, indexA, indexB)
  }

  get againstColumnColor() {
    return this.colors[this.selectedRowIndex][
      this.columns.findIndex((column) => column.id == this.againstColumn.id)
    ]
  }

  get selectedColIndex() {
    return Math.max(
      this.columns.findIndex((column) => column.id == this.selectedColor.column.id),
      0
    )
  }

  get selectedColorName() {
    return `${this.selectedRow.name}-${this.selectedColumn.name}`
  }

  get selectedColumn() {
    return this.columns[this.selectedColIndex]
  }

  get selectedRow() {
    return this.rows[this.selectedRowIndex]
  }

  get selectedRowIndex() {
    return Math.max(
      this.rows.findIndex((row) => row.id === this.selectedColor.row.id),
      0
    )
  }

  get toJSON() {
    return {
      againstColumn: this.againstColumn.name,
      colNames: this.columns.map((column) => column.name),
      colors: this.colors.map((row) => row.map((color) => color.hex)), //this.colors,
      name: this.name,
      rowNames: this.rows.map((row) => row.name),
      selectedColor: [this.selectedRowIndex, this.selectedColIndex]
    }
  }
}

export class PaletteRow {
  id: string
  name: string
  store: PaletteStore

  constructor(store: PaletteStore, name: string) {
    makeAutoObservable(this, {
      id: false,
      name: true,
      store: false
    })

    this.id = crypto.randomUUID()
    this.name = name
    this.store = store
  }

  delete() {
    this.store.removeRow(this)
  }

  setChannelValue(channel: LCH_CHANNELS_NAMES, value: number) {
    this.colors.forEach((color) => {
      const oklch = color.oklch
      oklch[channel] = value

      color.setOklchValue(oklch)
    })
  }

  setName(name: string) {
    this.name = name
  }

  setSelected() {
    this.store.selectColorByRow(this)
  }

  get colors() {
    return this.store.colors[this.store.selectedRowIndex]
  }

  get toJSON() {
    return {name: this.name}
  }
}

export class PaletteColumn {
  id: string
  name: string
  store: PaletteStore

  constructor(store: PaletteStore, name: string) {
    makeAutoObservable(this, {
      id: false,
      name: true,
      store: false
    })

    this.id = crypto.randomUUID()
    this.name = name
    this.store = store
  }

  delete() {
    this.store.removeColumn(this)
  }

  setChannelValue(channel: LCH_CHANNELS_NAMES, value: number) {
    this.colors.forEach((color) => {
      const oklch = color.oklch
      oklch[channel] = value

      color.setOklchValue(oklch)
    })
  }

  setName(name: string) {
    this.name = name
  }

  setSelected() {
    this.store.selectColorByColumn(this)
  }

  get colors() {
    return this.store.colors.map((row) => row[this.store.selectedColIndex])
  }

  get toJSON() {
    return {name: this.name}
  }
}

export class PaletteColor {
  column: PaletteColumn
  hex: string = '#000'
  id: string
  oklch: Color = [0, 0, 0]
  rgb: Color = [0, 0, 0]
  row: PaletteRow
  store: PaletteStore

  constructor(store: PaletteStore, hex: string, row: PaletteRow, column: PaletteColumn) {
    makeAutoObservable(
      this,
      {
        hex: true,
        id: false,
        store: false
      },
      {autoBind: true}
    )

    this.id = crypto.randomUUID()
    this.row = row
    this.column = column
    this.store = store

    this.setHexColor(hex)
  }

  setHexColor(hex: string) {
    this.hex = hex
    this.rgb = hexToRgb(hex)
    this.oklch = oklabToOklch(xyzToOklab(rgbToXyz(this.rgb)))
  }

  setOklchValue(oklch: Color) {
    const isValid = isWithinGamut(oklchToRgb(oklch))

    if (!isValid) {
      return
    }

    this.oklch = oklch
    this.rgb = rgbFloatToInt(oklchToRgb(this.oklch))
    this.hex = rgbToHex(this.rgb)
  }

  setRgbColor(rgb: Color) {
    this.setHexColor(rgbToHex(rgb))
  }

  setSelected() {
    this.store.setSelectedColor(this)
  }

  updateOklchChannelValue(channel: LCH_CHANNELS_NAMES, value: number) {
    const newValue: Color = [...this.oklch]
    newValue[channel] = value

    this.setOklchValue(newValue)
  }

  get isSelected() {
    return this.store.selectedColor.id === this.id
  }

  get isValid() {
    return isWithinGamut(rgbToFloat(this.rgb))
  }

  get oklchUserFriendly() {
    return this.oklch.map((channelValue, channelIndex: LCH_CHANNELS_NAMES) => {
      let result = channelValue
      let decimals = 2

      if (channelIndex === LCH_CHANNELS_NAMES.LIGHTNESS) {
        result *= 100
      }

      if (channelIndex === LCH_CHANNELS_NAMES.CHROMA) {
        decimals = 3
      }

      return toFixedTruncate(result, decimals)
    })
  }

  get toJSON() {
    return {hex: this.hex}
  }
}
