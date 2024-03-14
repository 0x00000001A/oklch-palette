import {FC} from 'react'

import IconGithub from '../../icons/IconGithub.tsx'
import IconSettings from '../../icons/IconSettings.tsx'
import IconSun from '../../icons/IconSun.tsx'

import {ColorSpaceDropdown} from './ColorSpaceDropdown'
import {PaletteDropdown} from './PaletteDropdown'
import {VisionDropdown} from './VisionDropdown'

import './index.css'
import IconShare from '../../icons/IconShare.tsx'
import {PaletteActionsDropdown} from './PaletteActionsDropdown'

const Navbar: FC = () => {
  return (
    <nav className={'navbar'}>
      <div className={'navbar__items'}>
        <PaletteActionsDropdown />
      </div>
      <div className="navbar__items">
        <PaletteDropdown />
        <button aria-label={'Share link to this palette'} className={'navbar__button'}>
          <IconShare />
        </button>
      </div>
      <div className={'navbar__items'}>
        <div className="navbar__items">
          <ColorSpaceDropdown />
          <VisionDropdown />
        </div>
        <div className="navbar__items">
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
