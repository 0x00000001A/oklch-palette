import {FC} from 'react'

import {ColorBar} from '../components/ColorBar'
import {ColorGraph} from '../components/ColorGraph'
import ColorPalette from '../components/ColorPalette'
import {Input} from '../components/Input'
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
        <div
          style={{
            display: 'flex',
            flexBasis: 'min-content',
            flexDirection: 'column',
            flexShrink: 0,
            overflow: 'auto'
          }}
        >
          <Panel
            style={{
              display: 'grid',
              gap: 8,
              gridTemplateColumns: '1fr 1fr',
              rowGap: 16
            }}
          >
            <div style={{display: 'flex'}}>
              <div style={{alignItems: 'center', display: 'flex', gap: 8}}>
                <label>Lightness:</label>
                <Input
                  max={LIGHTNESS_MAX}
                  min={0}
                  step={LIGHTNESS_MAX / 100}
                  type={'number'}
                />
              </div>
              <div style={{alignItems: 'center', display: 'flex', gap: 8}}>
                <label>Chroma:</label>
                <Input max={CHROMA_MAX} min={0} step={CHROMA_MAX / 100} type={'number'} />
              </div>
              <div style={{alignItems: 'center', display: 'flex', gap: 8}}>
                <label>Hue:</label>
                <Input max={HUE_MAX} min={0} step={HUE_MAX / 100} type={'number'} />
              </div>
            </div>
            <div>#000</div>
            <ColorBar colorsFrom={'col'} style={{flexGrow: 1}} />
            <ColorBar colorsFrom={'row'} style={{flexGrow: 1}} />
          </Panel>
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
                max={LIGHTNESS_MAX}
                min={0}
                step={0.005}
              />
              <ColorGraph
                channel={LCH_CHANNELS_NAMES.CHROMA}
                max={CHROMA_MAX}
                min={0}
                step={0.005}
              />
              <ColorGraph
                channel={LCH_CHANNELS_NAMES.HUE}
                max={HUE_MAX}
                min={0}
                step={0.5}
              />
              <ColorGraph
                channel={LCH_CHANNELS_NAMES.LIGHTNESS}
                max={LIGHTNESS_MAX}
                min={0}
                step={0.005}
              />
              <ColorGraph
                channel={LCH_CHANNELS_NAMES.CHROMA}
                max={CHROMA_MAX}
                min={0}
                step={0.005}
              />
              <ColorGraph
                channel={LCH_CHANNELS_NAMES.HUE}
                max={HUE_MAX}
                min={0}
                step={0.5}
              />
            </div>
          </Panel>
        </div>
      </SplitContainer>
    </div>
  )
}

export default App
