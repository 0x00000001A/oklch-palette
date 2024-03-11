import {CHROMA_MAX, HUE_MAX, LIGHTNESS_MAX} from '../constants/colors.ts'
import {LCH_CHANNELS_NAMES} from '../state'
import {isWithinGamut, oklchToRgb} from '../utils/colors.ts'

import {ColorsMessagePayload} from './types.ts'

function putImageData(index: number, data: Uint8ClampedArray, rgba: number[] = []) {
  data[index] = rgba[0]
  data[index + 1] = rgba[1]
  data[index + 2] = rgba[2]
  data[index + 3] = rgba[3]
}

function generateNumbersBetween(min: number, max: number, amount: number) {
  const increments = (max - min) / amount

  return Array(amount + 1)
    .fill(0)
    .map((_, y) => min + increments * y)
}

self.addEventListener('message', (event: MessageEvent<ColorsMessagePayload>) => {
  const {channel, colorChannel, colors, height, index} = event.data
  const originalWidth = event.data.width
  const halfWidth = Math.round(originalWidth / 2)
  let width = originalWidth

  if (!index) {
    width += halfWidth
  }

  const size = width * height

  const buffer = new ArrayBuffer(size * 4)
  const result = new Uint8ClampedArray(buffer)

  const currentColor = colors[0]
  const nextColor = colors[1] ? colors[1] : colors[0]

  const workingColor = [
    generateNumbersBetween(currentColor[0], nextColor[0], originalWidth),
    generateNumbersBetween(currentColor[1], nextColor[1], originalWidth),
    generateNumbersBetween(currentColor[2], nextColor[2], originalWidth)
  ]

  if (!index) {
    workingColor[0].unshift(
      ...generateNumbersBetween(currentColor[0], currentColor[0], halfWidth)
    )
    workingColor[1].unshift(
      ...generateNumbersBetween(currentColor[1], currentColor[1], halfWidth)
    )
    workingColor[2].unshift(
      ...generateNumbersBetween(currentColor[2], currentColor[2], halfWidth)
    )
  }

  for (let pixelIndex = 0; pixelIndex < size; pixelIndex += 1) {
    const bufferIndex = pixelIndex * 4

    const x = pixelIndex % width
    const y = Math.floor(pixelIndex / width)

    const resultColor = [...currentColor]

    if (colorChannel === LCH_CHANNELS_NAMES.LIGHTNESS) {
      resultColor[0] = LIGHTNESS_MAX - y / height
      resultColor[1] = workingColor[1][x]
      resultColor[2] = workingColor[2][x]
    }

    if (colorChannel === LCH_CHANNELS_NAMES.CHROMA) {
      resultColor[0] = workingColor[0][x]
      resultColor[1] = (CHROMA_MAX * (height - y)) / height
      resultColor[2] = workingColor[2][x]
    }

    if (colorChannel === LCH_CHANNELS_NAMES.HUE) {
      resultColor[0] = workingColor[0][x]
      resultColor[1] = workingColor[1][x]
      resultColor[2] = HUE_MAX - (HUE_MAX * y) / height
    }

    const rgbColor = oklchToRgb([resultColor[0], resultColor[1], resultColor[2]])
    // const p3Color = rgbToP3(rgbFloatToInt(rgbColor))
    // const rec2020Color = rgbToRec2020(rgbFloatToInt(rgbColor))

    if (isWithinGamut(rgbColor)) {
      putImageData(bufferIndex, result, [
        rgbColor[0] * 255,
        rgbColor[1] * 255,
        rgbColor[2] * 255,
        255
      ])
    }

    // if (!isWithinGamut(rgbColor)) {
    //   result[bufferIndex + 3] = 0
    //
    //   if (isWithinGamut(p3Color)) {
    //     result[bufferIndex + 3] += 90
    //   }
    //
    //   if (isWithinGamut(rec2020Color)) {
    //     result[bufferIndex + 3] += 90
    //   }
    // }
  }

  // @todo postMessage API needs to be clarified
  // Or there is something wrong with docs.
  // OR I'm using it in the wrong way.
  // Needs to be reviewed somehow someday.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  postMessage({buffer, channel, colorChannel, height, index, width}, [buffer])
})
