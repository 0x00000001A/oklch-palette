import {LCH_CHANNELS_NAMES} from '../../state'

export type ColorRangePickerProps = {
  channel: LCH_CHANNELS_NAMES
  colorsFrom: 'column' | 'row'
  colorsLength: number
  height: number
  index: number
  max: number
  min: number
  step: number
  width: number
}
