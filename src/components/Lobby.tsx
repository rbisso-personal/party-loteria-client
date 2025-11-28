import { useState } from 'react'
import { usePartySocketContext } from '@bcmedialab/party-games-core/client'

export function Lobby() {
  const [nameInput, setNameInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { roomCode, playerName, players, submitName } = usePartySocketContext()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nameInput.trim().length >= 2) {
      setIsSubmitting(true)
      submitName(nameInput.trim())
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

  // Filter out ourselves from the players list for display
  const otherPlayers = players.filter(p => p.name !== playerName)

  // Waiting for game to start view
  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="text-center py-6">
        <div className="inline-block px-4 py-2 bg-slate-800 rounded-lg mb-2">
          <span className="text-slate-400 text-sm">Room</span>
          <span className="ml-2 text-amber-500 font-mono font-bold text-lg">{roomCode}</span>
        </div>
        <h2 className="text-xl font-bold text-white">Waiting for host to start...</h2>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-slate-400 text-sm uppercase tracking-wide mb-3">
          Players ({players.length})
        </h3>
        <div className="space-y-2">
          {/* Current player */}
          <div className="flex items-center gap-3 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold">
              {playerName.charAt(0).toUpperCase()}
            </div>
            <span className="text-white font-medium">{playerName}</span>
            <span className="ml-auto text-amber-500 text-sm">You</span>
          </div>

          {/* Other players */}
          {otherPlayers.map((player, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-white font-medium">{player.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 text-slate-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm">Waiting for host</span>
        </div>
      </div>
    </div>
  )
}
