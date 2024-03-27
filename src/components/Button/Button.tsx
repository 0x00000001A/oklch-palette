import {FC} from 'react'

import {cls} from '../../utils/cls.ts'

import {ButtonProps} from './types.ts'

import './index.css'

const Button: FC<ButtonProps> = ({className, ...restProps}) => {
  return <button className={cls(className, 'button')} {...restProps} />
}

export default Button
