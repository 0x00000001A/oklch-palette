import {APCAcontrast, sRGBtoY} from 'apca-w3'

import {Analyzer, AnalyzerResult} from './types.ts'

const APCA_MINIMUM_RATIOS = [
  {label: 'Fail', success: false, value: 0},
  {
    label: 'UI',
    note: 'The absolute minimum for any non-text that needs to be discernible and differentiable, but does not apply to semantic non-text such as icons, and is no less than 15px in its smallest dimention. This may include dividers, and in some cases large buttons or thick focus visible outlines, but does not include fine details which have a higher minimum. Designers should treat anything below this level as invisible, as it will not be visible for many users. This minimum level should be avoided for any items important to the use, understanding, or interaction of the site.',
    success: true,
    value: 15
  },
  {
    label: 'UI and non-content text',
    note: 'The absolute minimum for any text considered as "spot readable". This includes placeholder text and disabled element text, and some non-content like a copyright bug. This is also the minimum for large/solid semantic & understandable non-text elements such as "mostly solid" icons or pictograms, no less than 10px in its smallest dimension.',
    success: true,
    value: 30
  },
  {
    label: 'UI and large text',
    note: 'The minimum for larger, heavier text (36px normal weight or 24px bold) such as headlines, and large text that should be fluently readable but is not body text. This is also the minimum for pictograms with fine details, or smaller outline icons, , no less than 4px in its smallest dimension.',
    success: true,
    value: 45
  },
  {
    label: 'Good',
    note: 'The minimum level recommended for content text that is not body, column, or block text. In other words, text you want people to read. The minimums: no smaller than 48px/200, 36px/300, 24px normal weight (400), 21px/500, 18px/600, 16px/700 (bold). These values based on the reference font Helvetica. To use these sizes as body text, add Lc 15 to the minimum contrast.',
    success: true,
    value: 60
  },
  {
    label: 'Best',
    note: 'The minimum level for columns of body text with a font no smaller than 24px/300 weight, 18px/400, 16px/500 and 14px/700. This level may be used with non-body text with a font no smaller than 15px/400. Also, Lc 75 should be considered a minimum for larger for any larger text where readability is important.',
    success: true,
    value: 75
  },
  {
    label: 'Best',
    note: ' Preferred level for fluent text and columns of body text with a font no smaller than 18px/weight 300 or 14px/weight 400 (normal), or non-body text with a font no smaller than 12px. Also a recommended minimum for extremely thin fonts with a minimum of 24px at weight 200. Lc 90 is a suggested maximum for very large and bold fonts (greater than 36px bold), and large areas of color.',
    success: true,
    value: 90
  }
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
  let note

  for (const minRatio of APCA_MINIMUM_RATIOS) {
    if (ratio > minRatio.value) {
      success = minRatio.success
      value = Math.floor(ratio * 10) / 10
      label = minRatio.label
      note = minRatio.note
    }
  }

  return {backgroundColor, foregroundColor, label, note, success, value}
}

export const apcaw3: Analyzer = (foregroundColor, backgroundColor) => {
  return {
    label: 'APCA',
    results: {
      backward: apcaw3Internal(backgroundColor, foregroundColor),
      forward: apcaw3Internal(foregroundColor, backgroundColor)
    }
  }
}
