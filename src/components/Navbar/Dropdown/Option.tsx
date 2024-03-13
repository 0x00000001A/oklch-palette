import {useCallback} from 'react'

import {BaseOption, OptionProps} from './types.ts'

const Option = <GOption extends BaseOption = BaseOption>({
  onClick,
  option
}: OptionProps<GOption>) => {
  const handleClick = useCallback(() => {
    onClick(option)
  }, [onClick, option])

  return (
    <div className={'navbar-dropdown__item'} key={option.value} onClick={handleClick}>
      {option.label}
    </div>
  )
}

export default Option
