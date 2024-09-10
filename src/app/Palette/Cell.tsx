import {FC, useCallback} from 'react'

import {useColorsStore} from '../../state'
import useColorStore from '../../state/store.ts'

import {useCellStyles} from './styles.ts'

const PaletteCell: FC<{colIndex: number; rowId: string}> = ({colIndex, rowId}) => {
  const rowIndex = useColorStore((state) =>
    state.rows.findIndex((row) => row.id === rowId)
  )
  const isSelected = useColorStore(
    (state) => state.selectedCol === colIndex && state.selectedRow === rowIndex
  )
  const color = useColorStore((state) => {
    return state.colors[rowIndex][colIndex]
  })

  const {styles} = useCellStyles({color: color.hex, isSelected})
  const setSelectedColor = useColorsStore((state) => state.setSelectedColor)

  const handleColorClick = useCallback(() => {
    setSelectedColor(rowIndex, colIndex)
  }, [colIndex, rowIndex, setSelectedColor])

  return <div className={styles.root} onClick={handleColorClick} />
}

export default PaletteCell
