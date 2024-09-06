import {createStyles, css} from 'antd-style'
import {ChangeEvent, FC, useCallback, useEffect, useMemo} from 'react'

import {GRAPH_WIDTH, LCH_CHANNELS_ARRAY} from '../../constants/colors.ts'
import {useColorsStore} from '../../state'
import {
  getColorByDirection,
  getNextColor,
  isColorSelectedByDirection
} from '../../state/selectors.ts'
import {cls} from '../../utils/cls.ts'
import {colorCompare} from '../../utils/compare.ts'
import {colorsWorkerManager} from '../../worker'

import {ColorRangePickerProps} from './types.ts'

const useStyles = createStyles(({token}) => ({
  root: css`
    position: absolute;
    width: 154px !important;
    height: 1px;
    bottom: -7px;
    transform: rotate(-90deg);
    transform-origin: bottom left;
    margin: 0;
    background-color: transparent;
    -webkit-appearance: none;

    &:focus {
      outline: none;
    }

    &::-webkit-slider-runnable-track {
      height: 14px;
      background: transparent;
    }

    &::-webkit-slider-thumb {
      width: 14px;
      height: 14px;
      background: transparent;
      border-radius: 100%;
      appearance: none;
      border: 2px solid ${token.colorText};
      transform: scale(0.8);
      box-shadow: inset 0 0 1px 0 ${token.colorBorder};
    }

    &:focus::-webkit-slider-thumb {
      border: 4px solid ${token.colorText};
      transform: scale(1.25);
    }
  `,
  selected: css`
    &::-webkit-slider-thumb {
      border: 4px solid ${token.colorText};
      transform: scale(1.25);
    }
  `
}))

const ColorRangePicker: FC<ColorRangePickerProps> = ({
  channel,
  colorsFrom = 'row',
  colorsLength,
  height,
  index,
  max,
  min,
  step,
  width
}) => {
  const {styles} = useStyles()
  const isSelected = useColorsStore(isColorSelectedByDirection(colorsFrom, index))

  const setChannelValue = useColorsStore((state) => state.setSelectedColorChannelValue)
  const setSelectedColor = useColorsStore((state) => state.setSelectedColorInDirection)

  const nextColor = useColorsStore(getNextColor(colorsFrom, index), colorCompare)
  const currColor = useColorsStore(getColorByDirection(colorsFrom, index), colorCompare)

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target === document.activeElement) {
        setChannelValue(channel, Number(event.target.value))
      }
    },
    [channel, setChannelValue]
  )

  const handleFocus = useCallback(() => {
    setSelectedColor(colorsFrom, index)
  }, [colorsFrom, index, setSelectedColor])

  const handleValueChange = useCallback(() => {
    if (!width || !height) {
      return
    }

    const channelsToUpdate = LCH_CHANNELS_ARRAY.filter((i) => i !== channel)

    const colors = [currColor.oklch, nextColor.oklch]

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
  }, [width, height, currColor, nextColor, index, channel, colorsFrom])

  const inputStyles = useMemo(() => {
    const blockSize = GRAPH_WIDTH / colorsLength
    const blockSizeHalf = blockSize / 2

    const inputOffsetLeft = index * blockSize + blockSizeHalf + 1

    // noinspection JSSuspiciousNameCombination
    return {
      color: '#000',
      left: inputOffsetLeft,
      width: height // because of transform @todo props naming
    }
  }, [colorsLength, height, index])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleValueChange, [width, height, currColor, nextColor])

  return (
    <input
      className={cls(styles.root, isSelected && styles.selected)}
      max={max}
      min={min}
      size={step}
      step={step}
      style={inputStyles}
      type={'range'}
      value={currColor.oklch[channel]}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  )
}

export default ColorRangePicker
