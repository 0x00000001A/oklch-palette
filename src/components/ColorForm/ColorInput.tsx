import {ChangeEvent, FC, useCallback, useMemo} from 'react'

import {LCH_CHANNELS_CONFIG, LCH_CHANNELS_NAMES} from '../../constants/colors.ts'
import IconGithub from '../../icons/IconGithub.tsx'
import {useColorsStore} from '../../state'
import {getSelectedColorOklch} from '../../state/selectors.ts'
import {toFixedTruncate} from '../../utils/math.ts'
import {Button} from '../Button'
import {Input} from '../Input'

import {ColorInputProps} from './types.ts'

const ColorInput: FC<ColorInputProps> = ({channel}) => {
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
    (event: ChangeEvent<HTMLInputElement>) => {
      let newValue = parseFloat(event.target.value)

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
    <div className={'color-form__item'} key={channel}>
      <label>{LCH_CHANNELS_CONFIG[channel].name}:</label>
      <Input
        max={colorConfig.max}
        min={colorConfig.min}
        step={colorConfig.step}
        type={'number'}
        value={value}
        onChange={handleChange}
      />
      <Button>
        <IconGithub />
      </Button>
    </div>
  )
}

export default ColorInput
