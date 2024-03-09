import {HTMLAttributes, MouseEvent, useCallback, useMemo} from 'react'
import {cls} from '../../utils/cls.ts'

type SelectOptionProps<GOption> = Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> & {
  option: GOption
  label: string
  selected?: boolean
  highlighted?: boolean
  onClick: (option: GOption, event: MouseEvent<HTMLDivElement>) => void
}

const SelectOption = <GOption,>({
  label,
  option,
  selected,
  highlighted,
  onClick,
  ...restProps
}: SelectOptionProps<GOption>) => {
  const className = useMemo(() => {
    return cls('input__option', highlighted && 'input__option_current')
  }, [highlighted])

  const handleOptionClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()

      if (!onClick) {
        return
      }

      onClick(option, event)
    },
    [onClick, option]
  )

  return (
    <div
      className={className}
      role={'option'}
      aria-selected={selected}
      onClick={handleOptionClick}
      {...restProps}
    >
      {label}
    </div>
  )
}

export default SelectOption
