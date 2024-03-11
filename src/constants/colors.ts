export const GRAPH_WIDTH = 400

export const GRAPH_HEIGHT = 140

export enum LCH_CHANNELS_NAMES {
  LIGHTNESS,
  CHROMA,
  HUE
}

export const LCH_CHANNELS_ARRAY = [
  LCH_CHANNELS_NAMES.LIGHTNESS,
  LCH_CHANNELS_NAMES.CHROMA,
  LCH_CHANNELS_NAMES.HUE
]

export const LCH_CHANNELS_CONFIG = {
  [LCH_CHANNELS_NAMES.CHROMA]: {
    max: 0.37,
    min: 0,
    name: 'Chroma',
    step: 0.005
  },
  [LCH_CHANNELS_NAMES.HUE]: {
    max: 360,
    min: 0,
    name: 'Hue',
    step: 0.5
  },
  [LCH_CHANNELS_NAMES.LIGHTNESS]: {
    max: 1,
    min: 0,
    name: 'Lightness',
    step: 0.005
  }
} as const
