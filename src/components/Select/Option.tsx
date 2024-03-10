import {HTMLAttributes, MouseEvent, useCallback, useMemo} from 'react'

import {cls} from '../../utils/cls.ts'

type SelectOptionProps<GOption> = Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> & {
  highlighted?: boolean
  label: string
  onClick: (option: GOption, event: MouseEvent<HTMLDivElement>) => void
  option: GOption
  selected?: boolean
}

const SelectOption = <GOption,>({
  highlighted,
  label,
  onClick,
  option,
  selected,
  ...restProps
}: SelectOptionProps<GOption>) => {
  const className = useMemo(() => {
    return cls('input__option', highlighted && 'input__option_current')
  }, [highlighted])

  const handleOptionClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()

      onClick(option, event)
    },
    [onClick, option]
  )

  return (
    <div
      aria-selected={selected}
      className={className}
      role={'option'}
      onClick={handleOptionClick}
      {...restProps}
    >
      {label}
    </div>
  )
}

export default SelectOption
