import {
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  GithubOutlined,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  InsertRowLeftOutlined,
  InsertRowRightOutlined,
  MoonOutlined,
  SettingOutlined,
  SunOutlined
} from '@ant-design/icons'
import {Button, Divider} from 'antd'
import {useThemeMode} from 'antd-style'
import {FC, useCallback} from 'react'

import {INSERT_POSITIONS} from '../../state'
import {useColorsStore} from '../../state/index.ts'

import ExportDropdown from './ExportDropdown/ExportDropdown.tsx'
import {PaletteDropdown} from './PaletteDropdown'
import {VisionDropdown} from './VisionDropdown'

import './index.css'

const Navbar: FC = () => {
  const {setThemeMode, themeMode} = useThemeMode()
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
          {/* @todo not implemented yet */}
          {/* <ColorSpaceDropdown /> */}
          <VisionDropdown />
        </div>
        <div className="navbar__items">
          <Button
            aria-label={'Switch to light mode'}
            icon={<SettingOutlined />}
            size={'small'}
            type={'text'}
          />
          <Button
            aria-label={'Switch to light mode'}
            icon={themeMode === 'dark' ? <MoonOutlined /> : <SunOutlined />}
            size={'small'}
            type={'text'}
            onClick={() => {
              setThemeMode(themeMode === 'dark' ? 'light' : 'dark')
            }}
          >
            Toggle theme
          </Button>
          <Button
            aria-label={'Go to project GitHub page'}
            href={'https://github.com/0x00000001A/oklch-palette'}
            icon={<GithubOutlined />}
            size={'small'}
            target={'_blank'}
            type={'text'}
          >
            About
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
