import {FolderOpenOutlined} from '@ant-design/icons'
import {Button, Dropdown, message} from 'antd'
import {FC, useCallback, useMemo, useState} from 'react'

import palettes from '../../../palettes'
import {useColorsStore} from '../../../state'

const palettesOptions = Object.values(palettes).map((palette) => ({
  ...palette,
  key: palette.name,
  label: palette.name
}))

const PaletteDropdown: FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const setPalette = useColorsStore((state) => state.setPalette)

  const [loading, setLoading] = useState(false)
  const [paletteName, setPaletteName] = useState(palettesOptions[0].name)

  const handlePaletteSelected = useCallback(
    (option: {key: string}) => {
      const newPaletteName = option.key

      setLoading(true)

      palettes[newPaletteName.toLowerCase()]
        .lazyImport()
        .then((module) => {
          setPalette(module.default)
          setPaletteName(newPaletteName)
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
    [messageApi, setPalette]
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
          <strong>Palette:</strong> {paletteName}
        </Button>
      </Dropdown>
    </>
  )
}

export default PaletteDropdown
