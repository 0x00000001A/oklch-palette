import {CaretDownFilled, FolderOpenOutlined} from '@ant-design/icons'
import {Button, Dropdown, message} from 'antd'
import {observer} from 'mobx-react-lite'
import {useCallback, useMemo, useState} from 'react'

import palettes from '../../../palettes'
import {PaletteStore} from '../../../store/PaletteStore.ts'

const PaletteDropdown = observer(({palette}: {palette: PaletteStore}) => {
  const [messageApi, contextHolder] = message.useMessage()

  const [loading, setLoading] = useState(false)

  const handlePaletteSelected = useCallback(
    (option: {key: string}) => {
      const newPaletteName = option.key

      setLoading(true)

      palettes[newPaletteName.toLowerCase()]
        .lazyImport()
        .then((module) => {
          palette.load(module.default)
          messageApi.success('Palette loaded')
        })
        .catch(() => {
          messageApi.error('Failed to load palette')
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false)
          }, 240)
        })
    },
    [messageApi, palette]
  )

  const items = useMemo(() => {
    return Object.values(palettes).map((palette) => ({
      key: palette.name,
      label: palette.name
    }))
  }, [])

  return (
    <>
      {contextHolder}
      <Dropdown menu={{items, onClick: handlePaletteSelected}} trigger={['click']}>
        <Button
          icon={<FolderOpenOutlined />}
          loading={loading}
          size={'small'}
          type={'text'}
        >
          <strong>Palette:</strong> {palette.name}
          <CaretDownFilled />
        </Button>
      </Dropdown>
    </>
  )
})

export default PaletteDropdown
