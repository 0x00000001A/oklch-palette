import {FC, useCallback, useState} from 'react'

import IconEye from '../../../icons/IconEye.tsx'
import Dropdown from '../Dropdown/Dropdown.tsx'
import {BaseOption} from '../Dropdown/types.ts'

import {visionOptions} from './data.tsx'
import VisionFilters from './filters.svg?react'
import {VisionDropdownLabelProps} from './types.ts'

const VisionDropdownLabel: FC<VisionDropdownLabelProps> = ({description, label}) => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      gap: 16,
      justifyContent: 'space-between'
    }}
  >
    {label} {description && <small>≈{description}% of users</small>}
  </div>
)

const options = visionOptions.map((option, index) => ({
  ...option,
  label: (
    <VisionDropdownLabel
      description={option.statistic}
      key={index}
      label={option.label}
    />
  ),
  name: option.label
}))

const VisionDropdown: FC = () => {
  const [value, setValue] = useState<BaseOption>(options[0])

  const handleChange = useCallback((option: BaseOption) => {
    document.body.style.filter = option.raw ? option.raw : `url(#${option.value})`
    setValue(option)
  }, [])

  return (
    <>
      <VisionFilters />
      <Dropdown
        icon={<IconEye />}
        optionLabelProp={'name'}
        options={options}
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

export default VisionDropdown
