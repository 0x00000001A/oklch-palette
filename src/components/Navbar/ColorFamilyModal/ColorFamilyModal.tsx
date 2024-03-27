import {FC, useCallback, useMemo, useState} from 'react'

import {useColorsStore} from '../../../state'
import {
  hexToRgb,
  oklabToOklch,
  rgbToHex,
  rgbToXyz,
  xyzToOklab
} from '../../../utils/colors.ts'
import {Button} from '../../Button'
import ColorPicker from '../../ColorPicker/ColorPicker.tsx'
import {Input} from '../../Input'
import {Modal, ModalProps} from '../../Modal'

import './index.css'

export type ColorFamilyModalProps = Pick<ModalProps, 'onClose' | 'open'>

const ColorFamilyModal: FC<ColorFamilyModalProps> = ({onClose, open}) => {
  const [hex, setHex] = useState('#fff')
  const shadesCount = useColorsStore((state) => state.colNames.length)

  const handleColorPickerChange = useCallback((rgb: [number, number, number]) => {
    setHex(rgbToHex(rgb))
  }, [])

  const colorShades = useMemo(() => {
    const oklch = oklabToOklch(xyzToOklab(rgbToXyz(hexToRgb(hex))))
    const kf = oklch[0] / oklch[1]

    // generate from MAX value up to oklch value (eg growing x times from oklch)
    // generate from oklch value up to MIN value (eg decreasing x times from oklch)
    // remove all out-of-range colors

    const result = new Array(shadesCount).fill(oklch).map((color, index) => {
      const L = (index * 100) / shadesCount / 100
      return [L, L / kf, color[2]]
    })

    // L
    return (
      <div style={{display: 'flex'}}>
        {result.map((color, index) => (
          <div
            style={{
              aspectRatio: 1,
              background: `oklch(${color.join()})`,
              display: 'flex',
              flexGrow: 1,
              flexShrink: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            key={index}
          />
        ))}
      </div>
    )
  }, [hex, shadesCount])

  return (
    <Modal
      body={
        <div className={'color-family-modal__body'}>
          <div className={'color-family-modal__form'}>
            <div className={'color-family-modal__input-group'}>
              Name:
              <Input placeholder={'Blue'} />
            </div>
            <div className={'color-family-modal__input-group'}>
              Color:
              <Input placeholder={'#fff'} value={hex} />
            </div>
          </div>
          <ColorPicker onChange={handleColorPickerChange} />
          Preview:
          {colorShades}
        </div>
      }
      footer={
        <div className={'color-family-modal__footer'}>
          <Button>Cancel</Button>
          <Button>Apply</Button>
        </div>
      }
      open={open}
      title={'New color family'}
      width={400}
      onClose={onClose}
    />
  )
}

export default ColorFamilyModal
