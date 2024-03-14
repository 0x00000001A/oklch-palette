import {HTMLAttributes} from 'react'
import {ColorsDirection} from '../../state'

export type ColorBarProps = HTMLAttributes<HTMLDivElement> & {
  colorsFrom: ColorsDirection
}

export type ColorBarItemProps = ColorBarProps & {index: number}
