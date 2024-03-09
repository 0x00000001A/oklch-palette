// noinspection JSSuspiciousNameCombination

import {ChangeEvent, FC, useCallback, useEffect} from 'react'
import {useColorsStore, LCH_CHANNELS_NAMES} from '../../state'
import {ColorRangePickerProps} from './types.ts'
import './index.css'
import {cls} from '../../utils/cls.ts'
import {colorsWorkerManager} from '../../worker'
import {ColorsMessageResponse} from '../../worker/types.ts'

const ColorRangePicker: FC<ColorRangePickerProps> = ({
  min,
  max,
  step,
  width,
  height,
  index,
  channel,
  onImageDataChange
}) => {
  const isSelected = useColorsStore((state) => state.selectedCol === index)

  const isLightColor = useColorsStore((state) => {
    return state.colors[state.selectedRow][index].analyzersReports.wcag.black.success
  })

  const value = useColorsStore((state) => {
    return state.colors[state.selectedRow][index].oklch[channel]
  })

  const nextValue = useColorsStore((state) => {
    const nextColor = state.colors[state.selectedRow][index + 1]?.oklch || []
    return nextColor[channel]
  })

  const imageData = useColorsStore(
    (state) => ({
      index,
      value: state.colors[state.selectedRow][index].imageData[channel],
      updatedAt: state.colors[state.selectedRow][index].imageDataUpdatedAt
    }),
    (a, b) => a?.updatedAt === b?.updatedAt
  )

  const getNeighborColors = useColorsStore((state) => state.getCurrentAndNextColors)
  const setSelectedColorChannelValue = useColorsStore(
    (state) => state.setSelectedColorChannelValue
  )
  const updateColorImageData = useColorsStore((state) => state.updateColorImageData)
  const setSelectedCol = useColorsStore((state) => state.setSelectedCol)

  const handleFocus = useCallback(() => {
    setSelectedCol(index)
  }, [index, setSelectedCol])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedColorChannelValue(channel, Number(event.target.value))
    },
    [channel, setSelectedColorChannelValue]
  )

  const handleSetImageData = useCallback(
    ({data: {buffer, ...restData}}: MessageEvent<ColorsMessageResponse>) => {
      updateColorImageData(
        restData.index,
        restData.channel,
        new ImageData(new Uint8ClampedArray(buffer), restData.width, restData.height)
      )
    },
    [updateColorImageData]
  )

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
      height,
      width,
      index,
      colors
    }

    channelsToUpdate.forEach((channelToUpdate) => {
      colorsWorkerManager.runTask(
        {
          ...workerMessage,
          id: `${channelToUpdate}-${workerMessage.index}`,
          channel: channelToUpdate
        },
        handleSetImageData
      )
    })
  }, [channel, getNeighborColors, handleSetImageData, height, index, width])

  const handleImageDataChanged = useCallback(() => {
    imageData.value && onImageDataChange(imageData as never)
  }, [imageData, onImageDataChange])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleValueChange, [width, height, value, nextValue])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleImageDataChanged, [imageData.updatedAt])

  return (
    <input
      className={cls('color-range-picker', isSelected && 'color-range-picker_selected')}
      type={'range'}
      min={min}
      max={max}
      step={step}
      size={step}
      value={value}
      style={{
        width: height,
        left: index * 40 + 20 + 1,
        color: isLightColor ? '#000' : '#fff'
      }}
      onFocus={handleFocus}
      onChange={handleChange}
    />
  )
}

export default ColorRangePicker
