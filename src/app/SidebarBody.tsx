import {FC} from 'react'

import {ColorGraph} from '../components/ColorGraph'
import {Panel} from '../components/Panel'
import {CHROMA_MAX, HUE_MAX, LIGHTNESS_MAX} from '../constants/colors.ts'
import {LCH_CHANNELS_NAMES} from '../state'

export type SidebarBodyProps = {
  // props
}

const SidebarBody: FC<SidebarBodyProps> = () => {
  return (
    <Panel
      style={{
        display: 'flex',
        flexBasis: 'min-content',
        flexShrink: 0,
        gap: 8,
        overflow: 'auto'
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 8,
          gridTemplateColumns: '1fr 1fr'
        }}
      >
        <ColorGraph
          channel={LCH_CHANNELS_NAMES.LIGHTNESS}
          colorsFrom={'row'}
          max={LIGHTNESS_MAX}
          min={0}
          step={0.005}
        />
        <ColorGraph
          channel={LCH_CHANNELS_NAMES.LIGHTNESS}
          colorsFrom={'column'}
          max={LIGHTNESS_MAX}
          min={0}
          step={0.005}
        />
        <ColorGraph
          channel={LCH_CHANNELS_NAMES.CHROMA}
          colorsFrom={'row'}
          max={CHROMA_MAX}
          min={0}
          step={0.005}
        />
        <ColorGraph
          channel={LCH_CHANNELS_NAMES.CHROMA}
          colorsFrom={'column'}
          max={CHROMA_MAX}
          min={0}
          step={0.005}
        />
        <ColorGraph
          channel={LCH_CHANNELS_NAMES.HUE}
          colorsFrom={'row'}
          max={HUE_MAX}
          min={0}
          step={0.5}
        />
        <ColorGraph
          channel={LCH_CHANNELS_NAMES.HUE}
          colorsFrom={'column'}
          max={HUE_MAX}
          min={0}
          step={0.5}
        />
      </div>
    </Panel>
  )
}

export default SidebarBody
