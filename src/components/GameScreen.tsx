import { usePartySocketContext } from '@bcmedialab/party-games-core/client'
import { useGameStore } from '../stores/gameStore'
import { JoinRoom } from './JoinRoom'
import { Lobby } from './Lobby'
import { Tabla } from './Tabla'

export function GameScreen() {
  // Room/player state from core package
  const { roomCode, playerName } = usePartySocketContext()
  // Game-specific state from local store
  const { phase } = useGameStore()

  // Not in a room yet - show join screen
  if (!roomCode) {
    return <JoinRoom />
  }

  // In room but no name yet - show name input (part of lobby)
  if (!playerName) {
    return <Lobby />
  }

  // Waiting for game to start
  if (phase === 'waiting') {
    return <Lobby />
  }

  // Game in progress
  if (phase === 'playing' || phase === 'paused') {
    return <Tabla />
  }

  // Game finished
  if (phase === 'finished') {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-500 mb-4">Game Over!</h1>
          <p className="text-slate-400">Thanks for playing</p>
        </div>
      </div>
    )
  }

  return null
}
