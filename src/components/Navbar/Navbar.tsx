import React, {FC, useId, useMemo} from 'react'
import './index.css'
import {useColorsStore} from '../../state'
import IconGithub from '../../icons/IconGithub.tsx'
import {Input} from '../Input'
import {InputProps} from '../Input/Input.tsx'
import IconSun from '../../icons/IconSun.tsx'
import IconSettings from '../../icons/IconSettings.tsx'

type ChannelInputProps = InputProps & {
  channel: number
}

const ChannelInput: FC<ChannelInputProps> = ({channel, ...restProps}) => {
  const channelValue = useColorsStore(
    (state) => {
      let value = state.getSelectedColor().oklch[channel]

      value = channel === 0 ? value * 100 : value
      value = Number(value.toFixed(channel === 1 ? 3 : 2))

      return value
    },
    (a, b) => a.toString() === b.toString()
  )

  const max = useMemo(() => {
    if (channel === 0) {
      return 100
    }

    if (channel === 1) {
      return 0.33
    }

    return 360
  }, [channel])

  const step = useMemo(() => {
    if (channel === 1) {
      return 0.001
    }

    return 0.01
  }, [channel])

  return (
    <Input
      type={'number'}
      value={channelValue}
      step={step}
      max={max}
      min={0}
      onChange={console.log}
      {...restProps}
    />
  )
}

const SelectedColorForm: FC = () => {
  const baseId = useId()

  return ['Luminance', 'Chroma', 'Hue'].map((label, channel) => {
    const labelId = `${baseId}__label_${channel}`
    const inputId = `${baseId}__input_${channel}`

    return (
      <React.Fragment key={channel}>
        <label id={labelId} htmlFor={inputId}>
          {label}:
        </label>
        <ChannelInput
          id={inputId}
          label={label}
          channel={channel}
          aria-labelledby={labelId}
        />
      </React.Fragment>
    )
  })
}

const Navbar: FC = () => {
  return (
    <nav className={'navbar'}>
      <div>OK PALETTE</div>
      <div className="navbar__form">
        <SelectedColorForm />
      </div>
      <ul className={'navbar__menu'}>
        <li className={'navbar__item'}>
          <button className={'navbar__button'} aria-label={'Switch to light mode'}>
            <IconSettings />
          </button>
        </li>
        <li className={'navbar__item'}>
          <button className={'navbar__button'} aria-label={'Switch to light mode'}>
            <IconSun />
          </button>
        </li>
        <li className={'navbar__item'}>
          <a
            href={'#'}
            className={'navbar__button'}
            aria-label={'Go to project GitHub page'}
          >
            <IconGithub />
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
