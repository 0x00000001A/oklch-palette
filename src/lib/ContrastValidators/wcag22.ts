import {Analyzer, AnalyzerResult} from './types.ts'

function luminance([r, g, b]: number[]) {
  const [lumR, lumG, lumB] = [r, g, b].map<number>((component) => {
    const proportion = component / 255

    return proportion <= 0.03928
      ? proportion / 12.92
      : Math.pow((proportion + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB
}

function contrastRatio(luminance1: number, luminance2: number) {
  const lighterLum = Math.max(luminance1, luminance2)
  const darkerLum = Math.min(luminance1, luminance2)

  return (lighterLum + 0.05) / (darkerLum + 0.05)
}

const WCAG_MINIMUM_RATIOS = [
  {label: 'Fail', success: false, value: 0},
  {label: 'AA Large', success: true, value: 3},
  {label: 'AA', success: true, value: 4.5},
  {label: 'AAA', success: true, value: 7}
]

const wcag22Internal = (
  foregroundColor: number[],
  backgroundColor: number[]
): AnalyzerResult => {
  const [luminance1, luminance2] = [foregroundColor, backgroundColor].map(luminance)

  const ratio = contrastRatio(luminance1, luminance2)

  let success = false
  let value = 0
  let label = ''

  for (const minRatio of WCAG_MINIMUM_RATIOS) {
    if (ratio > minRatio.value) {
      success = minRatio.success
      value = Math.floor(ratio * 10) / 10
      label = minRatio.label
    }
  }

  return {backgroundColor, foregroundColor, label, success, value}
}

export const wcag22: Analyzer = (foregroundColor, backgroundColor) => {
  return {
    label: 'WCAG 2.2',
    results: {
      backward: wcag22Internal(backgroundColor, foregroundColor),
      forward: wcag22Internal(foregroundColor, backgroundColor)
    }
  }
}
