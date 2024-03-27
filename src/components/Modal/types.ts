import {HTMLProps, ReactNode} from 'react'

import {AnyFunction} from '../../utils/types.ts'

export type ModalProps = HTMLProps<HTMLDivElement> & {
  body?: ReactNode | string
  footer?: ReactNode | string
  onClose?: AnyFunction
  open?: boolean
  title?: ReactNode | string
  width?: number
}
