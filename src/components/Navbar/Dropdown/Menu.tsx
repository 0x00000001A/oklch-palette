import {
  ForwardedRef,
  ReactElement,
  RefAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react'
import {createPortal} from 'react-dom'

import useEventListener from '../../../hooks/useEventListener.ts'
import {cls} from '../../../utils/cls.ts'

import Option from './Option.tsx'
import {BaseOption, MenuProps} from './types.ts'

const MenuInternal = <GOption extends BaseOption = BaseOption>(
  {onClick, open, options, rootRef, ...restProps}: MenuProps<GOption>,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const optionsList = useMemo(() => {
    if (!open) {
      return null
    }

    return options.map((option) => (
      <Option key={option.value} option={option} onClick={onClick} />
    ))
  }, [onClick, open, options])

  const calculateDropdownRect = useCallback(() => {
    const root = rootRef.current
    const dropdown = dropdownRef.current

    if (!root || !dropdown) {
      return
    }

    const rootRect = root.getBoundingClientRect()

    dropdown.style.top = `${rootRect.y}px`
    dropdown.style.minWidth = `${rootRect.width}px`
    dropdown.style.maxHeight = window.innerHeight - rootRect.y - 8 + 'px'

    const dropdownRect = dropdown.getBoundingClientRect()

    if (rootRect.left > window.innerWidth / 2) {
      dropdown.style.left =
        rootRect.left - Math.abs(rootRect.width - dropdownRect.width) + 'px'
    } else {
      dropdown.style.left = `${rootRect.left}px`
    }
  }, [rootRef])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(calculateDropdownRect, [open])

  useEventListener(window, 'resize', calculateDropdownRect)
  useEventListener(window, 'scroll', calculateDropdownRect)

  useImperativeHandle(ref, () => dropdownRef.current as HTMLDivElement)

  return createPortal(
    <div
      className={cls('navbar-dropdown__menu', !open && 'navbar-dropdown__menu_hidden')}
      {...restProps}
      ref={dropdownRef}
    >
      {optionsList}
    </div>,
    document.body
  )
}

const Menu = forwardRef(MenuInternal) as unknown as <
  GOption extends BaseOption = BaseOption
>(
  props: MenuProps<GOption> & RefAttributes<HTMLDivElement>
) => ReactElement

export default Menu
