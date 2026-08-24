import { useEffect } from 'react'
import { Layers, MessageSquareText, Compass, Info } from 'lucide-react'

import atomicLogo from '@/assets/atomic-health-logo.svg'

/**
 * Welcome modal — the first thing a reviewer sees, before the Guided
 * Showcase starts. Sets context: what this prototype is, what we'll ask,
 * and how to review and leave feedback. Atomic Health prototype-chrome
 * branding, matching Prototype Options and the tour tooltips.
 */

const atomic = {
  bg: '#eaf6fe',
  border: '#cde8fa',
  text: '#0f1e2e',
}

const sections = [
  {
    icon: Layers,
    title: 'What this is',
    body: 'A working prototype of the new Livtech UI. Three visual directions (Options A, B, and C) are applied to two real screens: the CRM Dashboard and Clinical Prospects.',
  },
  {
    icon: MessageSquareText,
    title: "What we'll ask",
    body: 'A two-minute guided tour walks you through each direction, then asks for your favorite and least favorite. Your vote directly decides the direction we build, so please submit before you leave. Comments are optional.',
  },
  {
    icon: Compass,
    title: 'How to review',
    body: 'Answers save as you go, so you can move at your own pace. After the tour, explore freely: Prototype Options in the bottom right switches styles, replays the tour, and opens the UX details walkthrough.',
  },
]

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
  // Esc closes the modal the same way "Explore on my own" does.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onSkip])

  if (!open) return null

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
        <h2
          className="text-lg font-semibold"
          style={{ color: atomic.text }}
        >
          {name ? `Hi ${name}, welcome!` : 'Welcome!'}
        </h2>
        <p className="mt-1 text-sm" style={{ color: `${atomic.text}b3` }}>
          We are choosing between three design directions for the Livtech UI,
          and your vote decides it. Here is a quick orientation first.
        </p>

        <div className="mt-5 grid gap-4">
          {sections.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-3">
              {/* Ice-blue chips carry the Atomic branding on the white panel */}
              <div
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border"
                style={{ borderColor: atomic.border, backgroundColor: atomic.bg }}
              >
                <Icon className="size-4" style={{ color: atomic.text }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: atomic.text }}>
                  {title}
                </p>
                <p
                  className="mt-0.5 text-[13px] leading-relaxed"
                  style={{ color: `${atomic.text}b3` }}
                >
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expectation-setting: it looks real, but it's a visual prototype */}
        <div
          className="mt-5 flex items-start gap-2 rounded-lg border px-3 py-2.5"
          style={{ borderColor: atomic.border, backgroundColor: atomic.bg }}
        >
          <Info
            className="mt-px size-3.5 shrink-0"
            style={{ color: `${atomic.text}99` }}
          />
          <p className="text-xs leading-relaxed" style={{ color: `${atomic.text}bf` }}>
            This is a visual prototype, not a working app: most components,
            like tabs, buttons, and links, are not clickable. You are here to
            judge the look and feel.
          </p>
        </div>

        {submitted && (
          <p
            className="mt-4 rounded-lg px-3 py-2 text-xs"
            style={{
              backgroundColor: 'rgba(15, 30, 46, 0.06)',
              color: `${atomic.text}bf`,
            }}
          >
            You already submitted feedback, thank you! This time the tour
            simply replays the three style directions.
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
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
