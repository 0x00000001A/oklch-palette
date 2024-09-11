import {APCAcontrast, sRGBtoY} from 'apca-w3'

import {Analyzer, AnalyzerResult} from './types.ts'

const APCA_MINIMUM_RATIOS = [
  {label: 'Fail', success: false, value: 0},
  {label: 'UI Only', success: true, value: 15},
  {label: 'Large text', success: true, value: 45},
  {label: 'Normal', success: true, value: 60},
  {label: 'Good', success: true, value: 68.95},
  {label: 'Best', success: true, value: 75}
]

const apcaw3Internal = (
  foregroundColor: number[],
  backgroundColor: number[]
): AnalyzerResult => {
  const ratio = Math.abs(
    Number(
      APCAcontrast(sRGBtoY(foregroundColor as never), sRGBtoY(backgroundColor as never))
    )
  )

  let success = false
  let value = 0
  let label = 'Fail'

  for (const minRatio of APCA_MINIMUM_RATIOS) {
    if (ratio > minRatio.value) {
      success = minRatio.success
      value = Math.floor(ratio * 10) / 10
      label = minRatio.label
    }
  }

  return {backgroundColor, foregroundColor, label, success, value}
}

export const apcaw3: Analyzer = (foregroundColor, backgroundColor) => {
  return [
    apcaw3Internal(foregroundColor, backgroundColor),
    apcaw3Internal(backgroundColor, foregroundColor)
  ]
}
