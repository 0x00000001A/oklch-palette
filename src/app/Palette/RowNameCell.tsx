import {Input, Space} from 'antd'
import {ChangeEvent, FC, useCallback, useState} from 'react'

import {SchemaGroup, useColorsStore} from '../../state'

import PaletteDragHandle from './DragHandler.tsx'

const PaletteRowNameCell: FC<{row: SchemaGroup; rowIndex: number}> = ({
  row,
  rowIndex
}) => {
  const [name, setName] = useState(row.name)

  const renameRow = useColorsStore((store) => store.renameRow)
  const setSelectedRow = useColorsStore((state) => state.setSelectedRow)

  const handleNameChange = useCallback(
    (newName: ChangeEvent<HTMLInputElement>) => {
      renameRow(row.id, newName.target.value)
      setName(newName.target.value)
    },
    [renameRow, row.id]
  )

  const handleRowNameInputFocused = useCallback(() => {
    setSelectedRow(rowIndex)
  }, [rowIndex, setSelectedRow])

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
