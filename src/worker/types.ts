import {LCH_CHANNELS_NAMES} from '../state'
import {Vector} from '../utils/math.ts'

export type ColorsMessagePayload = {
  channel: LCH_CHANNELS_NAMES
  colors: Vector[]
  height: number
  index: number
  width: number
}

export type ColorsMessageResponse = {
  buffer: ArrayBuffer
  channel: LCH_CHANNELS_NAMES
  height: number
  index: number
  width: number
}
