import {App as AntdApp, ConfigProvider} from 'antd'
import {autorun} from 'mobx'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import Appearance from './Appearance.tsx'
import {PaletteStore} from './store/PaletteStore.ts'

import 'antd/dist/reset.css'

const rootElementId = 'root'
const rootElement = document.getElementById(rootElementId)

if (!rootElement) {
  throw new Error(`Element with id ${rootElementId} not found`)
}

const savedStateUnparsed = localStorage.getItem('state')
const savedState = savedStateUnparsed ? JSON.parse(savedStateUnparsed) : undefined
export const palette = new PaletteStore(savedState)

autorun(
  () => {
    localStorage.setItem('state', JSON.stringify(palette.toJSON))
  },
  {
    delay: 250
  }
)

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Appearance>
      <ConfigProvider>
        <AntdApp>
          <App />
        </AntdApp>
      </ConfigProvider>
    </Appearance>
  </React.StrictMode>
)
