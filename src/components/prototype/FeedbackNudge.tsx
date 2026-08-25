import { MessageSquareText } from 'lucide-react'

/**
 * Feedback nudge — a persistent bottom-center pill that keeps pushing for
 * the vote. Shows whenever no tour or welcome modal is up AND this browser
 * has not submitted feedback yet; disappears for good once feedback lands.
 * The submissions ARE the point of this prototype, so skipping the welcome
 * modal or closing the tour early should never be a silent exit.
 */
export function FeedbackNudge({
  visible,
  onClick,
}: {
  visible: boolean
  onClick: () => void
}) {
  if (!visible) return null

  return (
    <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button
        onClick={onClick}
        className="flex h-11 items-center gap-2.5 rounded-full px-5 text-sm font-medium text-white shadow-lg transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#0f1e2e' }}
      >
        {/* Pulsing amber dot: "action still needed" */}
        <span className="relative flex size-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: '#f59e0b' }}
          />
          <span
            className="relative inline-flex size-2 rounded-full"
            style={{ backgroundColor: '#f59e0b' }}
          />
        </span>
        <MessageSquareText className="size-4" />
        Vote on the 3 styles
      </button>
    </div>
  )
}
