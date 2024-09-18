import {observer} from 'mobx-react-lite'
import {FC, HTMLAttributes, PropsWithChildren, useCallback} from 'react'

import {PaletteStore} from '../../store/PaletteStore.ts'

import {useCellStyles} from './styles.ts'

export type ColorCellProps = Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'onClick'> &
  PropsWithChildren & {
    colIndex?: number
    isNotSelectable?: boolean
    palette: PaletteStore
    rowIndex?: number
  }

const ColorCell: FC<ColorCellProps> = observer(
  ({children, colIndex = 0, palette, rowIndex = 0, ...restProps}) => {
    const color = palette.colors[rowIndex][colIndex]

    const {styles} = useCellStyles({
      color: color.hex,
      isSelected: color.isSelected,
      isValid: color.isValid
    })

    const handleColorClick = useCallback(() => {
      color.setSelected()
    }, [color])

    return (
      <div {...restProps} className={styles.root} onClick={handleColorClick}>
        {children}
      </div>
    )
  }
)

export default ColorCell
