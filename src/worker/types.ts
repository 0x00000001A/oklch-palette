import {LCH_CHANNELS_NAMES} from '../state'
import {Vector} from '../utils/math.ts'

export type ColorsMessagePayload = {
  channel: LCH_CHANNELS_NAMES
  height: number
  index: number
  width: number
  colors: Vector[]
}

export type ColorsMessageResponse = {
  channel: LCH_CHANNELS_NAMES
  height: number
  index: number
  width: number
  buffer: ArrayBuffer
}
