import { create } from 'zustand'
import type { Card, Tabla, GamePhase } from '../types'

/**
 * Winner info when game ends
 */
export interface Winner {
  id: string
  name: string
  pattern: number[]
}

/**
 * Game-specific state for Lotería
 *
 * Note: Room/player state (roomCode, playerName, players) is managed by
 * party-games-core via usePartySocketContext(). This store only holds
 * game-specific state like the tabla, drawn cards, and game phase.
 */
interface GameState {
  // Game phase
  phase: GamePhase

  // Player's tabla (board)
  tabla: Tabla

  // Game state
  currentCard: Card | null
  drawnCards: Card[]
  winner: Winner | null

  // Settings
  winPattern: string
  drawSpeed: number
  language: 'es' | 'en'

  // UI state
  showWinClaim: boolean
  pendingWinClaim: boolean
}

interface GameActions {
  // Game actions
  setPhase: (phase: GamePhase) => void
  setTabla: (tabla: Tabla) => void
  markCell: (cardId: number) => void
  setCurrentCard: (card: Card | null) => void
  addDrawnCard: (card: Card) => void
  setWinner: (winner: Winner | null) => void

  // Settings
  setWinPattern: (pattern: string) => void
  setDrawSpeed: (speed: number) => void
  setLanguage: (lang: 'es' | 'en') => void

  // UI
  setShowWinClaim: (show: boolean) => void
  setPendingWinClaim: (pending: boolean) => void

  // Reset
  reset: () => void
}

const initialState: GameState = {
  phase: 'waiting',
  tabla: [],
  currentCard: null,
  drawnCards: [],
  winner: null,
  winPattern: 'line',
  drawSpeed: 8,
  language: 'es',
  showWinClaim: false,
  pendingWinClaim: false
}

export const useGameStore = create<GameState & GameActions>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),
  setTabla: (tabla) => set({ tabla }),

  markCell: (cardId) =>
    set((state) => ({
      tabla: state.tabla.map((cell) =>
        cell.card.id === cardId ? { ...cell, marked: true } : cell
      )
    })),

  setCurrentCard: (card) => set({ currentCard: card }),
  addDrawnCard: (card) =>
    set((state) => ({
      drawnCards: [...state.drawnCards, card]
    })),
  setWinner: (winner) => set({ winner }),

  setWinPattern: (pattern) => set({ winPattern: pattern }),
  setDrawSpeed: (speed) => set({ drawSpeed: speed }),
  setLanguage: (lang) => set({ language: lang }),

  setShowWinClaim: (show) => set({ showWinClaim: show }),
  setPendingWinClaim: (pending) => set({ pendingWinClaim: pending }),

  reset: () => set(initialState)
}))
