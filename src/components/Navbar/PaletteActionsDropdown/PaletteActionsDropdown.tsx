import {FC, useCallback, useState} from 'react'

import IconPlusCircle from '../../../icons/IconPlusCircle.tsx'
import {ColorFamilyModal} from '../ColorFamilyModal'
import {ColorTonesModal} from '../ColorTonesModal'
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
  const [actionStates, setActionStates] = useState<boolean[]>([true])

  // const addToPalette = useColorsStore((state) => state.addToPalette)

  const handleChange = useCallback(
    (option: BaseOption) => {
      const updatedActionStates = [...actionStates]

      updatedActionStates[option.value as ACTIONS] = true

      setActionStates(updatedActionStates)
    },
    [actionStates]
  )

  const handleModalClose = useCallback(() => {
    setActionStates([])
  }, [])

  return (
    <>
      <Dropdown
        icon={<IconPlusCircle />}
        optionLabelProp={'label'}
        options={actions.slice(1)}
        value={actions[0]}
        onChange={handleChange}
      />

      <ColorFamilyModal
        open={actionStates[ACTIONS.ADD_COLOR_FAMILY]}
        onClose={handleModalClose}
      />

      <ColorTonesModal
        open={actionStates[ACTIONS.ADD_COLOR_TONES]}
        onClose={handleModalClose}
      />
    </>
  )
}

export default PaletteActionsDropdown
