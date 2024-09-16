import {Input} from 'antd'
import {ChangeEvent, FC, useCallback, useState} from 'react'

import {SchemaGroup, useColorsStore} from '../../state'

const PaletteColumnNameCell: FC<{colIndex: number; column: SchemaGroup}> = ({
  colIndex,
  column
}) => {
  const [name, setName] = useState(column.name)

  const renameColumn = useColorsStore((store) => store.renameColumn)
  const setSelectedColumn = useColorsStore((state) => state.setSelectedColumn)

  const handleNameChange = useCallback(
    (newName: ChangeEvent<HTMLInputElement>) => {
      renameColumn(column.id, newName.target.value)
      setName(newName.target.value)
    },
    [renameColumn, column.id]
  )

  const handleColumnNameInputFocused = useCallback(() => {
    setSelectedColumn(colIndex)
  }, [colIndex, setSelectedColumn])

  return (
    <Input
      size={'small'}
      value={name}
      variant={'filled'}
      onChange={handleNameChange}
      onFocus={handleColumnNameInputFocused}
    />
  )
}

export default PaletteColumnNameCell
