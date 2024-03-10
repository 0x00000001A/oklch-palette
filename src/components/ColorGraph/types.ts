import {LCH_CHANNELS_NAMES} from '../../state'

export type ColorGraphProps = {
  channel: LCH_CHANNELS_NAMES
  max: number
  min: number
  step: number
}
