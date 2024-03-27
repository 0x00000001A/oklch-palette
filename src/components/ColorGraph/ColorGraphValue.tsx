import {FC} from 'react'

import {LCH_CHANNELS_NAMES} from '../../constants/colors.ts'
import {useColorsStore} from '../../state'
import {getColorByDirection} from '../../state/selectors.ts'

import {ColorGraphValueProps} from './types.ts'

const ColorGraphValue: FC<ColorGraphValueProps> = ({channel, colorsFrom, index}) => {
  const value = useColorsStore((state) => {
    let result = getColorByDirection(colorsFrom, index)(state).oklch[channel]

    if (channel === LCH_CHANNELS_NAMES.LIGHTNESS) {
      result *= 100
    }

    return String(result).slice(0, 5)
  })

  return (
    <span className={'color-graph__value'}>
      <span
        style={{
          display: 'block',
          overflow: 'hidden'
        }}
      >
        {value}
      </span>
    </span>
  )
}

export default ColorGraphValue
