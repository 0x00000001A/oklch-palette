import {FC} from 'react'

import useBemClassName from '../../hooks/useBemClassName.ts'

import {FlexProps} from './types.ts'

const Flex: FC<FlexProps> = ({className, isInline, ...restProps}) => {
  const bemClassName = useBemClassName(
    (builder) => {
      const block = builder('flex', className)

      block.withModifier('inline', isInline)

      /*
      if direction is horizontal then
        align-items for align vertically
        justify-content for align horizontally

      if direction is vertical then
        align-items for align horizontally
        justify-content for align vertically
       */

      // block.withModifier('vertical', true)
      // block.withModifier('horizontal', true)

      return {
        root: block.build()
      }
    },
    [className]
  )

  return <div className={bemClassName.root} {...restProps} />
}

export default Flex
