import {Slider} from 'antd'
import {createStyles, css} from 'antd-style'
import {observer} from 'mobx-react-lite'
import {FC, useEffect, useMemo} from 'react'

import {GRAPH_HEIGHT, GRAPH_WIDTH, LCH_CHANNELS_ARRAY} from '../../constants/colors.ts'
import {PaletteColor} from '../../store/PaletteStore.ts'
import {colorsWorkerManager} from '../../worker'

import {ColorRangePickerProps} from './types.ts'

const useStyles = createStyles(() => ({
  root: css`
    top: 5px;
    margin: 0;
    padding: 0;
    /*noinspection CssUnusedSymbol*/
    .ant-slider-rail {
      top: -5px;
    }
  `
}))

const ColorRangePicker: FC<
  ColorRangePickerProps & {color: PaletteColor; nextColor: PaletteColor}
> = observer(
  ({channel, color, colorsLength, index, max, min, nextColor, step, workerGroup}) => {
    const {styles} = useStyles()

    const handleChange = (value: number) => {
      color.updateOklchChannelValue(channel, Number(value))
    }

    const handleFocus = () => {
      color.setSelected()
    }

    const workerData = useMemo(() => {
      const channelsToUpdate = LCH_CHANNELS_ARRAY.filter((i) => i !== channel)
      const colors = [[...color.oklch], [...nextColor.oklch]]

      const workerMessage = {
        colors,
        height: GRAPH_HEIGHT,
        index,
        width: Math.ceil(GRAPH_WIDTH / colorsLength - 1)
      }

      return {channelsToUpdate, workerMessage}
    }, [channel, color.oklch, colorsLength, index, nextColor.oklch])

    const handleValueChange = () => {
      workerData.channelsToUpdate.forEach((channelToUpdate) => {
        colorsWorkerManager.runTask({
          ...workerData.workerMessage,
          channel: `${channelToUpdate}-${workerGroup}`,
          colorChannel: channelToUpdate,
          id: `${channelToUpdate}-${workerData.workerMessage.index}-${workerGroup}`
        })
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(handleValueChange, [color.hex, nextColor.hex])

    return (
      <Slider
        style={{
          left:
            index * Math.ceil(GRAPH_WIDTH / colorsLength - 1) +
            Math.ceil((GRAPH_WIDTH / colorsLength - 1) / 2) -
            5,
          position: 'absolute'
        }}
        styles={{
          handle: {
            transform: color.isSelected ? 'unset' : 'scale(0.65)'
          },
          rail: {
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1
          },
          track: {
            display: 'none'
          },
          tracks: {
            display: 'none'
          }
        }}
        tooltip={{
          open: false
        }}
        className={styles.root}
        max={max}
        min={min}
        step={step}
        value={color.oklch[channel]}
        onChange={handleChange}
        onFocus={handleFocus}
        vertical
      />
    )
  }
)

export default ColorRangePicker
