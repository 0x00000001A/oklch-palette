import {HTMLProps} from 'react'

import {AnyFunction} from '../../utils/types.ts'

export type ModalProps = HTMLProps<HTMLDivElement> & {
  onClose?: AnyFunction
  open?: boolean
}
