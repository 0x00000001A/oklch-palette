import {
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  InsertRowLeftOutlined,
  InsertRowRightOutlined
} from '@ant-design/icons'
import {Button, Divider} from 'antd'
import {FC, useCallback} from 'react'

import IconGithub from '../../icons/IconGithub.tsx'
import IconSettings from '../../icons/IconSettings.tsx'
import IconSun from '../../icons/IconSun.tsx'
import {INSERT_POSITIONS} from '../../state'
import {useColorsStore} from '../../state/index.ts'

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
        <PaletteDropdown />
        <ExportDropdown />
        <Divider type={'vertical'} />
        <Button
          icon={<InsertRowLeftOutlined />}
          size={'small'}
          type={'text'}
          onClick={handleInsertColorTonesAfterButtonClick}
        />
        <Button
          icon={<InsertRowRightOutlined />}
          size={'small'}
          type={'text'}
          onClick={handleInsertColorTonesBeforeButtonClick}
        />
        <Button
          icon={<InsertRowAboveOutlined />}
          size={'small'}
          type={'text'}
          onClick={handleInsertColorFamilyAfterButtonClick}
        />
        <Button
          icon={<InsertRowBelowOutlined />}
          size={'small'}
          type={'text'}
          onClick={handleInsertColorFamilyBeforeButtonClick}
        />
        <Divider type={'vertical'} />
        <Button
          icon={<ColumnHeightOutlined />}
          size={'small'}
          type={'text'}
          onClick={handleApplyLightnessToColButtonClick}
        >
          L
        </Button>
        <Button
          icon={<ColumnHeightOutlined />}
          size={'small'}
          type={'text'}
          onClick={handleApplyChromaToColButtonClick}
        >
          C
        </Button>
        <Button
          icon={<ColumnWidthOutlined />}
          size={'small'}
          type={'text'}
          onClick={handleApplyHueToRowButtonClick}
        >
          H
        </Button>
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
