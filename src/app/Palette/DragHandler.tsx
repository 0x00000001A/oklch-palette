import {HolderOutlined} from '@ant-design/icons'
import {Button} from 'antd'
import {FC, useContext} from 'react'

import {PaletteRowContext} from './Row.tsx'

const PaletteDragHandle: FC = () => {
  const {listeners, setActivatorNodeRef} = useContext(PaletteRowContext)

  return (
    <Button
      icon={<HolderOutlined />}
      ref={setActivatorNodeRef}
      size="small"
      style={{cursor: 'move'}}
      type="text"
      {...listeners}
    />
  )
}

export default PaletteDragHandle
