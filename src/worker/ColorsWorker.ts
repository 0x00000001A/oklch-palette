import {LCH_CHANNELS_CONFIG, LCH_CHANNELS_NAMES} from '../constants/colors.ts'
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

function generatePixels(
  index: number,
  currColor: number[],
  nextColor: number[],
  width: number
) {
  nextColor = nextColor ? nextColor : currColor

  if (!index) {
    return [
      [
        ...generateNumbersBetween(currColor[0], currColor[0], Math.ceil(width / 2)),
        ...generateNumbersBetween(currColor[0], nextColor[0], Math.ceil(width / 2))
      ],
      [
        ...generateNumbersBetween(currColor[1], currColor[1], Math.ceil(width / 2)),
        ...generateNumbersBetween(currColor[1], nextColor[1], Math.ceil(width / 2))
      ],
      [
        ...generateNumbersBetween(currColor[2], currColor[2], Math.ceil(width / 2)),
        ...generateNumbersBetween(currColor[2], nextColor[2], Math.ceil(width / 2))
      ]
    ]
  }

  return [
    generateNumbersBetween(currColor[0], nextColor[0], width),
    generateNumbersBetween(currColor[1], nextColor[1], width),
    generateNumbersBetween(currColor[2], nextColor[2], width)
  ]
}

self.addEventListener('message', (event: MessageEvent<ColorsMessagePayload>) => {
  const {channel, colorChannel, colors, height, index} = event.data
  const originalWidth = event.data.width
  const halfWidth = Math.ceil(originalWidth / 2)
  let width = originalWidth

  if (!index) {
    width += halfWidth
  }

  const size = width * height

  const buffer = new ArrayBuffer(size * 4)
  const result = new Uint8ClampedArray(buffer)

  const [lightness, chroma, hue] = generatePixels(index, colors[0], colors[1], width)

  for (let pixelIndex = 0; pixelIndex < size; pixelIndex += 1) {
    const bufferIndex = pixelIndex * 4

    const x = pixelIndex % width
    const y = Math.floor(pixelIndex / width)

    const resultColor = [lightness[x], chroma[x], hue[x]]
    const config = LCH_CHANNELS_CONFIG[colorChannel as keyof typeof LCH_CHANNELS_CONFIG]

    if (colorChannel === LCH_CHANNELS_NAMES.LIGHTNESS) {
      resultColor[0] = config.max - y / height
    } else if (colorChannel === LCH_CHANNELS_NAMES.CHROMA) {
      resultColor[1] = (config.max * (height - y)) / height
    } else if (colorChannel === LCH_CHANNELS_NAMES.HUE) {
      resultColor[2] = config.max - (config.max * y) / height
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
