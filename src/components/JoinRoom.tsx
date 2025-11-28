import { useState, useEffect, useRef } from 'react'
import { usePartySocketContext } from '@bcmedialab/party-games-core/client'

export function JoinRoom() {
  const [inputCode, setInputCode] = useState('')
  const { joinRoom, isConnected, error } = usePartySocketContext()
  const hasAttemptedAutoJoin = useRef(false)

  // Check URL for room code parameter and auto-join
  useEffect(() => {
    if (hasAttemptedAutoJoin.current || !isConnected) return

    const params = new URLSearchParams(window.location.search)
    const urlRoomCode = params.get('room')
    if (urlRoomCode && urlRoomCode.length === 4) {
      const code = urlRoomCode.toUpperCase()
      setInputCode(code)
      hasAttemptedAutoJoin.current = true
      joinRoom(code)
    }
  }, [isConnected, joinRoom])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputCode.length === 4) {
      joinRoom(inputCode)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (value.length <= 4) {
      setInputCode(value)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-500 mb-2">Lotería</h1>
          <p className="text-slate-400">Enter the room code shown on the TV</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={inputCode}
              onChange={handleInputChange}
              placeholder="ABCD"
              className="w-full text-center text-4xl font-mono tracking-[0.5em] py-4 px-6 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none transition-colors"
              autoFocus
              autoComplete="off"
              autoCapitalize="characters"
            />
          </div>

          {error && (
            <p className="text-red-400 text-center text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={inputCode.length !== 4}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 text-black font-bold text-lg rounded-xl transition-colors"
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  )
}
