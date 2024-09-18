import {Col, ColorPicker, Flex, Form, Input, Row, Select, Space} from 'antd'
import {createStyles, css} from 'antd-style'
import {AggregationColor} from 'antd/es/color-picker/color'
import {observer} from 'mobx-react-lite'
import {ChangeEvent, useCallback, useMemo, useState} from 'react'

import {PaletteStore} from '../../store/PaletteStore.ts'
import {hexToRgb, isValidHex, rgbToHex} from '../../utils/colors.ts'

import ValidatorResults from './Results.tsx'

const useStyles = createStyles(({token}) => ({
  root: css`
    padding: ${token.sizeSM}px ${token.sizeLG}px ${token.sizeLG}px;
    background: ${token.colorBgContainer};
    border-top: 1px solid ${token.colorBorder};
  `
}))

const Validator = observer(
  ({
    palette: {
      againstColumn,
      againstColumnColor,
      columns,
      selectedColor,
      setAgainstColumnById
    }
  }: {
    palette: PaletteStore
  }) => {
    const {styles} = useStyles()

    const [darkColor, setDarkColor] = useState<string>('#000')
    const [lightColor, setLightColor] = useState<string>('#fff')

    const handleAgainstColumnChange = useCallback(
      (columnId: string) => {
        setAgainstColumnById(columnId)
      },
      [setAgainstColumnById]
    )

    const handleDarkColorChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      setDarkColor(event.target.value)
    }, [])

    const handleDarkColorPickerChange = useCallback((event: AggregationColor) => {
      const {b, g, r} = event.toRgb()
      setDarkColor(rgbToHex([r, g, b]))
    }, [])

    const handleLightColorChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      setLightColor(event.target.value)
    }, [])

    const handleLightColorPickerChange = useCallback((event: AggregationColor) => {
      const {b, g, r} = event.toRgb()
      setLightColor(rgbToHex([r, g, b]))
    }, [])

    const handleColorInputBlur = useCallback(() => {
      setDarkColor(isValidHex(darkColor) ? darkColor : '#000')
      setLightColor(isValidHex(lightColor) ? lightColor : '#fff')
    }, [darkColor, lightColor])

    const baseColors = useMemo(() => {
      return {
        dark: {rgb: isValidHex(darkColor) ? hexToRgb(darkColor) : hexToRgb('#000')},
        light: {rgb: isValidHex(lightColor) ? hexToRgb(lightColor) : hexToRgb('#fff')}
      }
    }, [darkColor, lightColor])

    if (!selectedColor) {
      return null
    }

    return (
      <Row className={styles.root} gutter={[16, 16]} style={{padding: `8px 16px 16px`}}>
        <Col span={8}>
          <Flex gap={8} vertical>
            <Form.Item label={'Against'} layout={'horizontal'} style={{margin: 0}}>
              <Select
                fieldNames={{
                  label: 'name',
                  value: 'id'
                }}
                options={columns}
                size={'small'}
                style={{width: 100}}
                value={againstColumn.id}
                onChange={handleAgainstColumnChange}
                showSearch
              />
            </Form.Item>
            <ValidatorResults colorA={selectedColor} colorB={againstColumnColor} />
          </Flex>
        </Col>
        <Col span={8}>
          <Flex gap={8} vertical>
            <Form.Item label={'Dark color'} layout={'horizontal'} style={{margin: 0}}>
              <Space.Compact>
                <Input
                  size={'small'}
                  style={{width: 100}}
                  value={darkColor}
                  onBlur={handleColorInputBlur}
                  onChange={handleDarkColorChange}
                />
                <ColorPicker
                  size={'small'}
                  value={darkColor}
                  onChange={handleDarkColorPickerChange}
                  disabledAlpha
                />
              </Space.Compact>
            </Form.Item>
            <ValidatorResults colorA={selectedColor} colorB={baseColors.dark as never} />
          </Flex>
        </Col>
        <Col span={8}>
          <Flex gap={8} vertical>
            <Form.Item label={'Light color'} layout={'horizontal'} style={{margin: 0}}>
              <Space.Compact>
                <Input
                  size={'small'}
                  style={{width: 100}}
                  value={lightColor}
                  onBlur={handleColorInputBlur}
                  onChange={handleLightColorChange}
                />
                <ColorPicker
                  size={'small'}
                  value={lightColor}
                  onChange={handleLightColorPickerChange}
                  disabledAlpha
                />
              </Space.Compact>
            </Form.Item>
            <ValidatorResults colorA={selectedColor} colorB={baseColors.light as never} />
          </Flex>
        </Col>
      </Row>
    )
  }
)

export default Validator
