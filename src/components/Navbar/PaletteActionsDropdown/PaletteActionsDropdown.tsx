import {FC, useCallback} from 'react'

import IconPlusCircle from '../../../icons/IconPlusCircle.tsx'
import {useColorsStore} from '../../../state'
import Dropdown from '../Dropdown/Dropdown.tsx'
import {BaseOption} from '../Dropdown/types.ts'

enum ACTIONS {
  ADD_COLOR_FAMILY,
  ADD_COLOR_TONES
}

const actions = [
  {
    label: 'Add to palette',
    value: 1
  },
  {
    label: 'Add color family (row)',
    value: ACTIONS.ADD_COLOR_FAMILY
  },
  {
    label: 'Add color tones (column)',
    value: ACTIONS.ADD_COLOR_TONES
  }
]

const PaletteActionsDropdown: FC = () => {
  const addToPalette = useColorsStore((state) => state.addToPalette)

  const handleChange = useCallback(
    (option: BaseOption) => {
      if (option.value === ACTIONS.ADD_COLOR_FAMILY) {
        addToPalette({direction: 'row'})
        return
      }

      if (option.value === ACTIONS.ADD_COLOR_TONES) {
        addToPalette({direction: 'col'})
      }
    },
    [addToPalette]
  )

  return (
    <Dropdown
      icon={<IconPlusCircle />}
      optionLabelProp={'label'}
      options={actions.slice(1)}
      value={actions[0]}
      onChange={handleChange}
    />
  )
}

export default PaletteActionsDropdown
