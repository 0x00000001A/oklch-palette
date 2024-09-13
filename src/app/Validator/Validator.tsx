import {Col, ColorPicker, Flex, Form, Input, Row, Select, Space} from 'antd'
import {createStyles, css} from 'antd-style'
import {AggregationColor} from 'antd/es/color-picker/color'
import {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react'

import {useColorsStore} from '../../state'
import useColorStore from '../../state/store.ts'
import {hexToRgb, isValidHex, rgbToHex} from '../../utils/colors.ts'
import {arrayCompare} from '../../utils/compare.ts'

import ValidatorResults from './Results.tsx'

const useStyles = createStyles(({token}) => ({
  root: css`
    background: ${token.colorBgContainer};
    border-top: 1px solid ${token.colorBorder};
  `
}))

const Validator = () => {
  const {styles} = useStyles()

  const rows = useColorsStore((state) => state.rows, arrayCompare)
  const columns = useColorsStore((state) => state.columns, arrayCompare)
  const selectedColor = useColorsStore(
    (state) => state.colors[state.selectedRow][state.selectedCol],
    (a, b) => a.hex === b.hex
  )
  const getSelectedRowColor = useColorStore((state) => state.getSelectedRowColor)

  const [darkColor, setDarkColor] = useState<string>('#000')
  const [lightColor, setLightColor] = useState<string>('#fff')

  const [againstColumn, setAgainstColumn] = useState(columns[0].id)
  const [againstColumnColor, setAgainstColumnColor] = useState(
    getSelectedRowColor(againstColumn)
  )

  const handleAgainstColumnChange = useCallback(
    (columnId: string) => {
      setAgainstColumn(columnId)
      setAgainstColumnColor(getSelectedRowColor(columnId))
    },
    [getSelectedRowColor]
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

  useEffect(() => {
    if (columns[0].id === againstColumn) {
      return
    }

    setAgainstColumn(columns[0].id)
    setAgainstColumnColor(getSelectedRowColor(columns[0].id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, rows])

  return (
    <Row className={styles.root} gutter={[8, 8]} style={{padding: 8}}>
      <Col span={8}>
        <Flex gap={8} vertical>
          <Form.Item label={'Against'} style={{margin: 0}}>
            <Select
              fieldNames={{
                label: 'name',
                value: 'id'
              }}
              options={columns}
              size={'small'}
              style={{width: 100}}
              value={againstColumn}
              onChange={handleAgainstColumnChange}
              showSearch
            />
          </Form.Item>
          <ValidatorResults colorA={selectedColor} colorB={againstColumnColor} />
        </Flex>
      </Col>
      <Col span={8}>
        <Flex gap={8} vertical>
          <Form.Item label={'Dark color'} style={{margin: 0}}>
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
          <Form.Item label={'Light color'} style={{margin: 0}}>
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

export default Validator
