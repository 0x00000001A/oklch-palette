import {LCH_CHANNELS_NAMES} from '../../constants/colors.ts'

export type ColorGraphProps = {
  channel: LCH_CHANNELS_NAMES
  max: number
  min: number
  step: number
}

export type ColorGraphValueProps = {
  channel: LCH_CHANNELS_NAMES
}
