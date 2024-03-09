import {FC, useEffect, useState} from 'react'
import {ColorGraph} from '../components/ColorGraph'
import {LCH_CHANNELS_NAMES} from '../state'
import ColorPalette from '../components/ColorPalette'
import {Navbar} from '../components/Navbar'
import {ContrastChecker} from '../components/ContrastChecker'

import './index.css'
import {SplitContainer} from '../components/SplitContainer'
import {Panel} from '../components/Panel'
import {ColorBar} from '../components/ColorBar'
import {restoreStoreFromLocalStorage} from '../state/io.ts'

const App: FC = () => {
  const [loading, setLoading] = useState(true)

  const handleAppInit = () => {
    restoreStoreFromLocalStorage().then(() => {
      setLoading(false)
    })

    return () => {
      setLoading(true)
    }
  }

  useEffect(handleAppInit, [])

  if (loading) {
    return null
  }

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
            flexDirection: 'column',
            gap: 8,
            width: 150,
            fontSize: 14,
            flexShrink: 0
          }}
        >
          <ContrastChecker />
        </Panel>
        <Panel
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            overflow: 'auto',
            flexBasis: 'min-content',
            flexShrink: 0
          }}
        >
          <ColorGraph
            channel={LCH_CHANNELS_NAMES.LIGHTNESS}
            min={0}
            max={1}
            step={0.005}
          />
          <ColorBar colorsFrom={'col'} />
          <ColorGraph
            channel={LCH_CHANNELS_NAMES.CHROMA}
            min={0}
            max={0.33}
            step={0.005}
          />
          <ColorBar colorsFrom={'row'} />
          <ColorGraph channel={LCH_CHANNELS_NAMES.HUE} min={0} max={360} step={0.5} />
        </Panel>
      </SplitContainer>
    </div>
  )
}

export default App
