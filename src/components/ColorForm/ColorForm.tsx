import {FC, useMemo} from 'react'

import {LCH_CHANNELS_ARRAY} from '../../constants/colors.ts'

import ColorInput from './ColorInput.tsx'
import {ColorFormProps} from './types.ts'

import './index.css'

const ColorForm: FC<ColorFormProps> = () => {
  const channelInputs = useMemo(() => {
    return LCH_CHANNELS_ARRAY.map((channel) => (
      <ColorInput channel={channel} key={channel} />
    ))
  }, [])

  return <div className={'color-form'}>{channelInputs}</div>
}

export default ColorForm
