import {FC, InputHTMLAttributes} from 'react'
import './index.css'
import {cls} from '../../utils/cls.ts'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

const Input: FC<InputProps> = ({style, className, ...restProps}) => {
  return (
    <div className={cls('input', className)} style={style}>
      <input className={'input__element'} {...restProps} />
    </div>
  )
}

export default Input
