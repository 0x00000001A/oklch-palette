import {FC, HTMLAttributes, PropsWithChildren, useCallback, useMemo} from 'react'
import {cls} from '../../utils/cls.ts'
import {useColorsStore} from '../../state'

export type ColorCellProps = Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'onClick'> &
  PropsWithChildren & {
    row?: number
    col?: number
    onClick?: (row: number, col: number) => void
    isNotSelectable?: boolean
  }

const ColorCell: FC<ColorCellProps> = ({
  row = 0,
  col = 0,
  style,
  className,
  children,
  onClick = () => {},
  isNotSelectable,
  ...restProps
}) => {
  const color = useColorsStore(
    ({colors, selectedRow, selectedCol}) => {
      const isSelected = col === selectedCol && row === selectedRow

      const {hex, analyzersReports, updatedAt} = colors[row][col]
      return {hex, analyzersReports, updatedAt, isSelected}
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
      background: color.hex,
      color: color.analyzersReports.wcag.white.success ? '#fff' : '#000',
      outlineColor: color.hex
      // boxShadow: color.isSelected
      //   ? `0 0 0 4px ${color.hex}, 0 0 12px 0 rgba(0, 0, 0, 0.2)`
      //   : undefined
    }
  }, [color.analyzersReports.wcag.white.success, color.hex, style])

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
      style={cellStyles}
      className={cellClassName}
      onClick={handleColorClick}
    >
      {children}
    </div>
  )
}

export default ColorCell
