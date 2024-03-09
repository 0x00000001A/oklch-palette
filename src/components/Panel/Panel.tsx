import {FC} from 'react'
import {PanelProps} from './types.ts'
import './index.css'
import {cls} from '../../utils/cls.ts'

const Panel: FC<PanelProps> = ({className, ...restProps}) => {
  return <div className={cls('panel', className)} {...restProps} />
}

export default Panel
