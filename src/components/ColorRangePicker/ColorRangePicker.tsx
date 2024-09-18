import {Slider} from 'antd'
import {createStyles, css} from 'antd-style'
import {observer} from 'mobx-react-lite'
import {FC, useEffect} from 'react'

import {LCH_CHANNELS_ARRAY} from '../../constants/colors.ts'
import {PaletteColor} from '../../store/PaletteStore.ts'
import {colorsWorkerManager} from '../../worker'

import {ColorRangePickerProps} from './types.ts'

const useStyles = createStyles(() => ({
  root: css`
    margin: 0;
    padding: 0;
  `
}))

const ColorRangePicker: FC<
  ColorRangePickerProps & {color: PaletteColor; nextColor: PaletteColor}
> = observer(
  ({
    channel,
    color,
    colorsLength,
    height,
    index,
    max,
    min,
    nextColor,
    step,
    width,
    workerGroup
  }) => {
    const {styles} = useStyles()

    const handleChange = (value: number) => {
      // console.log(event)
      // if (event.target === document.activeElement) {
      color.updateOklchChannelValue(channel, Number(value))
      // }
    }

    const handleFocus = () => {
      color.setSelected()
    }

    const handleValueChange = () => {
      if (!width || !height) {
        return
      }

      const channelsToUpdate = LCH_CHANNELS_ARRAY.filter((i) => i !== channel)

      const colors = [[...color.oklch], [...nextColor.oklch]]

      const workerMessage = {
        colors,
        height,
        index,
        width
      }

      channelsToUpdate.forEach((channelToUpdate) => {
        colorsWorkerManager.runTask({
          ...workerMessage,
          channel: `${channelToUpdate}-${workerGroup}`,
          colorChannel: channelToUpdate,
          id: `${channelToUpdate}-${workerMessage.index}-${workerGroup}`
        })
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(handleValueChange, [width, height, color.hex, nextColor.hex, colorsLength])

    return (
      <Slider
        styles={{
          handle: {
            marginLeft: 2
          },
          rail: {
            left: '50%',
            marginLeft: 2,
            transform: 'translateX(-50%)'
          },
          track: {
            display: 'none'
          },
          tracks: {
            display: 'none'
          }
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
