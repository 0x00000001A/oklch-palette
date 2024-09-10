import {selectorCreator} from '../lib/StateManager/helpers.ts'

import {ColorsDirection, ColorsState} from './types.ts'

const colorsSelector = selectorCreator<ColorsState>()

export const isColorSelectedByDirection = colorsSelector(
  (direction: ColorsDirection, index: number) => {
    return (state) => {
      if (direction === 'col') {
        return state.selectedRow === index
      }

      return state.selectedCol === index
    }
  }
)

export const getNextColor = colorsSelector(
  (direction: ColorsDirection, index: number) => {
    return (state: ColorsState) => {
      let [nextRow, nextCol] = [state.selectedRow, state.selectedCol]

      if (direction === 'col') {
        nextRow = Math.min(state.rows.length - 1, index + 1)
      } else {
        nextCol = Math.min(state.columns.length - 1, index + 1)
      }

      return state.colors[nextRow][nextCol]
    }
  }
)

export const getColorByDirection = colorsSelector(
  (direction: ColorsDirection, index: number) => {
    return (state) => {
      let indexes = [state.selectedRow, index]

      if (direction === 'col') {
        indexes = [index, state.selectedCol]
      }

      return state.colors[indexes[0]][indexes[1]]
    }
  }
)

export const colorsNamesByDirection = colorsSelector((direction: ColorsDirection) => {
  return (state) => {
    if (direction === 'col') {
      return state.rows
    }

    return state.columns
  }
})

export const getColorsLengthByDirection = colorsSelector((direction: ColorsDirection) => {
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
