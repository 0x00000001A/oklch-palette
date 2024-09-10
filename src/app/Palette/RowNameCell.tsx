import {Input, Space} from 'antd'
import {ChangeEvent, FC, useCallback, useState} from 'react'

import {useColorsStore} from '../../state'

import PaletteDragHandle from './DragHandler.tsx'
import {PaletteRowData} from './types.ts'

const PaletteRowNameCell: FC<{row: PaletteRowData}> = ({row}) => {
  const [name, setName] = useState(row.rowName)

  const renameRow = useColorsStore((store) => store.renameRow)
  const setSelectedRow = useColorsStore((state) => state.setSelectedRow)

  const handleNameChange = useCallback(
    (newName: ChangeEvent<HTMLInputElement>) => {
      renameRow(row.key, newName.target.value)
      setName(newName.target.value)
    },
    [renameRow, row.key]
  )

  const handleRowNameInputFocused = useCallback(() => {
    setSelectedRow(row.rowIndex)
  }, [row.rowIndex, setSelectedRow])

  return (
    <Space size={'small'}>
      <PaletteDragHandle />
      <Input
        size={'small'}
        value={name}
        variant={'filled'}
        onChange={handleNameChange}
        onFocus={handleRowNameInputFocused}
      />
    </Space>
  )
}

export default PaletteRowNameCell
