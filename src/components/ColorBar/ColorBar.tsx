import {observer} from 'mobx-react-lite'
import {FC} from 'react'

import {PaletteColor} from '../../store/PaletteStore.ts'

import ColorBarItem from './ColorBarItem.tsx'
import {ColorBarProps} from './types.ts'

import './index.css'

const ColorBar: FC<ColorBarProps & {colors?: PaletteColor[]}> = observer(({colors}) => {
  if (!colors) {
    return null
  }

  return (
    <div className={'color-bar'} style={{flexGrow: 1}}>
      {colors.map((color) => (
        <ColorBarItem color={color} key={color.id} />
      ))}
    </div>
  )
})

export default ColorBar
