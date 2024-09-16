import {ThemeProvider, ThemeProviderProps} from 'antd-style'
import React, {PropsWithChildren, useCallback, useState} from 'react'

type AppearanceProps = PropsWithChildren & ThemeProviderProps<never>

const Appearance: React.FC<AppearanceProps> = ({children}) => {
  const savedAppearance = (localStorage.getItem('theme') || 'auto') as never
  const [appearance, setAppearance] = useState(savedAppearance)

  const handleThemeModeChange = useCallback((newAppearance: string) => {
    localStorage.setItem('theme', newAppearance)
    setAppearance(newAppearance as never)
  }, [])

  return (
    <ThemeProvider
      theme={{
        token: {
          motion: false
        }
      }}
      defaultAppearance={appearance}
      themeMode={appearance}
      onAppearanceChange={handleThemeModeChange}
      onThemeModeChange={handleThemeModeChange}
    >
      {children}
    </ThemeProvider>
  )
}

export default Appearance
