import {FC} from 'react'

import {cls} from '../../utils/cls.ts'

import {PanelProps} from './types.ts'

import './index.css'

const Panel: FC<PanelProps> = ({className, noPadding, ...restProps}) => {
  return <div className={cls('panel', noPadding && 'panel_no-padding', className)} {...restProps} />
}

export default Panel
