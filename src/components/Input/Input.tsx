import {FC, InputHTMLAttributes} from 'react'

import {cls} from '../../utils/cls.ts'

import './index.css'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

const Input: FC<InputProps> = ({className, style, ...restProps}) => {
  return (
    <div className={cls('input', className)} style={style}>
      <input className={'input__element'} {...restProps} />
    </div>
  )
}

export default Input
