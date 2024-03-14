import {LCH_CHANNELS_NAMES} from '../../constants/colors.ts'
import {ColorsDirection} from '../../state'

export type ColorRangePickerProps = {
  channel: LCH_CHANNELS_NAMES
  colorsFrom: ColorsDirection
  colorsLength: number
  height: number
  index: number
  max: number
  min: number
  step: number
  width: number
}
