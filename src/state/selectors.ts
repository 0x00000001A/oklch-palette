import {selectorCreator} from '../lib/StateManager/helpers.ts'

import {ColorsState} from './types.ts'

const colorsSelector = selectorCreator<ColorsState>()

export const isColorSelectedByDirection = colorsSelector(
  (direction: 'column' | 'row', index: number) => {
    return (state) => {
      if (direction === 'column') {
        return state.selectedRow === index
      }

      return state.selectedCol === index
    }
  }
)

export const getNextColor = colorsSelector(
  (direction: 'column' | 'row', index: number) => {
    return (state: ColorsState) => {
      let [nextRow, nextCol] = [state.selectedRow, state.selectedCol]

      if (direction === 'column') {
        nextRow = Math.min(state.rowNames.length - 1, index + 1)
      } else {
        nextCol = Math.min(state.colNames.length - 1, index + 1)
      }

      return state.colors[nextRow][nextCol]
    }
  }
)

export const getColorByDirection = colorsSelector(
  (direction: 'column' | 'row', index: number) => {
    return (state) => {
      let indexes = [state.selectedRow, index]

      if (direction === 'column') {
        indexes = [index, state.selectedCol]
      }

      return state.colors[indexes[0]][indexes[1]]
    }
  }
)

export const colorsNamesByDirection = colorsSelector((direction: 'column' | 'row') => {
  return (state) => {
    if (direction === 'column') {
      return state.rowNames
    }

    return state.colNames
  }
})

export const colorsLengthByDirection = colorsSelector((direction: 'column' | 'row') => {
  return (state) => {
    return colorsNamesByDirection(direction)(state).length
  }
})

export const getSelectedColor = colorsSelector(() => {
  return (state) => {
    return state.colors[state.selectedRow][state.selectedCol]
  }
})

export const getSelectedColorOklch = colorsSelector(() => {
  return (state) => {
    return [...getSelectedColor()(state).oklch]
  }
})
