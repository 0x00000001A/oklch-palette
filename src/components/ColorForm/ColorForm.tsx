import {ChangeEvent, FC, HTMLAttributes, useCallback} from 'react'

import {CHROMA_MAX, HUE_MAX, LIGHTNESS_MAX_INT} from '../../constants/colors.ts'
import IconGithub from '../../icons/IconGithub.tsx'
import {LCH_CHANNELS_NAMES, useColorsStore} from '../../state'
import {Input} from '../Input'

import './index.css'

export type ColorFormProps = HTMLAttributes<HTMLDivElement> & {
  // props
}

const ColorForm: FC<ColorFormProps> = () => {
  const [lightness, chroma, hue] = useColorsStore((state) => {
    const result = [...state.colors[state.selectedRow][state.selectedCol].oklch]
    result[0] = result[0] * 100

    return result
  })

  const setSelectedColorChannelValue = useColorsStore((state) => {
    return state.setSelectedColorChannelValue
  })

  const handleChannelChange = useCallback(
    (channel: LCH_CHANNELS_NAMES, value: number) => {
      setSelectedColorChannelValue(channel, value)
    },
    [setSelectedColorChannelValue]
  )

  const handleLightnessChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleChannelChange(0, parseFloat(event.target.value) / 100)
    },
    [handleChannelChange]
  )

  const handleChromaChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleChannelChange(1, parseFloat(event.target.value))
    },
    [handleChannelChange]
  )

  const handleHueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleChannelChange(2, parseFloat(event.target.value))
    },
    [handleChannelChange]
  )

  return (
    <div className={'color-form'}>
      <div className={'color-form__item'}>
        <label>Lightness:</label>
        <Input
          max={LIGHTNESS_MAX_INT}
          min={0}
          step={0.5}
          type={'number'}
          value={lightness}
          onChange={handleLightnessChange}
        />
        <button className={'pg-button'}>
          <IconGithub />
        </button>
      </div>
      <div className={'color-form__item'}>
        <label>Chroma:</label>
        <Input
          max={CHROMA_MAX}
          min={0}
          step={0.001}
          type={'number'}
          value={chroma}
          onChange={handleChromaChange}
        />
        <button className={'pg-button'}>
          <IconGithub />
        </button>
      </div>
      <div className={'color-form__item'}>
        <label>Hue:</label>
        <Input
          max={HUE_MAX}
          min={0}
          step={0.5}
          type={'number'}
          value={hue}
          onChange={handleHueChange}
        />
        <button className={'pg-button'}>
          <IconGithub />
        </button>
      </div>
    </div>
  )
}

export default ColorForm
