import {ChangeEvent, FC, useCallback, useEffect, useRef, useState} from 'react'

import useDraggable from '../../hooks/useDraggable.ts'
import {hslToRgb, hsvToRgb} from '../../utils/colors.ts'

import {ColorPickerProps} from './types.ts'

import './index.css'

const ColorPicker: FC<ColorPickerProps> = ({onChange}) => {
  const [hue, setHue] = useState(0)
  const [value, setValue] = useState(0.5)
  const [saturation, setSaturation] = useState(0.5)

  const draggableRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((x: number, y: number, pw: number, ph: number) => {
    const newSaturation = Math.max(0, Math.min(1, ((x / pw) * 255) / 255))
    const newValue = Math.max(0, Math.min(1, 1 - ((y / ph) * 255) / 255))

    setValue(newValue)
    setSaturation(newSaturation)
  }, [])

  const handleHueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setHue(parseFloat(event.target.value))
  }, [])

  const handleColorChange = useCallback(() => {
    const rgb = hsvToRgb([hue, saturation, value])
    draggableRef.current!.style.background = `rgb(${rgb.join()})`
    onChange && onChange(rgb as [number, number, number])
  }, [hue, onChange, saturation, value])

  useDraggable(draggableRef, handleMove, () => {
    if (!draggableRef.current) {
      return {left: '0', top: '0'}
    }

    return {
      left: `calc(${saturation * 100}% - ${draggableRef.current.offsetWidth / 2}px)`,
      top: `calc(${value * 100}% - ${draggableRef.current.offsetHeight / 2}px)`
    }
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleColorChange, [hue, value, saturation])

  return (
    <div>
      <div
        className={'color-picker__graph'}
        style={{color: `rgb(${hslToRgb([hue, 100, 50])})`}}
      >
        <div className={'color-picker__pointer'} ref={draggableRef} />
      </div>
      <div className="color-picker__range-holder">
        <input
          style={{
            background: `linear-gradient(90deg, ${new Array(360)
              .fill(0)
              .map((_, i) => `rgb(${hslToRgb([i, 100, 50])})`)
              .join(',')})`,
            width: '100%'
          }}
          className={'color-picker__range'}
          max={360}
          min={0}
          step={0.5}
          type={'range'}
          value={hue}
          onChange={handleHueChange}
        />
      </div>
    </div>
  )
}

export default ColorPicker
