import type {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities'
import {HTMLAttributes} from 'react'

export type PaletteRowProps = HTMLAttributes<HTMLTableRowElement> & {
  'data-row-key': string
}

export type PaletteRowContextProps = {
  listeners?: SyntheticListenerMap
  setActivatorNodeRef?: (element: HTMLElement | null) => void
}

export type PaletteRowData = {
  key: string
  rowIndex: number
  rowName: string
}
