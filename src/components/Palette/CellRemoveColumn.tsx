import {DeleteOutlined} from '@ant-design/icons'
import {Button, Popconfirm, PopconfirmProps} from 'antd'
import {FC, useCallback} from 'react'

import {PaletteColumn} from '../../store/PaletteStore.ts'

const PaletteCellRemoveColumn: FC<{
  column: PaletteColumn
}> = ({column}) => {
  const confirm: PopconfirmProps['onConfirm'] = useCallback(() => {
    column.delete()
  }, [column])

  return (
    <Popconfirm
      cancelText="Cancel"
      description="Are you sure to delete this column?"
      okText="Yes"
      title="Remove column"
      onConfirm={confirm}
    >
      <Button icon={<DeleteOutlined />} size={'small'} />
    </Popconfirm>
  )
}

export default PaletteCellRemoveColumn
