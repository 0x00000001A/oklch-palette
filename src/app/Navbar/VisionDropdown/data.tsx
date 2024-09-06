// statistics from https://en.wikipedia.org/wiki/Color_blindness
// and other open sources

export const visionOptions = [
  {
    label: 'Normal',
    value: 'normal'
  },
  {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/filter
    label: 'Grayscale',
    raw: 'grayscale(100%)',
    value: 'grayscale'
  },
  {
    // ref: https://www.ashleysheridan.co.uk/blog/Testing+Colour+Blindness+Effects+Online+with+SVG+Filters
    label: 'Deuteranomaly',
    statistic: 5.35,
    value: 'deuteranomaly'
  },
  {
    // ref: https://developer.chrome.com/docs/chromium/cvd
    label: 'Deuteranopia',
    statistic: 1.21,
    value: 'deuteranopia'
  },
  {
    label: 'Protanomaly',
    statistic: 1.32,
    value: 'protanomaly'
  },
  {
    // ref: https://developer.chrome.com/docs/chromium/cvd
    label: 'Protanopia',
    statistic: 1.32,
    value: 'protanopia'
  },
  {
    label: 'Tritanomaly',
    statistic: 0.0002,
    value: 'tritanomaly'
  },
  {
    // ref: https://developer.chrome.com/docs/chromium/cvd
    label: 'Tritanopia',
    statistic: 0.016,
    value: 'tritanopia'
  },
  {
    // ref: https://developer.chrome.com/docs/chromium/cvd
    label: 'Achromatopsia',
    statistic: 0.00003,
    value: 'achromatopsia'
  }
]
