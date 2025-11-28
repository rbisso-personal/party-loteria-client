/**
 * Game-specific types for Lotería
 *
 * Note: Connection, room, and player types are provided by
 * @bcmedialab/party-games-core. These types are specific to
 * the Lotería game mechanics.
 */

// Card data matching server's cards.json structure
export interface Card {
  id: number
  name_es: string
  name_en: string
  verse_es: string
  verse_en: string
  image: string
  vo_es: string
  vo_en: string
}

// A cell on the player's tabla (board)
export interface TablaCell {
  card: Card
  marked: boolean
  position: number // 0-15 for 4x4 grid
}

// Player's tabla (4x4 board)
export type Tabla = TablaCell[]

// Game phases
export type GamePhase =
  | 'waiting'    // Waiting for game to start
  | 'playing'    // Game in progress
  | 'paused'     // Game paused by host
  | 'finished'   // Game over
