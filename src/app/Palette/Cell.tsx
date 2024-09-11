import {FC, useCallback, useMemo} from 'react'

import {apcaw3} from '../../lib/ContrastValidators/apcaw3.ts'
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

  const contrastApca = useMemo(() => {
    return Math.round(apcaw3(color.rgb, [255, 255, 255])[0].value as never)
  }, [color.rgb])

  return (
    <div
      style={{
        color: Number(contrastApca) < 50 ? '#000' : '#fff',
        fontSize: 12
      }}
      className={styles.root}
      onClick={handleColorClick}
    >
      {contrastApca as never}
    </div>
  )
}

export default PaletteCell
