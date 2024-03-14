import {LCH_CHANNELS_NAMES} from '../../constants/colors.ts'
import {ColorsDirection} from '../../state'

export type ColorGraphProps = {
  channel: LCH_CHANNELS_NAMES
  colorsFrom: ColorsDirection
  max: number
  min: number
  step: number
}

export type ColorGraphValueProps = {
  channel: LCH_CHANNELS_NAMES
  colorsFrom: ColorsDirection
  index: number
}
