import React, {FC, useMemo} from 'react'

import {ColorGraph} from '../components/ColorGraph'
import {Panel} from '../components/Panel'
import {LCH_CHANNELS_ARRAY, LCH_CHANNELS_CONFIG} from '../constants/colors.ts'

export type SidebarBodyProps = {
  // props
}

const SidebarBody: FC<SidebarBodyProps> = () => {
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

  return (
    <Panel
      style={{
        display: 'flex',
        flexBasis: 'min-content',
        flexShrink: 0,
        gap: 8,
        overflow: 'auto',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 8,
          gridTemplateColumns: '1fr 1fr'
        }}
      >
        {colorGraphs}
      </div>
    </Panel>
  )
}

export default SidebarBody
