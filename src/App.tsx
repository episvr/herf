import { Terminal } from './shell/Terminal'
import { WindowManager } from './components/FloatingWindow'

export default function App() {
  return (
    <>
      <Terminal />
      <WindowManager />
    </>
  )
}
