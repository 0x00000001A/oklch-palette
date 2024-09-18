import {
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  GithubOutlined,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  InsertRowLeftOutlined,
  InsertRowRightOutlined,
  MoonOutlined,
  SunOutlined
} from '@ant-design/icons'
import {Button, Divider, Flex, Space} from 'antd'
import {createStyles, css, useThemeMode} from 'antd-style'
import {observer} from 'mobx-react-lite'
import {useCallback} from 'react'

import {LCH_CHANNELS_NAMES} from '../../constants/colors.ts'
import {PaletteStore} from '../../store/PaletteStore.ts'
import {INSERT_POSITIONS} from '../../store/types.ts'

import ExportDropdown from './ExportDropdown/ExportDropdown.tsx'
import {PaletteDropdown} from './PaletteDropdown'
import {VisionDropdown} from './VisionDropdown'

const useStyles = createStyles(({token}) => ({
  root: css`
    padding: ${token.sizeXS}px;
  `
}))

const Navbar = observer(({palette}: {palette: PaletteStore}) => {
  const {styles} = useStyles()
  const {setThemeMode, themeMode} = useThemeMode()

  const handleInsertColorTonesAfterButtonClick = useCallback(() => {
    palette.cloneColumn(INSERT_POSITIONS.AFTER)
  }, [palette])

  const handleInsertColorTonesBeforeButtonClick = useCallback(() => {
    palette.cloneColumn(INSERT_POSITIONS.BEFORE)
  }, [palette])

  const handleInsertColorFamilyAfterButtonClick = useCallback(() => {
    palette.cloneRow(INSERT_POSITIONS.AFTER)
  }, [palette])

  const handleInsertColorFamilyBeforeButtonClick = useCallback(() => {
    palette.cloneRow(INSERT_POSITIONS.BEFORE)
  }, [palette])

  const handleApplyHueToRowButtonClick = () => {
    palette.selectedRow.setChannelValue(
      LCH_CHANNELS_NAMES.HUE,
      palette.selectedColor.oklch[2]
    )
  }

  const handleApplyChromaToColButtonClick = () => {
    palette.selectedColumn.setChannelValue(
      LCH_CHANNELS_NAMES.CHROMA,
      palette.selectedColor.oklch[1]
    )
  }

  const handleApplyLightnessToColButtonClick = () => {
    palette.selectedColumn.setChannelValue(
      LCH_CHANNELS_NAMES.LIGHTNESS,
      palette.selectedColor.oklch[0]
    )
  }

  return (
    <nav className={styles.root}>
      <Flex justify={'space-between'}>
        <Space className="navbar__items">
          <PaletteDropdown palette={palette} />
          <ExportDropdown palette={palette} />
          <Divider type={'vertical'} />
          <Button
            icon={<InsertRowLeftOutlined />}
            size={'small'}
            type={'text'}
            onClick={handleInsertColorTonesBeforeButtonClick}
          />
          <Button
            icon={<InsertRowRightOutlined />}
            size={'small'}
            type={'text'}
            onClick={handleInsertColorTonesAfterButtonClick}
          />
          <Button
            icon={<InsertRowAboveOutlined />}
            size={'small'}
            type={'text'}
            onClick={handleInsertColorFamilyBeforeButtonClick}
          />
          <Button
            icon={<InsertRowBelowOutlined />}
            size={'small'}
            type={'text'}
            onClick={handleInsertColorFamilyAfterButtonClick}
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
        </Space>
        <Space>
          {/* @todo not implemented yet */}
          {/* <ColorSpaceDropdown /> */}
          <VisionDropdown />
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
        </Space>
      </Flex>
    </nav>
  )
})

export default Navbar
