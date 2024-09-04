import {cssVariablesExporter} from './cssVariables'
import {figmaExporter} from './figma'
import {PaletteExporter} from './types'

export const paletteExporters: PaletteExporter[] = [
  {
    handler: figmaExporter,
    name: 'Figma'
  },
  {
    handler: cssVariablesExporter,
    name: 'CSS Variables'
  }
]
