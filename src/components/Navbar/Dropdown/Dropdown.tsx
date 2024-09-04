import {useCallback, useRef, useState} from 'react'

import useClickOutside from '../../../hooks/useClickOutside.ts'
import IconArrowDropdown from '../../../icons/IconArrowDropdown.tsx'
import IconLoading from '../../../icons/IconLoading.tsx'

import Menu from './Menu.tsx'
import {BaseOption, DropdownProps} from './types.ts'

import './index.css'

const Dropdown = <GOption extends BaseOption = BaseOption>({
  icon,
  label = 'No value',
  loading,
  onChange,
  optionLabelProp = 'label',
  options,
  value
}: DropdownProps<GOption>) => {
  const [open, setOpen] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = useCallback(() => {
    setOpen(!open)
  }, [open])

  const handleOptionClick = useCallback(
    (option: GOption) => {
      toggleDropdown()
      onChange && onChange(option)
    },
    [onChange, toggleDropdown]
  )

  const handleClickOutside = () => {
    setOpen(false)
  }

  useClickOutside([rootRef, dropdownRef], handleClickOutside)

  return (
    <div className={'navbar-dropdown'} ref={rootRef}>
      <button className={'navbar__button'} onClick={toggleDropdown}>
        {loading ? <IconLoading /> : icon}
        {value ? value[optionLabelProp] : label}
        <IconArrowDropdown width={'.7em'} />
      </button>
      <Menu<GOption>
        open={open}
        options={options}
        ref={dropdownRef}
        rootRef={rootRef}
        onClick={handleOptionClick}
      />
    </div>
  )
}

export default Dropdown
