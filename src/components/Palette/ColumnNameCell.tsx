import {Input} from 'antd'
import {observer} from 'mobx-react-lite'
import {ChangeEvent, FC, useCallback} from 'react'

import {PaletteColumn} from '../../store/PaletteStore.ts'

const PaletteColumnNameCell: FC<{column: PaletteColumn}> = observer(({column}) => {
  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      column.setName(event.target.value)
    },
    [column]
  )

  const handleColumnNameInputFocused = useCallback(() => {
    column.setSelected()
  }, [column])

  return (
    <Input
      size={'small'}
      value={column.name}
      variant={'filled'}
      onChange={handleNameChange}
      onFocus={handleColumnNameInputFocused}
    />
  )
})

export default PaletteColumnNameCell
