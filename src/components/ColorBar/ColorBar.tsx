import {FC, useMemo} from 'react'

import {SchemaGroup, useColorsStore} from '../../state'
import {colorsNamesByDirection} from '../../state/selectors.ts'
import {arrayCompare} from '../../utils/compare.ts'

import ColorBarItem from './ColorBarItem.tsx'
import {ColorBarProps} from './types.ts'

import './index.css'

const ColorBar: FC<ColorBarProps> = ({colorsFrom, ...restProps}) => {
  const colorsNames = useColorsStore(colorsNamesByDirection(colorsFrom), arrayCompare)

  const colors = useMemo(() => {
    return colorsNames.map((data: SchemaGroup, index: number) => (
      <ColorBarItem colorsFrom={colorsFrom} index={index} key={data.id} />
    ))
  }, [colorsFrom, colorsNames])

  return (
    <div className={'color-bar'} {...restProps}>
      {colors}
    </div>
  )
}

export default ColorBar
