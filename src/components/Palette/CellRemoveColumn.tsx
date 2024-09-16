import {DeleteOutlined} from '@ant-design/icons'
import {Button, Popconfirm, PopconfirmProps} from 'antd'
import {FC, useCallback} from 'react'

const PaletteCellRemoveColumn: FC<{
  columnId: string
  onRemove: (columnId: string) => void
}> = ({columnId, onRemove}) => {
  const confirm: PopconfirmProps['onConfirm'] = useCallback(() => {
    onRemove(columnId)
  }, [onRemove, columnId])

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
