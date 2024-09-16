import {DeleteOutlined} from '@ant-design/icons'
import {Button, Popconfirm, PopconfirmProps} from 'antd'
import {FC, useCallback} from 'react'

const PaletteCellRemoveRow: FC<{
  onRemove: (rowId: string) => void
  rowId: string
}> = ({onRemove, rowId}) => {
  const confirm: PopconfirmProps['onConfirm'] = useCallback(() => {
    onRemove(rowId)
  }, [onRemove, rowId])

  return (
    <Popconfirm
      cancelText="Cancel"
      description="Are you sure to delete this row?"
      okText="Yes"
      title="Remove row"
      onConfirm={confirm}
    >
      <Button icon={<DeleteOutlined />} size={'small'} />
    </Popconfirm>
  )
}

export default PaletteCellRemoveRow
