import {Button, Flex, Form, Input, Space, Typography, theme} from 'antd'
import {createStyles} from 'antd-style'
import {ChangeEvent, FC, useCallback, useEffect, useState} from 'react'

import {ColorBar} from '../components/ColorBar'
import ColorForm from '../components/ColorForm/ColorForm.tsx'
import {useColorsStore} from '../state'
import {isValidHex} from '../utils/colors.ts'

export type SidebarHeaderProps = {
  // props
}

const ColorInfoForm: FC = () => {
  const value = useColorsStore((state) => {
    return state.getSelectedColor().hex
  })

  const [draftHex, setDraftHex] = useState(value)

  const updateValue = useColorsStore((state) => state.setSelectedColorValue)

  const handleHexValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const hex = event.target.value

      setDraftHex(event.target.value)

      if (isValidHex(hex)) {
        updateValue(hex)
      }
    },
    [updateValue]
  )

  const handleColorHexChanged = useCallback(() => {
    setDraftHex(value)
  }, [value])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleColorHexChanged, [value])

  return (
    <Form layout={'inline'} size={'small'}>
      <Form.Item label={'Hex value:'}>
        <Input
          style={{textAlign: 'right'}}
          value={draftHex}
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
    return `${state.rowNames[state.selectedRow]}-${state.colNames[state.selectedCol]}`
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
