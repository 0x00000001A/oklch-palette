import {FC} from 'react'

import {cls} from '../../utils/cls.ts'

import {PanelProps} from './types.ts'

import './index.css'

const Panel: FC<PanelProps> = ({className, ...restProps}) => {
  return <div className={cls('panel', className)} {...restProps} />
}

export default Panel
