import {HTMLAttributes, ReactNode, RefObject} from 'react'

export type BaseOption = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  label: ReactNode | string
  value: number | string
}

export type MenuProps<GOption extends BaseOption = BaseOption> = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onClick'
> & {
  onClick: (option: GOption) => void
  open?: boolean
  options: GOption[]
  rootRef: RefObject<HTMLDivElement>
}

export type OptionProps<GOption extends BaseOption = BaseOption> = {
  onClick: (option: GOption) => void
  option: GOption
}

export type DropdownProps<GOption extends BaseOption = BaseOption> = {
  icon?: ReactNode
  loading?: boolean
  onChange?: (option: GOption) => void
  optionLabelProp?: keyof GOption
  options: GOption[]
  value?: GOption
}
