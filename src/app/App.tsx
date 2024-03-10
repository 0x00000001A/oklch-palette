import {FC} from 'react'

import ColorPalette from '../components/ColorPalette'
import {Navbar} from '../components/Navbar'
import {Panel} from '../components/Panel'
import {SplitContainer} from '../components/SplitContainer'

import Sidebar from './Sidebar.tsx'

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
        <Sidebar />
      </SplitContainer>
    </div>
  )
}

export default App
