import {WorkerChannel} from '../lib/WebWorkersManager/types.ts'
import {LCH_CHANNELS_NAMES} from '../state'
import {Vector} from '../utils/math.ts'

export type ColorsMessagePayload = {
  channel: WorkerChannel
  colorChannel: LCH_CHANNELS_NAMES
  colors: Vector[]
  height: number
  index: number
  width: number
}

export type ColorsMessageResponse = {
  buffer: ArrayBuffer
  channel: WorkerChannel
  colorChannel: LCH_CHANNELS_NAMES
  height: number
  index: number
  width: number
}
