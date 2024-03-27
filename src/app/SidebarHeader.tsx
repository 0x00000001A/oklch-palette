import {ChangeEvent, FC, useCallback, useEffect, useState} from 'react'

import {Button} from '../components/Button'
import {ColorBar} from '../components/ColorBar'
import ColorForm from '../components/ColorForm/ColorForm.tsx'
import {Input} from '../components/Input'
import {Panel} from '../components/Panel'
import {useColorsStore} from '../state'
import {isValidHex} from '../utils/colors.ts'

export type SidebarHeaderProps = {
  // props
}

const ColorInfoForm: FC = () => {
  const value = useColorsStore((state) => {
    return state.getSelectedColor().hex
  })

  const [draftHex, setDraftHex] = useState(value)

  const updateValue = useColorsStore((state) => state.setSelectedColorValue)

  const handleHexValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const hex = event.target.value

      setDraftHex(event.target.value)

      if (isValidHex(hex)) {
        updateValue(hex)
      }
    },
    [updateValue]
  )

  const handleColorHexChanged = useCallback(() => {
    setDraftHex(value)
  }, [value])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleColorHexChanged, [value])

  return (
    <div className={'color-info__form'}>
      <label>Hex value:</label>
      <Input
        style={{textAlign: 'right'}}
        value={draftHex}
        onChange={handleHexValueChange}
      />
      <Button>Apply</Button>
      <Button>Copy</Button>
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
