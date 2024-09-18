import {InputNumber, Space} from 'antd'
import {observer} from 'mobx-react-lite'
import {FC, useId, useMemo} from 'react'

import {LCH_CHANNELS_CONFIG, LCH_CHANNELS_NAMES} from '../../constants/colors.ts'

import {ColorInputProps} from './types.ts'

const ColorInput: FC<ColorInputProps> = observer(({channel, palette}) => {
  const inputId = useId()

  const isLightnessChannel = channel === LCH_CHANNELS_NAMES.LIGHTNESS
  const channelConfig = LCH_CHANNELS_CONFIG[channel]

  const handleChange = (unparsedValue: null | number) => {
    let newValue = unparsedValue || 0

    if (channel === LCH_CHANNELS_NAMES.LIGHTNESS) {
      newValue = newValue / 100
    }

    palette.selectedColor.updateOklchChannelValue(channel, newValue)
  }

  const colorConfig = useMemo(() => {
    const max = isLightnessChannel ? channelConfig.max * 100 : channelConfig.max
    const step = isLightnessChannel ? channelConfig.step * 10 : channelConfig.step

    return {
      ...channelConfig,
      max,
      step
    }
  }, [channelConfig, isLightnessChannel])

  return (
    <Space key={channel}>
      <label htmlFor={inputId}>{LCH_CHANNELS_CONFIG[channel].name}:</label>
      <InputNumber
        id={inputId}
        max={colorConfig.max}
        min={colorConfig.min}
        size={'small'}
        step={colorConfig.step}
        type={'number'}
        value={palette.selectedColor.oklchUserFriendly[channel]}
        onChange={handleChange}
      />
    </Space>
  )
})

export default ColorInput
