import {LCH_CHANNELS_NAMES} from '../state'

export type ColorRangePickerProps = {
  min: number
  max: number
  step: number
  width: number
  height: number
  index: number
  channel: LCH_CHANNELS_NAMES
  onImageDataChange: (data: {value: ImageData; index: number; updatedAt: number}) => void
}
