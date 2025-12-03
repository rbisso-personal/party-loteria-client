declare module '@bcmedialab/party-games-core/client' {
  import { ReactNode } from 'react'
  import { Socket } from 'socket.io-client'

  export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'

  export interface Player {
    id: string
    name: string
    [key: string]: unknown
  }

  export interface PartySocketState {
    socket: Socket | null
    status: ConnectionStatus
    roomCode: string | null
    playerName: string | null
    players: Player[]
    hostId: string | null
    isHost: boolean
    error: string | null
    isConnected: boolean
    isInRoom: boolean
    joinRoom: (code: string) => void
    submitName: (name: string) => void
    sendMessage: (message: string) => void
    transferHost: (newHostId: string) => void
    kickPlayer: (playerId: string, reason?: string) => void
    emit: (event: string, data?: unknown) => void
    on: (event: string, callback: (...args: unknown[]) => void) => () => void
    off: (event: string, callback: (...args: unknown[]) => void) => void
  }

  export interface PartySocketProviderProps {
    children: ReactNode
    server: string
    socketOptions?: object
    onConnect?: (socket: Socket) => void
    onDisconnect?: (reason: string) => void
    onError?: (error: Error) => void
    onLobbyUpdate?: (players: Player[]) => void
    onRoomClosed?: (data: { message: string }) => void
  }

  export function PartySocketProvider(props: PartySocketProviderProps): JSX.Element
  export function usePartySocketContext(): PartySocketState
  export function usePartySocket(options?: Partial<PartySocketProviderProps>): PartySocketState

  export function RoomCodeInput(props: {
    onJoin: (code: string) => void
    disabled?: boolean
    placeholder?: string
  }): JSX.Element

  export function PlayerNameInput(props: {
    onSubmit: (name: string) => void
    disabled?: boolean
    placeholder?: string
  }): JSX.Element
}
