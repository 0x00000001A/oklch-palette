import {FC} from 'react'
import useBemClassName from '../../hooks/useBemClassName.ts'
import './index.css'
import {SplitContainerProps} from './types.ts'

const SplitContainer: FC<SplitContainerProps> = ({
  direction = 'horizontal',
  className,
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
