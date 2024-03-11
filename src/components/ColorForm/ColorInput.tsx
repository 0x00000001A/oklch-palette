import {ChangeEvent, FC, useCallback} from 'react'

import {LCH_CHANNELS_CONFIG} from '../../constants/colors.ts'
import IconGithub from '../../icons/IconGithub.tsx'
import {useColorsStore} from '../../state'
import {Input} from '../Input'

import {ColorInputProps} from './types.ts'

const ColorInput: FC<ColorInputProps> = ({channel}) => {
  const value = useColorsStore((state) => {
    return state.colors[state.selectedRow][state.selectedCol].oklch[channel]
  })

  const setSelectedColorChannelValue = useColorsStore((state) => {
    return state.setSelectedColorChannelValue
  })

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedColorChannelValue(channel, parseFloat(event.target.value))
    },
    [channel, setSelectedColorChannelValue]
  )

  return (
    <div className={'color-form__item'} key={channel}>
      <label>{LCH_CHANNELS_CONFIG[channel].name}:</label>
      <Input
        max={LCH_CHANNELS_CONFIG[channel].max}
        min={LCH_CHANNELS_CONFIG[channel].min}
        step={LCH_CHANNELS_CONFIG[channel].step}
        type={'number'}
        value={value}
        onChange={handleChange}
      />
      <button className={'pg-button'}>
        <IconGithub />
      </button>
    </div>
  )
}

export default ColorInput
