import {ColorPicker, Flex, Form, Input, Space, Typography, theme} from 'antd'
import {createStyles} from 'antd-style'
import {AggregationColor} from 'antd/es/color-picker/color'
import {observer} from 'mobx-react-lite'
import {ChangeEvent, FC, useCallback, useEffect, useState} from 'react'

import {palette} from '../../main.tsx'
import {PaletteStore} from '../../store/PaletteStore.ts'
import {isValidHex} from '../../utils/colors.ts'
import {ColorBar} from '../ColorBar'
import ColorForm from '../ColorForm/ColorForm.tsx'

export type SidebarHeaderProps = {
  // props
}

const ColorInfoForm = observer(({palette}: {palette: PaletteStore}) => {
  const [hex, setHex] = useState(palette.selectedColor.hex)

  const handleHexValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value

      setHex(value)

      if (isValidHex(value)) {
        palette.selectedColor.setHexColor(value)
      }
    },
    [palette.selectedColor]
  )

  const handleHexValueColorPickerChange = (event: AggregationColor) => {
    const {b, g, r} = event.toRgb()
    palette.selectedColor.setRgbColor([r, g, b])
    setHex(palette.selectedColor.hex)
  }

  const handleInputBlur = useCallback(() => {
    if (!isValidHex(hex)) {
      setHex(palette.selectedColor.hex)
    }
  }, [hex, palette.selectedColor.hex])

  const handleColorHexChanged = useCallback(() => {
    setHex(palette.selectedColor.hex)
  }, [palette.selectedColor.hex])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleColorHexChanged, [palette.selectedColor.hex])

  return (
    <Form.Item label={'Hex value:'} layout={'horizontal'}>
      <Space.Compact>
        <Input
          size={'small'}
          style={{textAlign: 'right'}}
          value={hex}
          onBlur={handleInputBlur}
          onChange={handleHexValueChange}
        />
        <ColorPicker
          size={'small'}
          value={hex}
          onChange={handleHexValueColorPickerChange}
          destroyTooltipOnHide
          disabledAlpha
        />
      </Space.Compact>
    </Form.Item>
  )
})

const ColorInfo = observer(({palette}: {palette: PaletteStore}) => {
  return (
    <Flex justify={'space-between'}>
      <Typography.Text strong>{palette.selectedColorName}</Typography.Text>
      <ColorInfoForm palette={palette} />
    </Flex>
  )
})

const useStyle = createStyles(({css, token}) => ({
  root: css`
    padding: ${token.paddingSM}px;
  `
}))

const SidebarHeader: FC<SidebarHeaderProps> = observer(() => {
  const {styles} = useStyle()
  const {token} = theme.useToken()

  return (
    <Space className={styles.root} direction={'vertical'}>
      <ColorInfo palette={palette} />
      <ColorForm />
      <Flex gap={token.paddingSM}>
        <ColorBar colors={palette.selectedColor.row.colors} />
        <ColorBar colors={palette.selectedColor.column.colors} />
      </Flex>
    </Space>
  )
})

export default SidebarHeader
