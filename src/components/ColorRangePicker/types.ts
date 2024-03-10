import {LCH_CHANNELS_NAMES} from '../../state'

export type ColorRangePickerProps = {
  channel: LCH_CHANNELS_NAMES
  height: number
  index: number
  max: number
  min: number
  step: number
  width: number
}
