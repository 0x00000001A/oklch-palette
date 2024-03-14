import {FC, HTMLAttributes, PropsWithChildren, useCallback, useMemo} from 'react'

import {useColorsStore} from '../../state'
import {cls} from '../../utils/cls.ts'

export type ColorCellProps = Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'onClick'> &
  PropsWithChildren & {
    col?: number
    isNotSelectable?: boolean
    onClick?: (row: number, col: number) => void
    row?: number
  }

const ColorCell: FC<ColorCellProps> = ({
  children,
  className,
  col = 0,
  isNotSelectable,
  onClick = () => {},
  row = 0,
  style,
  ...restProps
}) => {
  const color = useColorsStore(
    ({colors, selectedCol, selectedRow}) => {
      const isSelected = col === selectedCol && row === selectedRow

      const {hex, updatedAt} = colors[row][col]
      return {hex, isSelected, updatedAt}
    },
    (a, b) => {
      return a.isSelected === b.isSelected && a.updatedAt === b.updatedAt
    }
  )

  const handleColorClick = useCallback(() => {
    onClick(row, col)
  }, [col, onClick, row])

  const cellStyles = useMemo(() => {
    return {
      ...style,
      backgroundColor: color.hex,
      color: '#fff'
    }
  }, [color.hex, style])

  const cellClassName = useMemo(() => {
    return cls(
      'color-palette__cell',
      color.isSelected && 'color-palette__cell_selected',
      isNotSelectable && 'color-palette__cell_not-selectable',
      className
    )
  }, [className, color.isSelected, isNotSelectable])

  return (
    <div
      {...restProps}
      className={cellClassName}
      style={cellStyles}
      onClick={handleColorClick}
    >
      {children}
    </div>
  )
}

export default ColorCell
