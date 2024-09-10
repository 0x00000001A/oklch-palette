import {Button, Flex, Form, Input, Space, Typography, theme} from 'antd'
import {createStyles} from 'antd-style'
import {ChangeEvent, FC, useCallback, useEffect, useState} from 'react'

import {ColorBar} from '../../components/ColorBar'
import ColorForm from '../../components/ColorForm/ColorForm.tsx'
import {useColorsStore} from '../../state'
import {isValidHex} from '../../utils/colors.ts'

export type SidebarHeaderProps = {
  // props
}

const ColorInfoForm: FC = () => {
  const selectedColor = useColorsStore(
    (state) => state.colors[state.selectedRow][state.selectedCol]
  )

  const [hex, setHex] = useState(selectedColor.hex)

  const updateValue = useColorsStore((state) => state.setSelectedColorValue)

  const handleHexValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value

      setHex(value)

      if (isValidHex(value)) {
        updateValue(value)
      }
    },
    [updateValue]
  )

  const handleInputBlur = useCallback(() => {
    if (!isValidHex(hex)) {
      setHex(selectedColor.hex)
    }
  }, [hex, selectedColor.hex])

  const handleColorHexChanged = useCallback(() => {
    setHex(selectedColor.hex)
  }, [selectedColor])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleColorHexChanged, [selectedColor])

  return (
    <Form layout={'inline'} size={'small'}>
      <Form.Item label={'Hex value:'}>
        <Input
          style={{textAlign: 'right'}}
          value={hex}
          onBlur={handleInputBlur}
          onChange={handleHexValueChange}
        />
      </Form.Item>
      <Form.Item style={{marginRight: 0}}>
        <Button htmlType={'submit'}>Copy</Button>
      </Form.Item>
    </Form>
  )
}

const ColorInfo: FC = () => {
  const name = useColorsStore((state) => {
    return `${state.rows[state.selectedRow].name}-${state.columns[state.selectedCol].name}`
  })

  return (
    <Flex justify={'space-between'}>
      <Typography.Text strong>{name}</Typography.Text>
      <ColorInfoForm />
    </Flex>
  )
}

const useStyle = createStyles(({css, token}) => ({
  root: css`
    padding: ${token.paddingSM}px;
  `
}))

const SidebarHeader: FC<SidebarHeaderProps> = () => {
  const {styles} = useStyle()
  const {token} = theme.useToken()

  return (
    <Space className={styles.root} direction={'vertical'}>
      <ColorInfo />
      <ColorForm />
      <Flex gap={token.paddingSM}>
        {/* @todo remove style */}
        <ColorBar colorsFrom={'row'} style={{flexGrow: 1}} />
        <ColorBar colorsFrom={'col'} style={{flexGrow: 1}} />
      </Flex>
    </Space>
  )
}

export default SidebarHeader
