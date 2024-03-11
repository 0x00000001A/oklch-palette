import {HTMLAttributes} from 'react'

export type ColorBarProps = HTMLAttributes<HTMLDivElement> & {
  colorsFrom: 'column' | 'row'
}

export type ColorBarItemProps = ColorBarProps & {index: number}
