import {Input, Space} from 'antd'
import {observer} from 'mobx-react-lite'
import {ChangeEvent, FC, useCallback} from 'react'

import {PaletteRow} from '../../store/PaletteStore.ts'

import PaletteDragHandle from './DragHandler.tsx'

const PaletteRowNameCell: FC<{row: PaletteRow}> = observer(({row}) => {
  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      row.setName(event.target.value)
    },
    [row]
  )

  const handleRowNameInputFocused = useCallback(() => {
    row.setSelected()
  }, [row])

  return (
    <Space size={'small'}>
      <PaletteDragHandle />
      <Input
        size={'small'}
        value={row.name}
        variant={'filled'}
        onChange={handleNameChange}
        onFocus={handleRowNameInputFocused}
      />
    </Space>
  )
})

export default PaletteRowNameCell
