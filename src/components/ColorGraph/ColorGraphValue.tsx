import {FC} from 'react'

import {LCH_CHANNELS_NAMES} from '../../constants/colors.ts'
import {useColorsStore} from '../../state'

import {ColorGraphValueProps} from './types.ts'

const ColorGraphValue: FC<ColorGraphValueProps> = ({channel, col}) => {
  const value = useColorsStore((state) => {
    let channelValue = state.colors[state.selectedRow][col].oklch[channel]

    if (channel === LCH_CHANNELS_NAMES.LIGHTNESS) {
      channelValue *= 100
    }

    return String(channelValue).slice(0, 5)
  })

  return <span className={'color-graph__value'}>{value}</span>
}

export default ColorGraphValue
