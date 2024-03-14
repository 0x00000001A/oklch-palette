import {FC} from 'react'
import {createPortal} from 'react-dom'

import {ModalProps} from './types.ts'

const ModalImplementation: FC<ModalProps> = ({onClose, ...htmlProps}) => {
  return (
    <div className={'modal'} {...htmlProps}>
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  )
}

const Modal: FC<ModalProps> = ({open, ...restProps}) => {
  if (!open) {
    return null
  }

  return createPortal(<ModalImplementation open {...restProps} />, document.body)
}

export default Modal
