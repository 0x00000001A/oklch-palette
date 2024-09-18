import {createStyles} from 'antd-style'
import {observer} from 'mobx-react-lite'
import React, {FC} from 'react'

import {LCH_CHANNELS_ARRAY, LCH_CHANNELS_CONFIG} from '../../constants/colors.ts'
import {PaletteStore} from '../../store/PaletteStore.ts'
import {ColorGraph} from '../ColorGraph'

export type SidebarBodyProps = {
  // props
}

const useStyle = createStyles(({css, token}) => ({
  root: css`
    padding: ${token.paddingSM}px;
    display: grid;
    gap: ${token.paddingSM}px;
    grid-template-columns: 1fr 1fr;
  `
}))

const SidebarBody: FC<SidebarBodyProps & {palette: PaletteStore}> = observer(
  ({palette}) => {
    const {styles} = useStyle()

    return (
      <div className={styles.root}>
        {LCH_CHANNELS_ARRAY.map((channel) => (
          <React.Fragment key={channel}>
            <ColorGraph
              channel={channel}
              colors={palette.selectedColor.row.colors}
              max={LCH_CHANNELS_CONFIG[channel].max}
              min={LCH_CHANNELS_CONFIG[channel].min}
              step={LCH_CHANNELS_CONFIG[channel].step}
              workerGroup={'row'}
            />
            <ColorGraph
              channel={channel}
              colors={palette.selectedColor.column.colors}
              max={LCH_CHANNELS_CONFIG[channel].max}
              min={LCH_CHANNELS_CONFIG[channel].min}
              step={LCH_CHANNELS_CONFIG[channel].step}
              workerGroup={'column'}
            />
          </React.Fragment>
        ))}
      </div>
    )
  }
)

export default SidebarBody
