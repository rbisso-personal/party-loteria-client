import { useState } from 'react'
import { usePartySocketContext } from '@bcmedialab/party-games-core/client'

const WIN_PATTERNS = [
  { value: 'line', label: 'Line (Row/Column/Diagonal)' },
  { value: 'corners', label: 'Four Corners' },
  { value: 'center', label: 'Center Square' },
  { value: 'x', label: 'X Pattern' },
  { value: 'full', label: 'Full Board' },
]

const DRAW_SPEEDS = [
  { value: 5, label: '5 seconds (Fast)' },
  { value: 8, label: '8 seconds (Normal)' },
  { value: 12, label: '12 seconds (Slow)' },
  { value: 0, label: 'Manual Draw' },
]

export function Lobby() {
  const [nameInput, setNameInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [winPattern, setWinPattern] = useState('line')
  const [drawSpeed, setDrawSpeed] = useState(8)
  const [showSettings, setShowSettings] = useState(false)

  const {
    roomCode,
    playerName,
    players,
    hostId,
    isHost,
    submitName,
    kickPlayer,
    transferHost,
    emit,
  } = usePartySocketContext()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nameInput.trim().length >= 2) {
      setIsSubmitting(true)
      submitName(nameInput.trim())
    }
  }

  const handleStartGame = () => {
    console.log('[Lobby] Starting game with:', { winPattern, drawSpeed })
    emit('start-game', { winPattern, drawSpeed })
  }

  const handleKick = (playerId: string) => {
    if (confirm('Are you sure you want to kick this player?')) {
      kickPlayer(playerId)
    }
  }

  const handleTransferHost = (playerId: string) => {
    if (confirm('Transfer host duties to this player?')) {
      transferHost(playerId)
    }
  }

  // Name input view
  if (!playerName) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-slate-800 rounded-lg mb-4">
              <span className="text-slate-400 text-sm">Room</span>
              <span className="ml-2 text-amber-500 font-mono font-bold text-lg">{roomCode}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">What's your name?</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="w-full text-center text-2xl py-4 px-6 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none transition-colors"
              autoFocus
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={nameInput.trim().length < 2 || isSubmitting}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 text-black font-bold text-lg rounded-xl transition-colors"
            >
              {isSubmitting ? 'Joining...' : "Let's Play!"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const otherPlayers = players.filter(p => p.name !== playerName)

  // Waiting for game to start view
  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="text-center py-4">
        <div className="inline-block px-4 py-2 bg-slate-800 rounded-lg mb-2">
          <span className="text-slate-400 text-sm">Room</span>
          <span className="ml-2 text-amber-500 font-mono font-bold text-lg">{roomCode}</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          {isHost ? 'You are the host!' : 'Waiting for host to start...'}
        </h2>
      </div>

      {/* Players list */}
      <div className="flex-1 flex flex-col overflow-auto">
        <h3 className="text-slate-400 text-sm uppercase tracking-wide mb-3">
          Players ({players.length})
        </h3>
        <div className="space-y-2">
          {/* Current player */}
          <div className="flex items-center gap-3 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold">
              {playerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">{playerName}</span>
              {isHost && (
                <span className="ml-2 text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full">
                  HOST
                </span>
              )}
            </div>
            <span className="text-amber-500 text-sm">You</span>
          </div>

          {/* Other players */}
          {otherPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <span className="text-white font-medium">{player.name}</span>
                {player.id === hostId && (
                  <span className="ml-2 text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full">
                    HOST
                  </span>
                )}
              </div>

              {/* Host controls for other players */}
              {isHost && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTransferHost(player.id)}
                    className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
                    title="Make host"
                  >
                    Make Host
                  </button>
                  <button
                    onClick={() => handleKick(player.id)}
                    className="text-xs px-2 py-1 bg-red-900/50 hover:bg-red-800 text-red-300 rounded transition-colors"
                    title="Kick player"
                  >
                    Kick
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Host controls */}
      {isHost ? (
        <div className="pt-4 space-y-3">
          {/* Settings toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full py-2 text-slate-400 text-sm flex items-center justify-center gap-2"
          >
            <span>{showSettings ? '▼' : '▶'}</span>
            <span>Game Settings</span>
          </button>

          {/* Settings panel */}
          {showSettings && (
            <div className="space-y-3 p-3 bg-slate-800 rounded-lg">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Win Pattern</label>
                <select
                  value={winPattern}
                  onChange={(e) => setWinPattern(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  {WIN_PATTERNS.map((pattern) => (
                    <option key={pattern.value} value={pattern.value}>
                      {pattern.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-1">Draw Speed</label>
                <select
                  value={drawSpeed}
                  onChange={(e) => {
                    const newSpeed = Number(e.target.value)
                    console.log('[Lobby] Draw speed changed:', { raw: e.target.value, parsed: newSpeed })
                    setDrawSpeed(newSpeed)
                  }}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  {DRAW_SPEEDS.map((speed) => (
                    <option key={speed.value} value={speed.value}>
                      {speed.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Start game button */}
          <button
            onClick={handleStartGame}
            disabled={players.length < 1}
            className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-lg rounded-xl transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm">Waiting for host</span>
          </div>
        </div>
      )}
    </div>
  )
}
