import {HTMLAttributes, PropsWithChildren} from 'react'

export type SplitContainerProps = PropsWithChildren &
  HTMLAttributes<HTMLDivElement> & {
    direction?: 'horizontal' | 'vertical'
  }
