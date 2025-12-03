import { usePartySocketContext } from '@bcmedialab/party-games-core/client'
import { useGameStore } from '../stores/gameStore'
import type { Card } from '../types'

export function Tabla() {
  const { emit, isHost } = usePartySocketContext()

  const markCard = (cardId: number) => {
    emit('mark-card', { cardId })
  }

  const claimWin = () => {
    emit('claim-win', {})
  }

  const handleDrawCard = () => {
    emit('draw-card', {})
  }

  const handlePause = () => {
    emit('pause-game', {})
  }

  const handleResume = () => {
    emit('resume-game', {})
  }

  // Game state from store (events handled by useGameEvents hook in App)
  const {
    phase,
    tabla,
    currentCard,
    drawnCards,
    drawSpeed,
    language,
    showWinClaim,
    pendingWinClaim,
    setPendingWinClaim,
    setShowWinClaim
  } = useGameStore()

  const isPaused = phase === 'paused'
  const isManualDraw = drawSpeed === 0

  // Debug logging for host controls
  console.log('[Tabla] Host controls check:', { isHost, isManualDraw, drawSpeed, isPaused })

  const handleCellTap = (cardId: number) => {
    // Check if this card has been drawn
    const isDrawn = drawnCards.some((c) => c.id === cardId)
    if (!isDrawn) return

    // Check if already marked
    const cell = tabla.find((c) => c.card.id === cardId)
    if (cell?.marked) return

    markCard(cardId)
  }

  const handleClaimWin = () => {
    setPendingWinClaim(true)
    setShowWinClaim(false)
    claimWin()
  }

  const getCardName = (card: Card) => {
    return language === 'es' ? card.name_es : card.name_en
  }

  return (
    <div className="flex-1 flex flex-col p-2 pb-4 overflow-hidden">
      {/* Current card display - fixed height */}
      {currentCard && (
        <div className="text-center py-2 shrink-0">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Current Card</p>
          <p className="text-xl font-bold text-amber-500">{getCardName(currentCard)}</p>
        </div>
      )}

      {/* 4x4 Tabla grid - flexible but constrained, taller cells for card aspect ratio */}
      <div className="flex-1 flex items-center justify-center min-h-0 px-2">
        <div className="grid grid-cols-4 gap-1.5 w-full max-w-lg" style={{ maxHeight: '100%' }}>
          {tabla.map((cell) => {
            const isDrawn = drawnCards.some((c) => c.id === cell.card.id)
            const canMark = isDrawn && !cell.marked

            return (
              <button
                key={cell.position}
                onClick={() => handleCellTap(cell.card.id)}
                disabled={!canMark}
                className={`
                  relative rounded-lg overflow-hidden transition-all
                  ${cell.marked
                    ? 'ring-4 ring-amber-500 ring-inset'
                    : isDrawn
                      ? 'ring-2 ring-green-500 animate-pulse'
                      : ''
                  }
                  ${canMark ? 'active:scale-95' : ''}
                `}
                style={{ aspectRatio: '0.737' }}
              >
                {/* Card image */}
                <img
                  src={`/cards/base/${cell.card.image}.webp`}
                  alt={getCardName(cell.card)}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Marked overlay */}
                {cell.marked && (
                  <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom section - always visible, fixed height */}
      <div className="shrink-0 pt-2 space-y-2">
        {/* Win claim button */}
        {showWinClaim && (
          <button
            onClick={handleClaimWin}
            disabled={pendingWinClaim}
            className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-slate-700 text-white font-bold text-xl rounded-xl transition-colors animate-pulse"
          >
            {pendingWinClaim ? 'Checking...' : '¡LOTERÍA!'}
          </button>
        )}

        {/* Pending claim indicator */}
        {pendingWinClaim && (
          <div className="py-2 text-center">
            <div className="inline-flex items-center gap-2 text-amber-500">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span>Verifying your win...</span>
            </div>
          </div>
        )}

        {/* Host controls */}
        {isHost && (
          <div className="flex gap-2">
            {/* Manual draw button */}
            {isManualDraw && !isPaused && (
              <button
                onClick={handleDrawCard}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors"
              >
                Draw Card
              </button>
            )}

            {/* Pause/Resume button */}
            <button
              onClick={isPaused ? handleResume : handlePause}
              className={`${isManualDraw ? 'px-4' : 'flex-1'} py-3 font-bold rounded-xl transition-colors ${
                isPaused
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        )}

        {/* Paused indicator for non-host */}
        {isPaused && !isHost && (
          <div className="py-2 text-center">
            <span className="text-amber-500 font-medium">Game Paused</span>
          </div>
        )}
      </div>
    </div>
  )
}
