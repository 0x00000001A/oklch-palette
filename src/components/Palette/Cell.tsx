import {FC, HTMLAttributes, PropsWithChildren, useCallback} from 'react'

import {useColorsStore} from '../../state'
import useColorStore from '../../state/store.ts'

import {useCellStyles} from './styles.ts'

export type ColorCellProps = Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'onClick'> &
  PropsWithChildren & {
    colIndex?: number
    isNotSelectable?: boolean
    rowIndex?: number
  }

const ColorCell: FC<ColorCellProps> = ({
  children,
  colIndex = 0,
  rowIndex = 0,
  ...restProps
}) => {
  const isSelected = useColorStore(
    (state) => state.selectedRow === rowIndex && state.selectedCol === colIndex
  )
  const color = useColorsStore(
    ({colors}) => {
      const {hex, isValid, updatedAt} = colors[rowIndex][colIndex]
      return {hex, isSelected, isValid, updatedAt}
    },
    (a, b) => {
      return a.isSelected === b.isSelected && a.updatedAt === b.updatedAt
    }
  )

  const {styles} = useCellStyles({color: color.hex, isSelected, isValid: color.isValid})

  const setSelectedColor = useColorsStore((state) => state.setSelectedColor)

  const handleColorClick = useCallback(() => {
    setSelectedColor(rowIndex, colIndex)
  }, [rowIndex, colIndex, setSelectedColor])

  return (
    <div {...restProps} className={styles.root} onClick={handleColorClick}>
      {children}
    </div>
  )
}

export default ColorCell
