import {FC, useCallback, useState} from 'react'

import IconSavedPalettes from '../../../icons/IconSavedPalettes.tsx'
import palettes from '../../../palettes'
import Dropdown from '../Dropdown/Dropdown.tsx'
import {useColorsStore} from '../../../state'

const palettesOptions = Object.values(palettes).map((palette) => ({
  ...palette,
  label: palette.name,
  value: palette.name
}))

const PaletteDropdown: FC = () => {
  const setPalette = useColorsStore((state) => state.setPalette)

  const [value, setValue] = useState<(typeof palettesOptions)[0]>(palettesOptions[0])
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback(
    (option: (typeof palettesOptions)[0]) => {
      setValue(option)
      setLoading(true)

      option
        .lazyImport()
        .then((module) => {
          setPalette(module.default)
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false)
          }, 240)
        })
    },
    [setPalette]
  )

  return (
    <Dropdown
      icon={<IconSavedPalettes />}
      loading={loading}
      optionLabelProp={'label'}
      options={palettesOptions}
      value={value}
      onChange={handleChange}
    />
  )
}

export default PaletteDropdown
