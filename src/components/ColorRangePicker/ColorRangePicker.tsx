import {ChangeEvent, FC, useCallback, useEffect, useMemo} from 'react'

import {GRAPH_WIDTH} from '../../constants/colors.ts'
import {LCH_CHANNELS_NAMES, useColorsStore} from '../../state'
import {cls} from '../../utils/cls.ts'
import {colorsWorkerManager} from '../../worker'

import {ColorRangePickerProps} from './types.ts'

import './index.css'

const ColorRangePicker: FC<ColorRangePickerProps> = ({
  channel,
  colorsFrom = 'row',
  height,
  index,
  max,
  min,
  step,
  width
}) => {
  const colorsLength = useColorsStore((state) => {
    if (colorsFrom === 'column') {
      return state.rowNames.length
    }

    return state.colNames.length
  })

  const isSelected = useColorsStore((state) => {
    if (colorsFrom === 'column') {
      return state.selectedRow === index
    }

    return state.selectedCol === index
  })

  const value = useColorsStore((state) => {
    if (colorsFrom === 'column') {
      return state.colors[index][state.selectedCol].oklch[channel]
    }

    return state.colors[state.selectedRow][index].oklch[channel]
  })

  const nextValue = useColorsStore((state) => {
    if (colorsFrom === 'column') {
      const rowIndex = Math.min(state.rowNames.length - 1, index + 1)
      const nextColor = state.colors[rowIndex][state.selectedCol].oklch

      return nextColor[channel]
    }

    const colIndex = Math.min(state.colNames.length - 1, index + 1)
    const nextColor = state.colors[state.selectedRow][colIndex].oklch

    return nextColor[channel]
  })

  const neighborColors = useColorsStore((state) => {
    if (colorsFrom === 'column') {
      const curRow = state.colors[index] || []
      const nextRow = state.colors[index + 1] || []
      return [curRow[state.selectedCol].oklch, nextRow[state.selectedCol]?.oklch]
    }

    const colors = state.colors[state.selectedRow]
    return [colors[index].oklch, colors[index + 1]?.oklch]
  })

  const setSelectedColorChannelValue = useColorsStore(
    (state) => state.setSelectedColorChannelValue
  )

  const setSelectedCol = useColorsStore((state) => {
    if (colorsFrom === 'column') {
      return state.setSelectedRow
    }

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

    const colors = neighborColors

    const workerMessage = {
      colors,
      height,
      index,
      width
    }

    channelsToUpdate.forEach((channelToUpdate) => {
      colorsWorkerManager.runTask({
        ...workerMessage,
        channel: `${channelToUpdate}-${colorsFrom}`,
        colorChannel: channelToUpdate,
        id: `${channelToUpdate}-${workerMessage.index}-${colorsFrom}`
      })
    })
  }, [width, height, neighborColors, channel, index, colorsFrom])

  const inputStyles = useMemo(() => {
    const blockSize = Math.round(GRAPH_WIDTH / colorsLength)
    const blockSizeHalf = Math.round(blockSize / 2)
    const inputOffsetLeft = index * blockSize + blockSizeHalf + 1

    // noinspection JSSuspiciousNameCombination
    return {
      color: '#000',
      left: inputOffsetLeft,
      width: height // because of transform @todo props naming
    }
  }, [colorsLength, height, index])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleValueChange, [width, height, value, nextValue])

  return (
    <input
      className={cls('color-range-picker', isSelected && 'color-range-picker_selected')}
      max={max}
      min={min}
      size={step}
      step={step}
      style={inputStyles}
      type={'range'}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  )
}

export default ColorRangePicker
