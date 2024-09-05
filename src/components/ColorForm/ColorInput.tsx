import {InputNumber, Space} from 'antd'
import {FC, useCallback, useId, useMemo} from 'react'

import {LCH_CHANNELS_CONFIG, LCH_CHANNELS_NAMES} from '../../constants/colors.ts'
import {useColorsStore} from '../../state'
import {getSelectedColorOklch} from '../../state/selectors.ts'
import {toFixedTruncate} from '../../utils/math.ts'

import {ColorInputProps} from './types.ts'

const ColorInput: FC<ColorInputProps> = ({channel}) => {
  const inputId = useId()

  const isLightnessChannel = channel === LCH_CHANNELS_NAMES.LIGHTNESS
  const channelConfig = LCH_CHANNELS_CONFIG[channel]

  const value = useColorsStore((state) => {
    let channelValue = getSelectedColorOklch()(state)[channel]

    if (isLightnessChannel) {
      channelValue = channelValue * 100
    }

    return toFixedTruncate(channelValue, channelConfig.step)
  })

  const setSelectedColorChannelValue = useColorsStore((state) => {
    return state.setSelectedColorChannelValue
  })

  const handleChange = useCallback(
    (unparsedValue: null | number) => {
      let newValue = unparsedValue || 0

      if (channel === LCH_CHANNELS_NAMES.LIGHTNESS) {
        newValue = newValue / 100
      }

      setSelectedColorChannelValue(channel, newValue)
    },
    [channel, setSelectedColorChannelValue]
  )

  const colorConfig = useMemo(() => {
    const max = isLightnessChannel ? channelConfig.max * 100 : value

    const step = isLightnessChannel ? channelConfig.step * 10 : channelConfig.step

    return {
      ...channelConfig,
      max,
      step
    }
  }, [channelConfig, isLightnessChannel, value])

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
        value={value}
        onChange={handleChange}
      />
    </Space>
  )
}

export default ColorInput
