import {FC} from 'react'

import IconGithub from '../../icons/IconGithub.tsx'
import IconSettings from '../../icons/IconSettings.tsx'
import IconSun from '../../icons/IconSun.tsx'

import './index.css'

const Navbar: FC = () => {
  return (
    <nav className={'navbar'}>
      <div>OK PALETTE</div>
      <div className="navbar__form">
        Color model: <button className={'navbar__button'}>OKLCH</button>
        Color space: <button className={'navbar__button'}>sRGB</button>
        Vision simulation: <button className={'navbar__button'}>normal</button>
      </div>
      <ul className={'navbar__menu'}>
        <li className={'navbar__item'}>
          <button aria-label={'Switch to light mode'} className={'navbar__button'}>
            <IconSettings />
          </button>
        </li>
        <li className={'navbar__item'}>
          <button aria-label={'Switch to light mode'} className={'navbar__button'}>
            <IconSun />
          </button>
        </li>
        <li className={'navbar__item'}>
          <a
            aria-label={'Go to project GitHub page'}
            className={'navbar__button'}
            href={'#'}
          >
            <IconGithub />
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
