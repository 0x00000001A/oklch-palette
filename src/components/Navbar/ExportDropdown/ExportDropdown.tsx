import {SaveOutlined} from '@ant-design/icons'
import {Button, Dropdown, message} from 'antd'
import {FC, useCallback, useMemo} from 'react'

import {paletteExporters} from '../../../lib/PaletteExporters/PaletteExporter.ts'
import {useColorsStore} from '../../../state/index.ts'

const ExportDropdown: FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const exportPalette = useColorsStore((state) => state.exportPalette)

  const handleExporterSelected = useCallback(
    (option: {key: string}) => {
      try {
        navigator.clipboard.writeText(
          exportPalette(paletteExporters[Number(option.key)].handler)
        )
        messageApi.open({
          content: '🎉 Copied to clipboard',
          type: 'success'
        })
      } catch (error) {
        console.error(error)
        messageApi.open({
          content: '😬 Failed to export. Browser needs some updates?',
          type: 'success'
        })
      }
    },
    [exportPalette, messageApi]
  )

  const items = useMemo(() => {
    return paletteExporters.map((exporter, exporterIndex) => ({
      key: exporterIndex,
      label: exporter.name
    }))
  }, [])

  return (
    <>
      {contextHolder}
      <Dropdown menu={{items, onClick: handleExporterSelected}} trigger={['click']}>
        <Button icon={<SaveOutlined />} size={'small'} type={'text'}>
          Export as
        </Button>
      </Dropdown>
    </>
  )
}

export default ExportDropdown
