import {Matrix, Vector, multiplyMatrixAndVector} from './math.ts'

export type Color = [number, number, number]

export function isWithinGamut(rgb: Color) {
  const EPS = 0.000005
  return rgb.reduce((a, b) => a && b >= 0 - EPS && b <= 1 + EPS, true)
}

export function rgbToFloat(rgb: Color) {
  return rgb.map((channelColor) => channelColor / 255) as Color
}

// https://www.w3.org/TR/css-color-4/
export function rgbChannelToLinear(value: number): number {
  if (value <= 0.04045) {
    return value / 12.92
  }

  return Math.pow((value + 0.055) / 1.055, 2.4)
}

// https://www.w3.org/TR/css-color-4/
export function rgbToLinearRgb(rgb: Color): Color {
  return [
    rgbChannelToLinear(rgb[0]),
    rgbChannelToLinear(rgb[1]),
    rgbChannelToLinear(rgb[2])
  ]
}

// https://www.w3.org/TR/css-color-4/
export function rgbToXyz(rgb: Color): Color {
  const srgb = rgbToFloat(rgb)
  const linearRgb = rgbToLinearRgb(srgb)

  const xyzMatrix: Matrix = [
    [506752 / 1228815, 87881 / 245763, 12673 / 70218],
    [87098 / 409605, 175762 / 245763, 12673 / 175545],
    [7918 / 409605, 87881 / 737289, 1001167 / 1053270]
  ]

  return multiplyMatrixAndVector(xyzMatrix, linearRgb)
}

export const rgbToP3 = (rgb: Color): Color => {
  const xyz = rgbToXyz(rgb)

  const xyzMatrix: Matrix = [
    [446124 / 178915, -333277 / 357830, -72051 / 178915],
    [-14852 / 17905, 63121 / 35810, 423 / 17905],
    [11844 / 330415, -50337 / 660830, 316169 / 330415]
  ]

  const xyzP3 = multiplyMatrixAndVector(xyzMatrix, xyz)

  return rgbGammaCorrected(xyzP3)
}

function gam2020(rgb: Color): Color {
  const Alpha = 1.09929682680944
  const Beta = 0.018053968510807

  return rgb.map((val: number) => {
    const Sign = val < 0 ? -1 : 1
    const Absolute = Math.abs(val)

    if (Absolute > Beta) {
      return Sign * (Alpha * Math.pow(Absolute, 0.45) - (Alpha - 1))
    }

    return 4.5 * val
  }) as Color
}

export const rgbToRec2020 = (rgb: Color): Color => {
  const xyz = rgbToXyz(rgb)

  const xyzMatrix: Matrix = [
    [30757411 / 17917100, -6372589 / 17917100, -4539589 / 17917100],
    [-19765991 / 29648200, 47925759 / 29648200, 467509 / 29648200],
    [792561 / 44930125, -1921689 / 44930125, 42328811 / 44930125]
  ]

  const xyzRec2020 = multiplyMatrixAndVector(xyzMatrix, xyz)

  return gam2020(xyzRec2020)
}

// 0.3, 0.49, 0.34
// rgb(40, 141, 96)

// P3 TO RGB CONVERSION
// const p3lin = [0.32, 0.01, 0.42]
//
// function lin_P3_to_XYZ(rgb) {
//   // convert an array of linear-light display-p3 values to CIE XYZ
//   // using  D65 (no chromatic adaptation)
//   // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
//   var M = [
//     [608311 / 1250200, 189793 / 714400, 198249 / 1000160],
//     [35783 / 156275, 247089 / 357200, 198249 / 2500400],
//     [0 / 1, 32229 / 714400, 5220557 / 5000800]
//   ]
//
//   return multiplyMatrices(M, rgb)
// }
//
// const validXYZ = lin_P3_to_XYZ(rgbToLinearRgb(p3lin))
//
// console.log(rgbFloatToInt(rgbGammaCorrected(xyzToRgb(validXYZ))))

// https://bottosson.github.io/posts/oklab/
// Given XYZ relative to D65, convert to OKLab
// XYZ <-> LMS matrices recalculated for consistent reference white
// see https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-943521484
// recalculated for 64bit precision
// see https://github.com/color-js/color.js/pull/357
export function xyzToOklab(xyz: Color): Color {
  const m1: Matrix = [
    [0.819022437996703, 0.3619062600528904, -0.1288737815209879],
    [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
    [0.0481771893596242, 0.2642395317527308, 0.6335478284694309]
  ]

  const lms = multiplyMatrixAndVector(m1, xyz)
  const lmsNonLinear = lms.map(Math.cbrt) as Vector

  const m2: Matrix = [
    [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
    [1.9779985324311684, -2.4285922420485799, 0.450593709617411],
    [0.0259040424655478, 0.7827717124575296, -0.8086757549230774]
  ]

  return multiplyMatrixAndVector(m2, lmsNonLinear) as Color
}

// http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
export function oklabToOklch(oklab: Color): Color {
  const l = oklab[0]
  const c = Math.sqrt(Math.pow(oklab[1], 2) + Math.pow(oklab[2], 2))
  const hRad = Math.atan2(oklab[2], oklab[1])
  const hDeg = (hRad * 180) / Math.PI
  const h = hDeg < 0 ? hDeg + 360 : hDeg

  return [l, c, h]
}

export function hexShortToFull(hex: string) {
  const hexShortRegexp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i

  return hex.replace(hexShortRegexp, (_, r, g, b) => {
    return '#' + r + r + g + g + b + b
  })
}

export function hexToRgb(hex: string): Color {
  const channels = hexShortToFull(hex).substring(1).match(/.{2}/g)

  if (!channels) {
    throw new Error(`Unable to parse hex value: ${hex}`)
  }

  return channels.map((value) => parseInt(value, 16)) as Color
}

// http://www.brucelindbloom.com/index.html?Eqn_RGB_to_XYZ.html
export function oklchToOklab(oklch: Color): Color {
  const l = oklch[0]
  const hRad = (oklch[2] * Math.PI) / 180
  const a = oklch[1] * Math.cos(hRad)
  const b = oklch[1] * Math.sin(hRad)

  return [l, a, b]
}

// https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-1490068959
export function oklabToXyz(oklab: Color): Color {
  const m1: Matrix = [
    [1.0, 0.3963377773761749, 0.21580375730991364],
    [1.0, -0.10556134581565857, -0.0638541728258133],
    [1.0, -0.08948418498039246, -1.2914855480194092]
  ]

  const lms = multiplyMatrixAndVector(m1, oklab) as Color
  const lmsNonLinear = lms.map((c) => Math.pow(c, 3)) as Color

  const m2: Matrix = [
    [1.226879868224423, -0.5578149934498884, 0.281391052277137],
    [-0.04057574728813353, 1.1122868053350754, -0.07171105804694196],
    [-0.0763729441641797, -0.42149332236303205, 1.5869240172870902]
  ]

  return multiplyMatrixAndVector(m2, lmsNonLinear)
}

// https://www.w3.org/TR/css-color-4/#color-conversion-code
export function xyzToRgb(xyz: Color): Color {
  const m: Matrix = [
    [12831 / 3959, -329 / 214, -1974 / 3959],
    [-851781 / 878810, 1648619 / 878810, 36519 / 878810],
    [705 / 12673, -2585 / 12673, 705 / 667]
  ]

  return multiplyMatrixAndVector(m, xyz)
}

export function rgbGammaCorrected(rgb: Color): Color {
  return rgb.map((channelValue) => {
    if (channelValue > 0.0031308) {
      return 1.055 * Math.pow(channelValue, 1 / 2.4) - 0.055
    }

    return 12.92 * channelValue
  }) as Color
}

export function rgbFloatToInt(rgb: Color): Color {
  return rgb.map((channelValue) => Math.round(channelValue * 255)) as Color
}

export function oklchToRgb(oklch: Color) {
  const oklab = oklchToOklab(oklch)
  const xyz = oklabToXyz(oklab)
  const rgb = xyzToRgb(xyz)

  return rgbGammaCorrected(rgb)
}

export function rgbToHex([r, g, b]: [number, number, number]) {
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}
