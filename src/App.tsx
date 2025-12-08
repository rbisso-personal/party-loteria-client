import { PartySocketProvider } from '@bcmedialab/party-games-core/client'
import { GameScreen } from './components/GameScreen'
import { ConnectionOverlay } from './components/ConnectionOverlay'
import { useGameEvents } from './hooks/useGameEvents'

// Determine server URL based on context:
// 1. Explicit server param in URL (for testing)
// 2. Derive from current hostname (for LAN dev access from phone)
// 3. Production env variable
// 4. Fallback to localhost
function getServerUrl(): string {
  const params = new URLSearchParams(window.location.search)
  const serverParam = params.get('server')
  if (serverParam) {
    console.log('[App] Using server URL from query param:', serverParam)
    return serverParam
  }

  // Dev mode: derive server URL from current host
  // When phone accesses 192.168.x.x:5173, use 192.168.x.x:3001 for server
  // This MUST come before the env var check so LAN access works
  const hostname = window.location.hostname
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    const serverUrl = `http://${hostname}:3001`
    console.log('[App] Using derived server URL from hostname:', serverUrl)
    return serverUrl
  }

  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL
  }

  return 'http://localhost:3001'
}

const SERVER_URL = getServerUrl()

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
