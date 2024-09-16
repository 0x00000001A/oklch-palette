import {FC, useCallback, useMemo} from 'react'

import useBemClassName from '../../hooks/useBemClassName.ts'
import {useColorsStore} from '../../state'
import {getColorByDirection, isColorSelectedByDirection} from '../../state/selectors.ts'
import {colorCompare} from '../../utils/compare.ts'

import {ColorBarItemProps} from './types.ts'

const ColorBarItem: FC<ColorBarItemProps> = ({
  className,
  colorsFrom,
  index,
  style,
  ...restProps
}) => {
  const setSelectedColor = useColorsStore((state) => state.setSelectedColorInDirection)

  const color = useColorsStore(getColorByDirection(colorsFrom, index), colorCompare)
  const isSelected = useColorsStore(isColorSelectedByDirection(colorsFrom, index))

  const bemClassName = useBemClassName(
    (builder) => {
      const element = builder('color-bar__item', className)
      element.withModifier('selected', isSelected)

      return {colorBarItem: element.build()}
    },
    [className, isSelected]
  )

  const handleClick = useCallback(() => {
    setSelectedColor(colorsFrom, index)
  }, [colorsFrom, index, setSelectedColor])

  const styles = useMemo(() => {
    return {...style, color: color.isValid ? color.hex : 'transparent'}
  }, [color.hex, color.isValid, style])

  return (
    <div
      className={bemClassName.colorBarItem}
      style={styles}
      onClick={handleClick}
      {...restProps}
    />
  )
}

export default ColorBarItem
