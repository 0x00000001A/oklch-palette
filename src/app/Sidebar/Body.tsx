import {createStyles} from 'antd-style'
import React, {FC, useMemo} from 'react'

import {ColorGraph} from '../../components/ColorGraph'
import {LCH_CHANNELS_ARRAY, LCH_CHANNELS_CONFIG} from '../../constants/colors.ts'

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

const SidebarBody: FC<SidebarBodyProps> = () => {
  const {styles} = useStyle()

  const colorGraphs = useMemo(() => {
    return LCH_CHANNELS_ARRAY.map((channel) => (
      <React.Fragment key={channel}>
        <ColorGraph
          channel={channel}
          colorsFrom={'row'}
          max={LCH_CHANNELS_CONFIG[channel].max}
          min={LCH_CHANNELS_CONFIG[channel].min}
          step={LCH_CHANNELS_CONFIG[channel].step}
        />
        <ColorGraph
          channel={channel}
          colorsFrom={'col'}
          max={LCH_CHANNELS_CONFIG[channel].max}
          min={LCH_CHANNELS_CONFIG[channel].min}
          step={LCH_CHANNELS_CONFIG[channel].step}
        />
      </React.Fragment>
    ))
  }, [])

  return <div className={styles.root}>{colorGraphs}</div>
}

export default SidebarBody
