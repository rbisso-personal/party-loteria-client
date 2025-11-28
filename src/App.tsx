import { PartySocketProvider } from '@bcmedialab/party-games-core/client'
import { GameScreen } from './components/GameScreen'
import { ConnectionOverlay } from './components/ConnectionOverlay'
import { useGameEvents } from './hooks/useGameEvents'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'

// Inner component that uses the game events hook
// Must be inside PartySocketProvider to access socket
function GameApp() {
  useGameEvents()

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-slate-900">
      <ConnectionOverlay />
      <GameScreen />
    </div>
  )
}

function App() {
  return (
    <PartySocketProvider server={SERVER_URL}>
      <GameApp />
    </PartySocketProvider>
  )
}

export default App
