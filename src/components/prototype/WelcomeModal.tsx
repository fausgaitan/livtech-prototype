import { useEffect, useState } from 'react'
import { Layers, MessageSquareText, Info } from 'lucide-react'

import atomicLogo from '@/assets/atomic-health-logo.svg'

/**
 * Welcome modal — a three-panel intro shown before the Guided Showcase.
 * One big idea per panel, large type, minimal words:
 *   1. What this is  2. Your input is key  3. Prototype disclaimer
 * The final panel carries the Start the Tour / Maybe later actions.
 * Atomic Health prototype-chrome branding on a white dialog.
 */

const atomic = {
  bg: '#eaf6fe',
  border: '#cde8fa',
  text: '#0f1e2e',
}

export function WelcomeModal({
  open,
  name,
  submitted,
  onStart,
  onSkip,
}: {
  open: boolean
  /** Reviewer name from a personalized ?name= link, if any. */
  name: string
  /** True when this browser already submitted feedback. */
  submitted: boolean
  onStart: () => void
  onSkip: () => void
}) {
  const [panel, setPanel] = useState(0)

  // Esc closes the modal the same way "Maybe later" does.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onSkip])

  if (!open) return null

  const panels = [
    {
      icon: Layers,
      title: name ? `Hi ${name}!` : 'Welcome!',
      body: 'This is a preview of the new Livtech UI. Same app, three different visual styles: A, B, and C.',
    },
    {
      icon: MessageSquareText,
      title: 'Your input is key!',
      body: 'A two-minute tour walks you through each style, then asks for your favorite and least favorite. That is it.',
    },
    {
      icon: Info,
      title: 'Before you start',
      body: 'This is a visual prototype, so most buttons, tabs, and links are not clickable. You are here to judge the look and feel.',
    },
  ]
  const last = panel === panels.length - 1
  const { icon: Icon, title, body } = panels[panel]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 30, 46, 0.45)' }}
      onClick={onSkip}
    >
      <div
        id="welcome-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to the Livtech UI Prototype"
        className="w-full max-w-[480px] rounded-2xl border bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
        style={{ borderColor: atomic.border }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* One panel at a time — keyed so each slide animates in */}
        <div
          key={panel}
          className="flex min-h-[230px] flex-col items-center justify-center gap-4 px-2 py-6 text-center animate-in fade-in slide-in-from-right-2 duration-200"
        >
          <div
            className="flex size-14 items-center justify-center rounded-full border"
            style={{ borderColor: atomic.border, backgroundColor: atomic.bg }}
          >
            <Icon className="size-6" style={{ color: atomic.text }} />
          </div>
          <h2 className="text-2xl font-semibold" style={{ color: atomic.text }}>
            {title}
          </h2>
          <p
            className="max-w-[380px] text-base leading-relaxed"
            style={{ color: `${atomic.text}b3` }}
          >
            {body}
          </p>
          {last && submitted && (
            <p
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: 'rgba(15, 30, 46, 0.06)',
                color: `${atomic.text}bf`,
              }}
            >
              You already submitted feedback, thank you! This time the tour
              simply replays the three styles.
            </p>
          )}
        </div>

        {/* Dots + actions: Next until the last panel, then Start / later */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-1.5">
            {panels.map((p, i) => (
              <button
                key={p.title}
                onClick={() => setPanel(i)}
                aria-label={`Go to step ${i + 1}`}
                className="size-2 rounded-full transition-colors"
                style={{
                  backgroundColor: i === panel ? atomic.text : atomic.border,
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {last ? (
              <>
                <button
                  onClick={onSkip}
                  className="h-10 rounded-full px-4 text-sm font-medium transition-colors hover:bg-[#eaf6fe]"
                  style={{ color: `${atomic.text}99` }}
                >
                  Maybe later
                </button>
                <button
                  onClick={onStart}
                  className="h-10 rounded-full px-5 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90"
                  style={{ backgroundColor: atomic.text }}
                >
                  Start the Tour
                </button>
              </>
            ) : (
              <button
                onClick={() => setPanel(panel + 1)}
                className="h-10 rounded-full px-5 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90"
                style={{ backgroundColor: atomic.text }}
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Brand footer, same treatment as the Prototype Options panel */}
        <div
          className="mt-5 flex items-center justify-end gap-1.5 border-t pt-3"
          style={{ borderColor: atomic.border }}
        >
          <span className="text-xs" style={{ color: `${atomic.text}99` }}>
            by
          </span>
          <img src={atomicLogo} alt="Atomic Health" className="h-[22px] w-auto" />
        </div>
      </div>
    </div>
  )
}
