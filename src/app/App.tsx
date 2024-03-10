import {FC} from 'react'

import {ColorBar} from '../components/ColorBar'
import {ColorGraph} from '../components/ColorGraph'
import ColorPalette from '../components/ColorPalette'
import {Navbar} from '../components/Navbar'
import {Panel} from '../components/Panel'
import {SplitContainer} from '../components/SplitContainer'
import {CHROMA_MAX, HUE_MAX, LIGHTNESS_MAX} from '../constants/colors.ts'
import {LCH_CHANNELS_NAMES} from '../state'

import './index.css'

const App: FC = () => {
  return (
    <div className={'app'}>
      <div className={'app__header'}>
        <Navbar />
      </div>
      <SplitContainer className={'app__body'}>
        <Panel style={{overflow: 'auto'}}>
          <ColorPalette />
        </Panel>
        <Panel
          style={{
            display: 'flex',
            flexBasis: 'min-content',
            flexDirection: 'column',
            flexShrink: 0,
            gap: 8,
            overflow: 'auto'
          }}
        >
          <ColorGraph
            channel={LCH_CHANNELS_NAMES.LIGHTNESS}
            max={LIGHTNESS_MAX}
            min={0}
            step={0.005}
          />
          <ColorBar colorsFrom={'col'} />
          <ColorGraph
            channel={LCH_CHANNELS_NAMES.CHROMA}
            max={CHROMA_MAX}
            min={0}
            step={0.005}
          />
          <ColorBar colorsFrom={'row'} />
          <ColorGraph channel={LCH_CHANNELS_NAMES.HUE} max={HUE_MAX} min={0} step={0.5} />
        </Panel>
      </SplitContainer>
    </div>
  )
}

export default App
