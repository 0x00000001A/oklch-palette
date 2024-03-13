import {FC, useCallback, useState} from 'react'

import IconColorSpace from '../../../icons/IconColorSpace.tsx'
import Dropdown from '../Dropdown/Dropdown.tsx'
import {BaseOption} from '../Dropdown/types.ts'

import {colorSpacesOptions} from './data.tsx'

const ColorSpaceDropdown: FC = () => {
  const [value, setValue] = useState<BaseOption>(colorSpacesOptions[0])

  const handleChange = useCallback((option: BaseOption) => {
    document.body.style.filter = option.raw ? option.raw : `url(#${option.value})`
    setValue(option)
  }, [])

  return (
    <Dropdown
      icon={<IconColorSpace />}
      optionLabelProp={'label'}
      options={colorSpacesOptions}
      value={value}
      onChange={handleChange}
    />
  )
}

export default ColorSpaceDropdown
