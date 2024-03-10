import {FC} from 'react'

import useBemClassName from '../../hooks/useBemClassName.ts'

import {SplitContainerProps} from './types.ts'

import './index.css'

const SplitContainer: FC<SplitContainerProps> = ({
  className,
  direction = 'horizontal',
  ...restProps
}) => {
  const bemClassName = useBemClassName(
    (builder) => {
      const block = builder('split-container', className)

      block.withModifier('vertical', direction === 'vertical')
      block.withModifier('horizontal', direction === 'horizontal')

      return {
        splitContainer: block.build()
      }
    },
    [className, direction]
  )

  return <div className={bemClassName.splitContainer} {...restProps} />
}

export default SplitContainer
