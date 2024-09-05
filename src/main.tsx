import {App as AntdApp, ConfigProvider} from 'antd'
import {ThemeProvider} from 'antd-style'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './app/App.tsx'

import './index.css'

const rootElementId = 'root'
const rootElement = document.getElementById(rootElementId)

if (!rootElement) {
  throw new Error(`Element with id ${rootElementId} not found`)
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <ConfigProvider>
        <AntdApp>
          <App />
        </AntdApp>
      </ConfigProvider>
    </ThemeProvider>
  </React.StrictMode>
)
