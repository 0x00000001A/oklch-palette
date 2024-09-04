import {FC, useCallback} from 'react'

import IconExpandHorizontalLine from '../../icons/IconExpandHorizontalLine.tsx'
import IconExpandVerticalLine from '../../icons/IconExpandVerticalLine.tsx'
import IconGithub from '../../icons/IconGithub.tsx'
import IconInsertColumnLeft from '../../icons/IconInsertColumnLeft.tsx'
import IconInsertColumnRight from '../../icons/IconInsertColumnRight.tsx'
import IconInsertRowBottom from '../../icons/IconInsertRowBottom.tsx'
import IconInsertRowTop from '../../icons/IconInsertRowTop.tsx'
import IconSettings from '../../icons/IconSettings.tsx'
import IconShare from '../../icons/IconShare.tsx'
import IconSun from '../../icons/IconSun.tsx'
import {useColorsStore} from '../../state/index.ts'
import {INSERT_POSITIONS} from '../../state/types.ts'

import {ColorSpaceDropdown} from './ColorSpaceDropdown'
import ExportDropdown from './ExportDropdown/ExportDropdown.tsx'
import {PaletteDropdown} from './PaletteDropdown'
import {VisionDropdown} from './VisionDropdown'

import './index.css'

const Navbar: FC = () => {
  const addToPalette = useColorsStore((store) => store.addToPalette)
  const applyChannelValueTo = useColorsStore((store) => store.applyChannelValueTo)

  const handleInsertColorTonesAfterButtonClick = useCallback(() => {
    addToPalette('col', INSERT_POSITIONS.AFTER)
  }, [addToPalette])

  const handleInsertColorTonesBeforeButtonClick = useCallback(() => {
    addToPalette('col', INSERT_POSITIONS.BEFORE)
  }, [addToPalette])

  const handleInsertColorFamilyAfterButtonClick = useCallback(() => {
    addToPalette('row', INSERT_POSITIONS.AFTER)
  }, [addToPalette])

  const handleInsertColorFamilyBeforeButtonClick = useCallback(() => {
    addToPalette('row', INSERT_POSITIONS.BEFORE)
  }, [addToPalette])

  const handleApplyHueToRowButtonClick = useCallback(() => {
    applyChannelValueTo('row', 2)
  }, [applyChannelValueTo])

  const handleApplyChromaToColButtonClick = useCallback(() => {
    applyChannelValueTo('col', 1)
  }, [applyChannelValueTo])

  const handleApplyLightnessToColButtonClick = useCallback(() => {
    applyChannelValueTo('col', 0)
  }, [applyChannelValueTo])

  return (
    <nav className={'navbar'}>
      <div className="navbar__items">
        <ExportDropdown />
        <button
          aria-label={'Insert color shades after selected row'}
          className={'navbar__button'}
          onClick={handleInsertColorTonesAfterButtonClick}
        >
          <IconInsertColumnRight />
        </button>
        <button
          aria-label={'Insert color shades before selected row'}
          className={'navbar__button'}
          onClick={handleInsertColorTonesBeforeButtonClick}
        >
          <IconInsertColumnLeft />
        </button>
        <button
          aria-label={'Insert color shades after selected row'}
          className={'navbar__button'}
          onClick={handleInsertColorFamilyAfterButtonClick}
        >
          <IconInsertRowBottom />
        </button>
        <button
          aria-label={'Insert color shades after selected row'}
          className={'navbar__button'}
          onClick={handleInsertColorFamilyBeforeButtonClick}
        >
          <IconInsertRowTop />
        </button>
        <button
          aria-label={'Insert color shades after selected row'}
          className={'navbar__button'}
          onClick={handleApplyLightnessToColButtonClick}
        >
          <IconExpandVerticalLine />L
        </button>
        <button
          aria-label={'Insert color shades after selected row'}
          className={'navbar__button'}
          onClick={handleApplyChromaToColButtonClick}
        >
          <IconExpandVerticalLine />C
        </button>
        <button
          aria-label={'Insert color shades after selected row'}
          className={'navbar__button'}
          onClick={handleApplyHueToRowButtonClick}
        >
          <IconExpandHorizontalLine />H
        </button>
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
