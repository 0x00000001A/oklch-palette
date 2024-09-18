import {HTMLAttributes} from 'react'

import {PaletteColor} from '../../store/PaletteStore.ts'

export type ColorBarProps = HTMLAttributes<HTMLDivElement>

export type ColorBarItemProps = Omit<ColorBarProps, 'color' | 'colorsFrom'> & {
  color: PaletteColor
}
