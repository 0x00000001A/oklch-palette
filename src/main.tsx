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
    <App />
  </React.StrictMode>
)
