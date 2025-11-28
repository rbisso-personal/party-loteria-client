import { usePartySocketContext } from '@bcmedialab/party-games-core/client'

export function ConnectionOverlay() {
  const { status } = usePartySocketContext()

  if (status === 'connected') {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center p-8 rounded-2xl bg-slate-800 shadow-xl max-w-sm mx-4">
        {(status === 'disconnected') && (
          <>
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Connecting...</h2>
            <p className="text-slate-400">Establishing connection to server</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 text-red-500 mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
            <p className="text-slate-400 mb-4">
              Unable to connect to the game server
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
