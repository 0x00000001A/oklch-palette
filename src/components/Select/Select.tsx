/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion,@typescript-eslint/prefer-includes,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/restrict-plus-operands,@typescript-eslint/no-unnecessary-condition,@typescript-eslint/no-unsafe-argument */
import {
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'

import {cls} from '../../utils/cls.ts'

import {SelectActions, closeActions, navigationActions, openActions} from './constants.ts'
import {
  getActionFromKey,
  getIndexByLetter,
  isElementInView,
  isScrollable,
  maintainScrollVisibility
} from './helpers.ts'
import SelectOption from './Option.tsx'

import './index.css'

type SelectFieldNames<GOption> = {
  label: keyof GOption
  value: keyof GOption
}

type SelectProps<GValue, GOption> = HTMLAttributes<HTMLDivElement> & {
  fieldNames?: Partial<SelectFieldNames<GOption>>
  label?: string
  nothingSelectedLabel?: string
  options?: GOption[]
  value?: GValue
}

const defaultFieldNames = {
  label: 'label',
  value: 'value'
}

const Select = <GValue, GOption>({
  className,
  fieldNames: fieldNamesFromProps = defaultFieldNames as SelectFieldNames<GOption>,
  nothingSelectedLabel = 'Select an option',
  // value,
  options = [],
  ...restProps
}: SelectProps<GValue, GOption>) => {
  const listboxId = useId()
  const comboboxId = useId()

  const listboxRef = useRef<HTMLDivElement>(null)
  const comboboxRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<GOption>()
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [searchString, setSearchString] = useState('')
  const [searchTimeout, setSearchTimeout] = useState<number | undefined>()

  const lastIndex = useMemo(() => {
    return options.length - 1
  }, [options.length])

  const fieldNames = useMemo(() => {
    return {...defaultFieldNames, ...fieldNamesFromProps} as SelectFieldNames<GOption>
  }, [fieldNamesFromProps])

  const highlightedOptionId = useMemo(() => {
    return open ? `${listboxId}__${highlightedIndex}` : undefined
  }, [highlightedIndex, listboxId, open])

  const updateOpenState = useCallback(
    (open: boolean, focusCombobox: boolean = false) => {
      setOpen(open)

      if (!comboboxRef.current) {
        return
      }

      if (!highlightedOptionId && !isElementInView(comboboxRef.current)) {
        comboboxRef.current.scrollIntoView({behavior: 'smooth', block: 'nearest'})
      }

      if (focusCombobox) {
        comboboxRef.current.focus()
      }
    },
    [highlightedOptionId]
  )

  const handleComboboxBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (!listboxRef.current) {
        return
      }

      updateOpenState(listboxRef.current.contains(event.relatedTarget))
    },
    [updateOpenState]
  )

  const handleComboboxClick = useCallback(() => {
    updateOpenState(!open)
  }, [open, updateOpenState])

  const handleKeyboardNavigation = useCallback(
    (action: SelectActions) => {
      switch (action) {
        case SelectActions.First:
          setHighlightedIndex(0)
          break
        case SelectActions.Last:
          setHighlightedIndex(lastIndex)
          break
        case SelectActions.Previous:
          setHighlightedIndex(Math.max(0, highlightedIndex - 1))
          break
        case SelectActions.Next:
          setHighlightedIndex(Math.min(lastIndex, highlightedIndex + 1))
          break
        case SelectActions.PageUp:
          setHighlightedIndex(Math.max(0, highlightedIndex - 10))
          break
        case SelectActions.PageDown:
          setHighlightedIndex(Math.min(lastIndex, highlightedIndex + 10))
          break
      }
    },
    [highlightedIndex, lastIndex]
  )

  const handleSearch = useCallback(
    (key: string) => {
      if (typeof searchTimeout === 'number') {
        clearTimeout(searchTimeout)
        setSearchTimeout(undefined)
      }

      const timeout = setTimeout(() => {
        setSearchString('')
      }, 500)

      const newSearchString = searchString + key

      setSearchTimeout(timeout)
      setSearchString(newSearchString)

      const searchIndex = getIndexByLetter(options, newSearchString, highlightedIndex + 1)

      if (searchIndex >= 0) {
        setHighlightedIndex(searchIndex)
      } else {
        clearTimeout(searchTimeout)
        setSearchTimeout(undefined)
        setSearchString('')
      }
    },
    [highlightedIndex, options, searchString, searchTimeout]
  )

  const handleComboboxKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const {key} = event

      const action = getActionFromKey(event, open)

      if (typeof action === 'undefined') {
        return
      }

      event.preventDefault()

      if (openActions.indexOf(action) > -1) {
        updateOpenState(true, true)
      }

      if (closeActions.indexOf(action) > -1) {
        updateOpenState(false, true)
      }

      if (navigationActions.indexOf(action) > -1) {
        handleKeyboardNavigation(action)
      }

      if (action === SelectActions.Select) {
        setSelectedOption(options[highlightedIndex])
      }

      if (action === SelectActions.Type) {
        handleSearch(key)
      }
    },
    [
      handleKeyboardNavigation,
      handleSearch,
      highlightedIndex,
      open,
      options,
      updateOpenState
    ]
  )

  const handleListboxBlur = useCallback(() => {
    // do something
  }, [])

  const handleOptionClick = useCallback(
    (option: GOption) => {
      setSelectedOption(option)
      updateOpenState(false, true)
    },
    [updateOpenState]
  )

  const renderOptionElement = useCallback(
    (option: GOption, index: number) => {
      let optionLabel = '' + option

      if (typeof option === 'object') {
        optionLabel = '' + option![fieldNames.label]
      }

      return (
        <SelectOption<GOption>
          highlighted={index === highlightedIndex}
          id={`${listboxId}__${index}`}
          key={index}
          label={optionLabel}
          option={option}
          selected={index === selectedOption}
          onClick={handleOptionClick}
        />
      )
    },
    [selectedOption, fieldNames.label, handleOptionClick, highlightedIndex, listboxId]
  )

  const optionsElements = useMemo(() => {
    return options.map(renderOptionElement)
  }, [options, renderOptionElement])

  const handleHighlightedOptionChanged = useCallback(() => {
    const listboxEl = listboxRef.current

    if (!listboxEl) {
      return
    }

    const selectedOptionElement = listboxEl.querySelector(
      '.option-current'
    ) as HTMLElement

    if (!selectedOptionElement) {
      return
    }

    if (listboxEl && isScrollable(listboxRef.current)) {
      maintainScrollVisibility(selectedOptionElement, listboxEl)
    }

    if (!isElementInView(selectedOptionElement)) {
      selectedOptionElement.scrollIntoView({behavior: 'smooth', block: 'nearest'})
    }
  }, [])

  // @todo portal
  const renderListbox = useMemo(() => {
    if (!open) {
      return null
    }

    return (
      <div
        className={'input__listbox'}
        id={listboxId}
        ref={listboxRef}
        role={'listbox'}
        tabIndex={-1}
        onBlur={handleListboxBlur}
      >
        {optionsElements}
      </div>
    )
  }, [handleListboxBlur, listboxId, open, optionsElements])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleHighlightedOptionChanged, [open, highlightedIndex])

  const renderValue = useMemo(() => {
    if (!selectedOption) {
      return nothingSelectedLabel
    }

    if (typeof selectedOption === 'object') {
      return '' + selectedOption[fieldNames.label]
    }

    return '' + selectedOption
  }, [fieldNames.label, nothingSelectedLabel, selectedOption])

  return (
    <div className={cls(className, 'input', open && 'input_open')} {...restProps}>
      <div
        aria-activedescendant={highlightedOptionId}
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup={'listbox'}
        className={'input__element'}
        id={comboboxId}
        ref={comboboxRef}
        role={'combobox'}
        tabIndex={0}
        onBlur={handleComboboxBlur}
        onClick={handleComboboxClick}
        onKeyDown={handleComboboxKeyDown}
      >
        {renderValue}
      </div>
      {renderListbox}
    </div>
  )
}

export default Select
