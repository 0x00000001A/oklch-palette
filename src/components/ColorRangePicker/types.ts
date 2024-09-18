import {LCH_CHANNELS_NAMES} from '../../constants/colors.ts'

export type ColorRangePickerProps = {
  channel: LCH_CHANNELS_NAMES
  colorsLength: number
  index: number
  max: number
  min: number
  step: number
  workerGroup: string
}
