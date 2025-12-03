import { usePartySocketContext } from '@bcmedialab/party-games-core/client'
import { useGameStore } from '../stores/gameStore'
import { JoinRoom } from './JoinRoom'
import { Lobby } from './Lobby'
import { Tabla } from './Tabla'

export function GameScreen() {
  // Room/player state from core package
  const { roomCode, playerName, isHost, emit } = usePartySocketContext()
  // Game-specific state from local store
  const { phase, winner } = useGameStore()

  const handlePlayAgain = () => {
    emit('reset-game', {})
  }

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
        <div className="text-center max-w-sm w-full">
          <h1 className="text-3xl font-bold text-amber-500 mb-4">
            {winner ? '¡Lotería!' : 'Game Over!'}
          </h1>

          {winner ? (
            <p className="text-xl text-white mb-6">
              <span className="font-bold">{winner.name}</span> wins!
            </p>
          ) : (
            <p className="text-slate-400 mb-6">No winner - deck exhausted</p>
          )}

          {isHost ? (
            <button
              onClick={handlePlayAgain}
              className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl transition-colors"
            >
              Play Again
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">Waiting for host</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
