import { useEffect } from 'react'
import { Terminal } from './shell/Terminal'
import { WindowManager } from './components/FloatingWindow'
import { config } from './config'

export default function App() {
  useEffect(() => {
    // Apply default theme from config
    document.documentElement.setAttribute('data-theme', config.theme)
  }, [])

  return (
    <>
      <Terminal />
      <WindowManager />
    </>
  )
}
