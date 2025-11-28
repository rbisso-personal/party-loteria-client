import { useEffect } from 'react'
import { usePartySocketContext } from '@bcmedialab/party-games-core/client'
import { useGameStore } from '../stores/gameStore'
import type { Card, Tabla } from '../types'

interface GameStartedData {
  winPattern: string
  drawSpeed: number
  totalCards: number
  playerCount: number
}

interface CardDrawnData {
  card: Card
  cardNumber: number
  totalCards: number
  drawnCardIds: number[]
}

interface GameOverData {
  reason: 'winner' | 'deck-empty'
  winner?: {
    id: string
    name: string
    pattern: number[]
  }
}

/**
 * Hook to listen for game events at the app level.
 * This must be mounted before game-specific screens to catch events.
 */
export function useGameEvents() {
  const { socket } = usePartySocketContext()
  const {
    setPhase,
    setTabla,
    setCurrentCard,
    addDrawnCard,
    setWinPattern,
    setDrawSpeed,
    markCell,
    setShowWinClaim,
    setPendingWinClaim,
    reset
  } = useGameStore()

  useEffect(() => {
    if (!socket) return

    console.log('[useGameEvents] Setting up game event listeners')

    // Game started - transition to playing phase
    const handleGameStarted = (data: GameStartedData) => {
      console.log('[useGameEvents] game-started received:', data)
      setWinPattern(data.winPattern)
      setDrawSpeed(data.drawSpeed)
      setPhase('playing')
    }

    // Tabla assigned - receive our board
    const handleTablaAssigned = (data: { tabla: Tabla }) => {
      console.log('[useGameEvents] tabla-assigned received:', data.tabla.length, 'cells')
      setTabla(data.tabla)
    }

    // Card drawn - update current card
    const handleCardDrawn = (data: CardDrawnData) => {
      console.log('[useGameEvents] card-drawn received:', data.card.name_es)
      setCurrentCard(data.card)
      addDrawnCard(data.card)
    }

    // Mark confirmed - update our tabla
    const handleMarkConfirmed = (data: { cardId: number; position: number }) => {
      console.log('[useGameEvents] mark-confirmed:', data)
      markCell(data.cardId)
    }

    // Win available - show claim button
    const handleWinAvailable = () => {
      console.log('[useGameEvents] win-available')
      setShowWinClaim(true)
    }

    // Win result - verify our claim
    const handleWinResult = (data: { valid: boolean; winner?: boolean }) => {
      console.log('[useGameEvents] win-result:', data)
      setPendingWinClaim(false)
      if (!data.valid) {
        // False claim - could show feedback
      }
    }

    // Game over - transition to finished phase
    const handleGameOver = (data: GameOverData) => {
      console.log('[useGameEvents] game-over:', data)
      setPhase('finished')
    }

    // Game paused
    const handleGamePaused = () => {
      console.log('[useGameEvents] game-paused')
      setPhase('paused')
    }

    // Game resumed
    const handleGameResumed = () => {
      console.log('[useGameEvents] game-resumed')
      setPhase('playing')
    }

    // Game reset - back to waiting
    const handleGameReset = () => {
      console.log('[useGameEvents] game-reset')
      reset()
    }

    socket.on('game-started', handleGameStarted)
    socket.on('tabla-assigned', handleTablaAssigned)
    socket.on('card-drawn', handleCardDrawn)
    socket.on('mark-confirmed', handleMarkConfirmed)
    socket.on('win-available', handleWinAvailable)
    socket.on('win-result', handleWinResult)
    socket.on('game-over', handleGameOver)
    socket.on('game-paused', handleGamePaused)
    socket.on('game-resumed', handleGameResumed)
    socket.on('game-reset', handleGameReset)

    return () => {
      console.log('[useGameEvents] Cleaning up game event listeners')
      socket.off('game-started', handleGameStarted)
      socket.off('tabla-assigned', handleTablaAssigned)
      socket.off('card-drawn', handleCardDrawn)
      socket.off('mark-confirmed', handleMarkConfirmed)
      socket.off('win-available', handleWinAvailable)
      socket.off('win-result', handleWinResult)
      socket.off('game-over', handleGameOver)
      socket.off('game-paused', handleGamePaused)
      socket.off('game-resumed', handleGameResumed)
      socket.off('game-reset', handleGameReset)
    }
  }, [
    socket,
    setPhase,
    setTabla,
    setCurrentCard,
    addDrawnCard,
    setWinPattern,
    setDrawSpeed,
    markCell,
    setShowWinClaim,
    setPendingWinClaim,
    reset
  ])
}
