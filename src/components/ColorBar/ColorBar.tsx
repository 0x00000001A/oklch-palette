import {FC, useCallback, useMemo} from 'react'
import {ColorBarProps} from './types.ts'
import {useColorsStore} from '../../state'
import './index.css'
import useBemClassName from '../../hooks/useBemClassName.ts'

const ColorBarItem: FC<{index: number} & ColorBarProps> = ({index, colorsFrom}) => {
  const {setSelectedRow, setSelectedCol} = useColorsStore(undefined, () => true)

  const {color, isSelected} = useColorsStore(
    (state) => {
      const selectedIndex = colorsFrom === 'row' ? state.selectedRow : state.selectedCol
      const rowIndex = colorsFrom === 'row' ? index : state.selectedRow
      const colIndex = colorsFrom === 'col' ? index : state.selectedCol

      const color = {...state.colors[rowIndex][colIndex]}
      const oklch = [...color.oklch]

      oklch[0] = Number(String(oklch[0] * 100).slice(0, 5))
      oklch[1] = Number(String(oklch[1]).slice(0, 5))
      oklch[2] = Number(String(oklch[2]).slice(0, 5))

      color.oklch = oklch as never

      return {
        isSelected: index === selectedIndex,
        color,
        row: state.selectedRow
      }
    },
    (a, b) => {
      return (
        a.isSelected === b.isSelected && a.row === b.row && a.color.hex === b.color.hex
      )
    }
  )

  const bemClassName = useBemClassName(
    (builder) => {
      const element = builder('color-bar__item')
      element.withModifier('selected', isSelected)

      return {colorBarItem: element.build()}
    },
    [isSelected]
  )

  const handleClick = useCallback(() => {
    if (colorsFrom === 'row') {
      setSelectedRow(index)
      return
    }

    setSelectedCol(index)
  }, [colorsFrom, index, setSelectedCol, setSelectedRow])

  return (
    <div
      onClick={handleClick}
      className={bemClassName.colorBarItem}
      style={{color: color.hex}}
    />
  )
}

const ColorBar: FC<ColorBarProps> = ({colorsFrom}) => {
  const colorsNames = useColorsStore(
    (state) => {
      if (colorsFrom === 'row') {
        return state.rowNames
      }

      return state.colNames
    },
    (a, b) => a.toString() === b.toString()
  )

  const colors = useMemo(() => {
    return colorsNames.map((_: string, index: number) => (
      <ColorBarItem key={index} index={index} colorsFrom={colorsFrom} />
    ))
  }, [colorsFrom, colorsNames])

  return <div className={'color-bar'}>{colors}</div>
}

export default ColorBar
