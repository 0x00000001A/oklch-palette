import {HTMLAttributes} from 'react'

export type ColorBarProps = HTMLAttributes<HTMLDivElement> & {
  colorsFrom: 'col' | 'row'
}
