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
  // The full staggered entrance plays exactly once; after it settles (or the
  // viewer pages on), panel changes use a quick crossfade instead — replaying
  // the stagger left blank frames while children waited out their delays.
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 1200)
    return () => clearTimeout(t)
  }, [])
  const goTo = (i: number) => {
    setEntered(true)
    setPanel(i)
  }

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
      body: 'A quick tour walks you through each style, then asks for your favorite and least favorite. That is it.',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300"
      style={{ backgroundColor: 'rgba(15, 30, 46, 0.45)' }}
      onClick={onSkip}
    >
      <div
        className="relative w-full max-w-[480px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Aurora glow drifting behind the panel — the design-firm calling card */}
        <div
          aria-hidden
          className="welcome-halo absolute -inset-5 rounded-[36px] opacity-50"
          style={{
            background:
              'conic-gradient(from 120deg, #885cf6, #7cb9e8, #4cc3b0, #a58bfa, #885cf6)',
          }}
        />
        <div
          id="welcome-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to the Livtech UI Prototype"
          className="welcome-pop relative w-full rounded-2xl border bg-white p-6 shadow-2xl"
          style={{ borderColor: atomic.border }}
        >
        {/* One panel at a time — entrance staggers once, then quick crossfades */}
        <div
          key={panel}
          className={`flex min-h-[230px] flex-col items-center justify-center gap-4 px-2 py-6 text-center ${
            entered
              ? 'animate-in fade-in slide-in-from-right-4 duration-300 ease-out'
              : ''
          }`}
        >
          <div
            className={`relative ${
              entered
                ? ''
                : 'animate-in fade-in zoom-in-50 duration-500 [animation-delay:150ms] [animation-fill-mode:backwards]'
            }`}
          >
            {/* One-time ring burst as the chip lands on first open */}
            {!entered && (
              <span
                aria-hidden
                className="welcome-ring absolute inset-0 rounded-full border-2"
                style={{ borderColor: '#885cf6' }}
              />
            )}
            <div
              className="flex size-14 items-center justify-center rounded-full border"
              style={{ borderColor: atomic.border, backgroundColor: atomic.bg }}
            >
              <Icon className="size-6" style={{ color: atomic.text }} />
            </div>
          </div>
          <h2
            className={`welcome-title text-2xl font-semibold ${
              entered
                ? ''
                : 'animate-in fade-in slide-in-from-bottom-3 duration-500 [animation-delay:250ms] [animation-fill-mode:backwards]'
            }`}
          >
            {title}
          </h2>
          <p
            className={`max-w-[380px] text-base leading-relaxed ${
              entered
                ? ''
                : 'animate-in fade-in slide-in-from-bottom-3 duration-500 [animation-delay:400ms] [animation-fill-mode:backwards]'
            }`}
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
        <div className="mt-2 flex items-center justify-between animate-in fade-in duration-500 [animation-delay:550ms] [animation-fill-mode:backwards]">
          <div className="flex gap-1.5">
            {panels.map((p, i) => (
              <button
                key={p.title}
                onClick={() => goTo(i)}
                aria-label={`Go to step ${i + 1}`}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === panel ? 20 : 8,
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
                  className="h-10 rounded-full px-4 text-sm font-medium transition-all duration-200 hover:bg-[#eaf6fe] active:scale-95"
                  style={{ color: `${atomic.text}99` }}
                >
                  Maybe later
                </button>
                <button
                  onClick={onStart}
                  className="h-10 rounded-full px-5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: atomic.text }}
                >
                  Start the Tour
                </button>
              </>
            ) : (
              <button
                onClick={() => goTo(panel + 1)}
                className="h-10 rounded-full px-5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: atomic.text }}
              >
                Next
              </button>
            )}
          </div>
        </div>

          {/* Brand footer, same treatment as the Prototype Options panel */}
          <div
            className="mt-5 flex items-center justify-end gap-1.5 border-t pt-3 animate-in fade-in duration-500 [animation-delay:650ms] [animation-fill-mode:backwards]"
            style={{ borderColor: atomic.border }}
          >
            <span className="text-xs" style={{ color: `${atomic.text}99` }}>
              by
            </span>
            <img
              src={atomicLogo}
              alt="Atomic Health"
              className="h-[22px] w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
