import {observer} from 'mobx-react-lite'
import {FC, useMemo} from 'react'

import useBemClassName from '../../hooks/useBemClassName.ts'

import {ColorBarItemProps} from './types.ts'

const ColorBarItem: FC<ColorBarItemProps> = observer(
  ({className, color, style, ...restProps}) => {
    const bemClassName = useBemClassName(
      (builder) => {
        const element = builder('color-bar__item', className)
        element.withModifier('selected', color.isSelected)

        return {colorBarItem: element.build()}
      },
      [className, color.isSelected]
    )

    const styles = useMemo(() => {
      return {...style, color: color.isValid ? color.hex : 'transparent'}
    }, [color.hex, color.isValid, style])

    return (
      <div
        className={bemClassName.colorBarItem}
        style={styles}
        onClick={color.setSelected}
        {...restProps}
      />
    )
  }
)

export default ColorBarItem
