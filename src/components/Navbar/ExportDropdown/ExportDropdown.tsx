import {SaveOutlined} from '@ant-design/icons'
import {Button, Dropdown, message} from 'antd'
import {observer} from 'mobx-react-lite'
import {useCallback} from 'react'

import {paletteExporters} from '../../../lib/PaletteExporters/PaletteExporter.ts'
import {PaletteStore} from '../../../store/PaletteStore.ts'
import {objectsArrayToStringArray} from '../../../utils/array.ts'

const exporters = paletteExporters.map((exporter, exporterIndex) => ({
  key: exporterIndex,
  label: exporter.name
}))

const ExportDropdown = observer(({palette}: {palette: PaletteStore}) => {
  const [messageApi, contextHolder] = message.useMessage()

  const handleExporterSelected = useCallback(
    (option: {key: string}) => {
      const exporter = paletteExporters[Number(option.key)].handler

      navigator.clipboard
        .writeText(
          exporter(
            objectsArrayToStringArray(palette.rows),
            objectsArrayToStringArray(palette.columns),
            palette.colors
          )
        )
        .then(() => {
          messageApi.open({
            content: '🎉 Copied to clipboard',
            type: 'success'
          })
        })
        .catch((error) => {
          console.error(error)
          messageApi.open({
            content: '😬 Failed to export. Browser needs some updates?',
            type: 'success'
          })
        })
    },
    [messageApi, palette.colors, palette.columns, palette.rows]
  )

  return (
    <>
      {contextHolder}
      <Dropdown
        menu={{items: exporters, onClick: handleExporterSelected}}
        trigger={['click']}
      >
        <Button icon={<SaveOutlined />} size={'small'} type={'text'}>
          Export as
        </Button>
      </Dropdown>
    </>
  )
})

export default ExportDropdown
