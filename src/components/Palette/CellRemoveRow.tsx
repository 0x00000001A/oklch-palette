import {DeleteOutlined} from '@ant-design/icons'
import {Button, Popconfirm, PopconfirmProps} from 'antd'
import {FC, useCallback} from 'react'

import {PaletteRow} from '../../store/PaletteStore.ts'

const PaletteCellRemoveRow: FC<{
  row: PaletteRow
}> = ({row}) => {
  const confirm: PopconfirmProps['onConfirm'] = useCallback(() => {
    row.delete()
  }, [row])

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
