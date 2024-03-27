import {HTMLAttributes, PropsWithChildren} from 'react'

export type PanelProps = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren & {
    noPadding?: boolean
  }
