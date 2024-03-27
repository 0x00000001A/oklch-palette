import {FC} from 'react'

import {Button} from '../../Button'
import {ColorBar} from '../../ColorBar'
import {Input} from '../../Input'
import {Modal} from '../../Modal'

import {ColorTonesModalProps} from './types.ts'

const ColorTonesModal: FC<ColorTonesModalProps> = ({onClose, open}) => {
  return (
    <Modal
      body={
        <div>
          <div>
            <label>Tone name:</label>
            <Input placeholder={'800'} />
          </div>
          <ColorBar colorsFrom={'col'} />
        </div>
      }
      footer={
        <div>
          <Button>Cancel</Button>
          <Button>Add</Button>
        </div>
      }
      open={open}
      title={'New color tones'}
      onClose={onClose}
    />
  )
}

export default ColorTonesModal
