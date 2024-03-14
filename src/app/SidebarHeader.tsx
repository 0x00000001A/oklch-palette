import {FC} from 'react'

import {ColorBar} from '../components/ColorBar'
import ColorForm from '../components/ColorForm/ColorForm.tsx'
import {Input} from '../components/Input'
import {Panel} from '../components/Panel'
import {useColorsStore} from '../state'

export type SidebarHeaderProps = {
  // props
}

const ColorInfoForm: FC = () => {
  const value = useColorsStore((state) => {
    return state.getSelectedColor().hex
  })

  return (
    <div className={'color-info__form'}>
      <label>Hex value:</label>
      <Input style={{textAlign: 'right'}} value={value} onChange={console.log} />
      <button className={'pg-button'}>Apply</button>
      <button className={'pg-button'}>Copy</button>
    </div>
  )
}

const ColorInfo: FC = () => {
  const name = useColorsStore((state) => {
    return `${state.rowNames[state.selectedRow]}-${state.colNames[state.selectedCol]}`
  })

  return (
    <div className={'color-info'}>
      <span className={'color-info__name'}>{name}</span>
      <ColorInfoForm />
    </div>
  )
}

const SidebarHeader: FC<SidebarHeaderProps> = () => {
  return (
    <Panel className={'sidebar-header'}>
      <ColorInfo />
      <ColorForm />
      <ColorBar colorsFrom={'row'} style={{flexGrow: 1}} />
      <ColorBar colorsFrom={'col'} style={{flexGrow: 1}} />
    </Panel>
  )
}

export default SidebarHeader
