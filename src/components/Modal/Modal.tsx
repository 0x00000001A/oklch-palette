import {FC} from 'react'
import {createPortal} from 'react-dom'
import {CSSTransition} from 'react-transition-group'

import IconCloseCircle from '../../icons/IconCloseCircle.tsx'

import {ModalProps} from './types.ts'

import './styles.css'

const ModalImplementation: FC<ModalProps> = ({
  body,
  footer,
  onClose,
  open,
  title,
  width,
  ...htmlProps
}) => {
  return (
    <>
      <CSSTransition classNames={'modal'} in={open} timeout={550} unmountOnExit>
        <div className={'modal'} style={{width}} {...htmlProps}>
          <div className={'modal__header'}>
            <div className={'modal__title'}>{title}</div>
            <button
              className={'modal__close navbar__button'}
              style={{borderRadius: 24, padding: 2}}
              onClick={onClose}
            >
              <IconCloseCircle />
            </button>
          </div>
          <div className={'modal__body'}>{body}</div>
          <div className={'modal__footer'}>{footer}</div>
        </div>
      </CSSTransition>
      <CSSTransition classNames={'modal'} in={open} timeout={250} unmountOnExit>
        <div className={'modal__backdrop'} />
      </CSSTransition>
    </>
  )
}

const Modal: FC<ModalProps> = (props) => {
  return createPortal(<ModalImplementation {...props} />, document.body)
}

export default Modal
