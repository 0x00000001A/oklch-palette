import {ChangeEvent, FC, useCallback, useEffect} from 'react'

import {LCH_CHANNELS_NAMES, useColorsStore} from '../../state'
import {cls} from '../../utils/cls.ts'
import {colorsWorkerManager} from '../../worker'

import {ColorRangePickerProps} from './types.ts'

import './index.css'

const ColorRangePicker: FC<ColorRangePickerProps> = ({
  channel,
  height,
  index,
  max,
  min,
  step,
  width
}) => {
  const isSelected = useColorsStore((state) => {
    return state.selectedCol === index
  })

  const value = useColorsStore((state) => {
    return state.colors[state.selectedRow][index].oklch[channel]
  })

  const nextValue = useColorsStore((state) => {
    const colIndex = Math.min(state.colNames.length - 1, index + 1)
    const nextColor = state.colors[state.selectedRow][colIndex].oklch

    return nextColor[channel]
  })

  const getNeighborColors = useColorsStore((state) => state.getCurrentAndNextColors)
  const setSelectedColorChannelValue = useColorsStore(
    (state) => state.setSelectedColorChannelValue
  )
  const setSelectedCol = useColorsStore((state) => {
    return state.setSelectedCol
  })

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target === document.activeElement) {
        setSelectedColorChannelValue(channel, Number(event.target.value))
      }
    },
    [channel, setSelectedColorChannelValue]
  )

  const handleFocus = useCallback(() => {
    setSelectedCol(index)
  }, [index, setSelectedCol])

  const handleValueChange = useCallback(() => {
    if (!width || !height) {
      return
    }

    const channelsToUpdate = [
      LCH_CHANNELS_NAMES.LIGHTNESS,
      LCH_CHANNELS_NAMES.CHROMA,
      LCH_CHANNELS_NAMES.HUE
    ].filter((i) => i !== channel)

    const colors = getNeighborColors(index)

    const workerMessage = {
      channel,
      colors,
      height,
      index,
      width
    }

    channelsToUpdate.forEach((channelToUpdate) => {
      colorsWorkerManager.runTask({
        ...workerMessage,
        channel: channelToUpdate,
        id: `${channelToUpdate}-${workerMessage.index}`
      })
    })
  }, [channel, getNeighborColors, height, index, width])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleValueChange, [width, height, value, nextValue])

  // noinspection JSSuspiciousNameCombination
  return (
    <input
      style={{
        color: '#000',
        left: index * 40 + 20 + 1,
        width: height
      }}
      className={cls('color-range-picker', isSelected && 'color-range-picker_selected')}
      max={max}
      min={min}
      size={step}
      step={step}
      type={'range'}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  )
}

export default ColorRangePicker
