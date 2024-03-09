import {debounceAsync} from '../utils/debounce.ts'
import {getFileFromLocalStorage, saveFileToLocalStorage} from '../lib/SaveManager'
import {ColorsState} from './types.ts'
import {colorsStore, createSchemaColor} from './store.ts'
import {localStorageGet} from '../utils/localStorage.ts'

enum SavedStoreFields {
  NAME,
  ROW_NAMES,
  COL_NAMES,
  COLORS
}

export const restoreStoreFromLocalStorage = debounceAsync(async () => {
  const restoredStoreData = await getFileFromLocalStorage()

  const colNames = restoredStoreData[SavedStoreFields.COL_NAMES]
  const colNamesLength = colNames.length

  const colorsFlat = restoredStoreData[SavedStoreFields.COLORS]
  const colorsLength = colorsFlat.length
  const colorsNested: number[][] = []
  let colorsRow = []

  for (let index = 0; index < colorsLength; index += 3) {
    colorsRow.push(
      createSchemaColor([colorsFlat[index], colorsFlat[index + 1], colorsFlat[index + 2]])
    )

    if (colorsRow.length === colNamesLength) {
      colorsNested.push(colorsRow as never)
      colorsRow = []
    }
  }

  const previousSelection = localStorageGet('ok-palette-selected', [0, 0])

  if (previousSelection) {
    colorsStore.setState(() => ({
      selectedCol: previousSelection[0],
      selectedRow: previousSelection[1]
    }))
  }

  colorsStore.setState((state) => ({
    ...state,
    name: restoredStoreData[SavedStoreFields.NAME],
    rowNames: restoredStoreData[SavedStoreFields.ROW_NAMES],
    colNames,
    colors: colorsNested as never
  }))

  colorsStore.subscribe(saveStoreToLocalStorage)
})

export async function saveStoreToLocalStorage(state: ColorsState) {
  const dataToExport: [string, string[], string[], number[]] = [
    state.name,
    state.rowNames,
    state.colNames,
    []
  ]

  state.colors.forEach((row) => {
    row.forEach(({oklch}) => {
      dataToExport[SavedStoreFields.COLORS].push(...oklch)
    })
  })

  localStorage.setItem(
    'ok-palette-selected',
    JSON.stringify([state.selectedCol, state.selectedRow])
  )

  await saveFileToLocalStorage(state.name, dataToExport)
}
