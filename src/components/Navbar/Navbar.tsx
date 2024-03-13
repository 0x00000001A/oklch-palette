import {FC} from 'react'

import IconGithub from '../../icons/IconGithub.tsx'
import IconSettings from '../../icons/IconSettings.tsx'
import IconSun from '../../icons/IconSun.tsx'

import {ColorSpaceDropdown} from './ColorSpaceDropdown'
import {PaletteDropdown} from './PaletteDropdown'
import {VisionDropdown} from './VisionDropdown'

import './index.css'
import IconShare from '../../icons/IconShare.tsx'

const Navbar: FC = () => {
  return (
    <nav className={'navbar'}>
      <div>OK PALETTE</div>
      <div className="navbar__form">
        <PaletteDropdown />
        <button aria-label={'Share link to this palette'} className={'navbar__button'}>
          <IconShare />
        </button>
      </div>
      <div className={'navbar__form'}>
        <div className="navbar__form">
          <ColorSpaceDropdown />
          <VisionDropdown />
        </div>
        <div className="navbar__form">
          <button aria-label={'Switch to light mode'} className={'navbar__button'}>
            <IconSettings />
          </button>
          <button aria-label={'Switch to light mode'} className={'navbar__button'}>
            <IconSun />
          </button>
          <a
            aria-label={'Go to project GitHub page'}
            className={'navbar__button'}
            href={'#'}
          >
            <IconGithub />
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
