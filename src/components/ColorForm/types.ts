import {HTMLAttributes} from 'react'

import {LCH_CHANNELS_NAMES} from '../../constants/colors.ts'

export type ColorFormProps = HTMLAttributes<HTMLDivElement> & {
  // props
}

export type ColorInputProps = {
  channel: LCH_CHANNELS_NAMES
}
