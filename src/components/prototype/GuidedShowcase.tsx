import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Joyride,
  EVENTS,
  type EventData,
  type Step,
  type TourData,
} from 'react-joyride'

import { useVariant, type VariantKey } from '@/lib/variant'
import { WelcomeModal } from '@/components/prototype/WelcomeModal'
import { FeedbackNudge } from '@/components/prototype/FeedbackNudge'

/**
 * Guided Showcase — Atomic Health branded react-joyride tours.
 *
 * Two separate tours so the client isn't firehosed:
 * - `visual` (offered by the welcome modal on every load): the three design
 *   directions + chart palette, closing with a feedback ask. Theme switches
 *   live per step.
 * - `ux` (launched from "See UX Details" in Prototype Options): sidebar
 *   collapse, product switcher, modal, and drawer, presented in Option C.
 */

export type TourKind = 'visual' | 'ux'

/** UI the tour opens itself so the client sees the real thing, not a button. */
export type TourElement = 'switcher' | 'modal' | 'drawer' | null

/** Scannable tooltip body: short lead line + bullets, easy for execs to skim. */
function StepList({ lead, items }: { lead?: string; items: string[] }) {
  return (
    <div>
      {lead && <p style={{ marginBottom: 8 }}>{lead}</p>}
      <ul style={{ display: 'grid', gap: 6, paddingLeft: 18, listStyle: 'disc' }}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Client feedback captured by the visual tour. Persisted to localStorage so
 * answers survive Back/Next and can be read after the session:
 *   JSON.parse(localStorage.getItem('livtech-tour-feedback'))
 */
const FEEDBACK_KEY = 'livtech-tour-feedback'

/** Google Sheet inbox — Apps Script web app that upserts on submissionId. */
const FEEDBACK_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwQEEKG6FKyCPnLeKp7_YX08EufBD5D_veSvffDhC9wdZWTrenoQ-JGSk-IlTJfb_SU/exec'

function readFeedback(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeFeedback(patch: Record<string, string>) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify({ ...readFeedback(), ...patch }))
}

/**
 * Stable per-browser id so re-submissions UPDATE the same spreadsheet row
 * instead of appending a duplicate (the Apps Script upserts on this key).
 */
function ensureSubmissionId() {
  if (!readFeedback().submissionId) {
    writeFeedback({ submissionId: crypto.randomUUID() })
  }
}

/** True once this browser has submitted at least once. */
export function hasSubmittedFeedback() {
  return Boolean(readFeedback().submittedAt)
}

/**
 * Clear all answers and start fresh. A new submissionId is seeded, so the
 * next submission creates a NEW spreadsheet row rather than editing the old.
 */
export function resetFeedback() {
  localStorage.removeItem(FEEDBACK_KEY)
  ensureSubmissionId()
}

const previewViews = [
  { label: 'Dashboard', path: '/crm/dashboard' },
  { label: 'Prospects', path: '/clinical/prospects' },
]

/**
 * In-tooltip view switcher: flips the page behind the tour so reviewers can
 * see each style on both screens without leaving the step.
 */
function ViewSwitcher() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          fontSize: 12,
          color: 'rgba(15, 30, 46, 0.6)',
          whiteSpace: 'nowrap',
        }}
      >
        See the style on:
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {previewViews.map((view) => {
          const active = pathname === view.path
          return (
            <button
              key={view.path}
              onClick={() => navigate(view.path)}
              style={{
                padding: '5px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                cursor: active ? 'default' : 'pointer',
                // Selected: light-blue outline variant — the dark fill is
                // reserved for the tour's primary CTA.
                border: `1px solid ${active ? '#7cb9e8' : 'transparent'}`,
                backgroundColor: active ? '#dceffc' : 'transparent',
                color: '#0f1e2e',
              }}
            >
              {view.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Option picker + comment box used by the favorite / least favorite steps. */

function FeedbackStep({
  kind,
  question,
}: {
  kind: 'favorite' | 'least'
  question: string
}) {
  const { setVariant } = useVariant()
  const [choice, setChoice] = useState(() => readFeedback()[kind] ?? '')
  const [comment, setComment] = useState(
    () => readFeedback()[`${kind}Comment`] ?? '',
  )

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <p>{question}</p>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['A', 'B', 'C'] as const).map((option) => {
          const selected = choice === option
          return (
            <button
              key={option}
              onClick={() => {
                setChoice(option)
                writeFeedback({ [kind]: option })
                // Preview the picked direction live behind the tooltip.
                setVariant(option)
              }}
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                border: `1px solid ${selected ? '#0f1e2e' : '#cde8fa'}`,
                backgroundColor: selected ? '#0f1e2e' : '#ffffff',
                color: selected ? '#ffffff' : '#0f1e2e',
              }}
            >
              Option {option}
            </button>
          )
        })}
      </div>
      {/* Preview aid, deliberately below the answers: it changes the page
          behind the tooltip, not the answer. */}
      <ViewSwitcher />
      <textarea
        rows={3}
        placeholder="Leave a comment (optional)"
        value={comment}
        onChange={(e) => {
          setComment(e.target.value)
          writeFeedback({ [`${kind}Comment`]: e.target.value })
        }}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: 10,
          border: '1px solid #cde8fa',
          backgroundColor: '#ffffff',
          color: '#0f1e2e',
          fontSize: 13,
          fontFamily: 'inherit',
          lineHeight: 1.5,
          resize: 'none',
          outline: 'none',
        }}
      />
    </div>
  )
}

/** Name step: optional attribution, anonymity stays the default. */
function NameStep() {
  const [name, setName] = useState(() => readFeedback().name ?? '')
  const submittedAt = readFeedback().submittedAt

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {submittedAt && (
        <p
          style={{
            padding: '7px 10px',
            borderRadius: 10,
            backgroundColor: 'rgba(15, 30, 46, 0.06)',
            fontSize: 12,
            color: 'rgba(15, 30, 46, 0.75)',
          }}
        >
          You submitted on {new Date(submittedAt).toLocaleDateString()}.
          Submitting again will update your previous response.
        </p>
      )}
      <p>Add your name so we know who this is from, then hit Submit.</p>
      <input
        value={name}
        placeholder="Your name"
        onChange={(e) => {
          setName(e.target.value)
          writeFeedback({ name: e.target.value })
        }}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: 10,
          border: '1px solid #cde8fa',
          backgroundColor: '#ffffff',
          color: '#0f1e2e',
          fontSize: 13,
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
    </div>
  )
}

/** The theme steps anchor to Prototype Options and spotlight the whole app. */
const themeStepBase = {
  target: '#prototype-options',
  spotlightTarget: '#app-shell',
  placement: 'top-end' as const,
}

// ---------------------------------------------------------------------------
// Visual tour — design directions + palette, then ask for feedback
// ---------------------------------------------------------------------------

const visualSteps: Step[] = [
  {
    ...themeStepBase,
    title: 'Option A - Bold & Structured',
    content: (
      <div style={{ display: 'grid', gap: 12 }}>
        <StepList
          lead="A traditional, high-contrast layout:"
          items={[
            'Dark, solid sidebar grounds the navigation',
            'Standard tabs for clear data separation',
            'Cold chart colors, strictly on brand',
          ]}
        />
        <ViewSwitcher />
      </div>
    ),
  },
  {
    ...themeStepBase,
    title: 'Option B - Light & Streamlined',
    content: (
      <div style={{ display: 'grid', gap: 12 }}>
        <StepList
          lead="Less visual weight, more breathing room:"
          items={[
            'Light gradient background',
            'Segmented controls instead of standard tabs',
            'Thinner, animated charts',
          ]}
        />
        <ViewSwitcher />
      </div>
    ),
  },
  {
    ...themeStepBase,
    title: 'Option C - Soft & Elevated',
    content: (
      <div style={{ display: 'grid', gap: 12 }}>
        <StepList
          lead="Depth and approachability:"
          items={[
            'Floating cards on a subtle gradient',
            'Rounded corners everywhere, including modals and drawers',
            'Soft shadows provide the visual structure',
          ]}
        />
        <ViewSwitcher />
      </div>
    ),
  },
  {
    ...themeStepBase,
    title: 'Your Favorite',
    content: (
      <FeedbackStep kind="favorite" question="Thinking of the whole UI, which overall style was your favorite?" />
    ),
  },
  {
    ...themeStepBase,
    title: 'Your Least Favorite',
    content: (
      <FeedbackStep kind="least" question="And which overall style was your least favorite?" />
    ),
  },
  {
    ...themeStepBase,
    title: 'One Last Thing',
    // The primary button is the explicit Submit action.
    buttons: ['back', 'primary'],
    locale: { next: 'Submit', nextWithProgress: 'Submit' },
    content: <NameStep />,
  },
  {
    ...themeStepBase,
    title: 'Thanks for Your Feedback',
    // Post-submission: just a single Close button, no going back.
    buttons: ['primary'],
    locale: { last: 'Close' },
    content: <ThanksMessage />,
  },
]

/**
 * Once feedback is submitted, Take a Tour / refresh replays only the three
 * style steps — the questions are skipped.
 */
const visualStepsShort: Step[] = visualSteps.slice(0, 3)

/** Theme applied per visual-tour step; later steps stay on C. */
const visualStepVariants: VariantKey[] = ['A', 'B', 'C']

/** Index of the visual tour's thanks step — reaching it means Submit was clicked. */
const visualThanksIndex = visualSteps.length - 1

/**
 * Finalize the submission. Stamps the record; this is also the hook where
 * the payload will POST to the feedback endpoint (Google Sheet) once wired.
 * Re-submissions stamp updatedAt so the endpoint can upsert the same row
 * (keyed on submissionId) rather than append a duplicate.
 */
function submitFeedback() {
  const now = new Date().toISOString()
  writeFeedback(
    readFeedback().submittedAt ? { updatedAt: now } : { submittedAt: now },
  )
  // Fire-and-forget POST to the Google Sheet. text/plain + no-cors avoids
  // the CORS preflight Apps Script can't answer; the response is opaque,
  // so localStorage stays the source of truth either way.
  fetch(FEEDBACK_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(readFeedback()),
  }).catch(() => {
    // Offline or blocked: answers remain in localStorage.
  })
}

/** Thanks copy adapts: first submission vs an update. */
function ThanksMessage() {
  const wasUpdate = Boolean(readFeedback().updatedAt)
  return (
    <p>
      {wasUpdate
        ? 'Your feedback has been updated. '
        : 'Your feedback has been recorded. '}
      Keep exploring the prototype, and open Prototype Options → See UX Details
      for the interaction patterns.
    </p>
  )
}

// ---------------------------------------------------------------------------
// UX tour — interaction patterns, presented in Option C
// ---------------------------------------------------------------------------

const uxSteps: Step[] = [
  {
    target: '#dashboard-charts',
    placement: 'top',
    title: 'Cold-Toned Data Visualizations',
    content: (
      <StepList
        lead="Every option keeps charts in a cold palette (purples, blues, teals) so data always feels on brand:"
        items={[
          'Option A: high-contrast solids',
          'Option B: thin strokes, airy feel',
          'Option C: soft purple-to-blue ramps',
        ]}
      />
    ),
  },
  {
    target: '#app-sidebar',
    placement: 'right',
    // Let the client actually try the interaction while the step is up.
    blockTargetInteraction: false,
    title: 'Collapsible Sidebar',
    content: (
      <StepList
        lead="Try it now:"
        items={[
          'Click Collapse at the bottom of the sidebar',
          'Navigation folds into a compact icon rail',
          'More room for the content that matters',
          'Hover the icons for tooltips and submenus',
        ]}
      />
    ),
  },
  {
    target: '#product-switcher-panel',
    placement: 'bottom',
    isFixed: true,
    title: 'Product Suite Switcher',
    content: (
      <StepList
        items={[
          'The Eldermark chip opens the suite switcher',
          'Jump between products in one click',
          'You never lose your place in the app',
        ]}
      />
    ),
  },
  {
    target: '#add-evaluation-modal',
    placement: 'right',
    isFixed: true,
    title: 'Focused Modals',
    content: (
      <StepList
        lead="Quick actions open in a focused modal:"
        items={[
          'Searchable evaluation type dropdown',
          'The modal never resizes while you filter',
          'Soft, rounded Option C styling',
        ]}
      />
    ),
  },
  {
    target: '#review-drawer',
    placement: 'left',
    isFixed: true,
    title: 'Contextual Drawer',
    // Final step: just a single Close button.
    buttons: ['primary'],
    locale: { last: 'Close' },
    content: (
      <StepList
        lead="Reviews slide in from the right, no page change:"
        items={[
          'Scores, history, and sign-off in one place',
          'The record stays visible behind it',
          'Feel free to explore everything after the tour',
        ]}
      />
    ),
  },
]

// ---------------------------------------------------------------------------
// Per-tour orchestration: routes to visit and UI to force-open per step
// ---------------------------------------------------------------------------

const tourConfig: Record<
  TourKind,
  {
    steps: Step[]
    routes: Record<number, string>
    elements: Record<number, Exclude<TourElement, null>>
  }
> = {
  visual: {
    steps: visualSteps,
    routes: { 0: '/crm/dashboard' },
    elements: {},
  },
  ux: {
    steps: uxSteps,
    routes: {
      0: '/crm/dashboard',
      3: '/clinical/prospects',
      4: '/clinical/prospects',
    },
    elements: { 2: 'switcher', 3: 'modal', 4: 'drawer' },
  },
}

/** Static tooltip styling — module-level so Joyride props stay stable. */
const joyrideLocale = { last: 'Close' }

const joyrideStyles = {
  tooltip: { borderRadius: 16, padding: 20 },
  tooltipTitle: { fontSize: 16, fontWeight: 600, textAlign: 'left' as const },
  tooltipContent: {
    fontSize: 14,
    lineHeight: 1.6,
    textAlign: 'left' as const,
    padding: '12px 0 14px',
    borderBottom: '1px solid rgba(15, 30, 46, 0.1)',
  },
  tooltipFooter: { paddingTop: 14 },
  buttonPrimary: {
    borderRadius: 999,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 500,
  },
  buttonBack: { color: 'rgba(15, 30, 46, 0.6)', fontSize: 13 },
  buttonSkip: { color: 'rgba(15, 30, 46, 0.6)', fontSize: 13 },
}

type GuidedShowcaseContextValue = {
  /** Start a tour from step 1 — used by the Prototype Options rows. */
  startTour: (kind: TourKind) => void
  /** True while a tour is running — used to lock prototype chrome. */
  tourActive: boolean
  /** UI element the tour is currently force-opening (switcher/modal/drawer). */
  tourElement: TourElement
}

const GuidedShowcaseContext = createContext<GuidedShowcaseContextValue | null>(null)

export function GuidedShowcaseProvider({ children }: { children: ReactNode }) {
  const { setVariant } = useVariant()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [run, setRun] = useState(false)
  const [tour, setTour] = useState<TourKind>('visual')
  const [tourElement, setTourElement] = useState<TourElement>(null)
  // Submitted viewers get the short visual tour (style steps only).
  const [visualShort, setVisualShort] = useState(false)
  // Welcome modal gates the auto-run tour: intro first, then Start / skip.
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [welcomeName, setWelcomeName] = useState('')

  // Keep live values in refs so the Joyride handlers stay stable while
  // the tour navigates between pages.
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate
  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname
  const tourRef = useRef(tour)
  tourRef.current = tour

  // Open the welcome modal on every page load/refresh; the visual tour only
  // starts once the viewer clicks Start. Prior answers are preserved, so a
  // re-run doubles as an edit flow.
  useEffect(() => {
    // Personalized links: ?name=Jane pre-fills the submitter identity, so
    // feedback is attributable without the viewer typing anything.
    ensureSubmissionId()
    const name = new URLSearchParams(window.location.search).get('name')
    if (name) writeFeedback({ name })

    setWelcomeName(readFeedback().name ?? '')
    setVisualShort(hasSubmittedFeedback())
    setWelcomeOpen(true)
  }, [])

  const startTour = useCallback(
    (kind: TourKind) => {
      setTour(kind)
      // Already-submitted viewers only replay the three style steps.
      setVisualShort(hasSubmittedFeedback())
      // Visual tour walks A → B → C; the UX tour presents in C throughout.
      setVariant(kind === 'visual' ? 'A' : 'C')
      setRun(true)
    },
    [setVariant],
  )

  // Runs before each step's target lookup — routes to the page that owns
  // the step's target and force-opens the UI the step showcases, then
  // gives everything a beat to render/animate in.
  const handleBeforeStep = useCallback(async (data: TourData) => {
    const config = tourConfig[tourRef.current]
    let wait = 0

    const route = config.routes[data.index]
    if (route && pathnameRef.current !== route) {
      navigateRef.current(route)
      wait = 400
    }

    const element = config.elements[data.index] ?? null
    setTourElement(element)
    if (element) wait = Math.max(wait, 500)

    if (wait) await new Promise((resolve) => setTimeout(resolve, wait))
  }, [])

  // Stable options identity — a fresh object each render makes Joyride
  // re-initialize mid-step (the before hook itself triggers re-renders).
  const joyrideOptions = useMemo(
    () => ({
      before: handleBeforeStep,
      // Atomic Health prototype-chrome branding
      arrowColor: '#eaf6fe',
      backgroundColor: '#eaf6fe',
      overlayColor: 'rgba(15, 30, 46, 0.35)',
      primaryColor: '#0f1e2e',
      textColor: '#0f1e2e',
      width: 420,
      zIndex: 100,
      skipBeacon: true,
      showProgress: true,
      // The app shell is a fixed h-screen layout — nothing ever needs
      // scrolling, and a no-op scroll stalls the step lifecycle.
      skipScroll: true,
      buttons: ['skip', 'back', 'primary'] as ('skip' | 'back' | 'primary')[],
    }),
    [handleBeforeStep],
  )

  const handleEvent = useCallback(
    (data: EventData) => {
      if (data.type === EVENTS.STEP_BEFORE) {
        // Visual tour switches the skin per step; the UX tour stays on C.
        setVariant(
          tourRef.current === 'visual'
            ? (visualStepVariants[data.index] ?? 'C')
            : 'C',
        )
        // Landing on the thanks step means Submit was just clicked.
        if (tourRef.current === 'visual' && data.index === visualThanksIndex) {
          submitFeedback()
        }
      }

      // Completed, skipped, or closed → stop (it auto-runs again on refresh).
      if (data.type === EVENTS.TOUR_END) {
        setRun(false)
        setTourElement(null)
      }
    },
    [setVariant],
  )

  return (
    <GuidedShowcaseContext.Provider
      value={{ startTour, tourActive: run, tourElement }}
    >
      {children}
      <WelcomeModal
        open={welcomeOpen}
        name={welcomeName}
        submitted={visualShort}
        onStart={() => {
          setWelcomeOpen(false)
          startTour('visual')
        }}
        onSkip={() => setWelcomeOpen(false)}
      />
      {/* Standing ask until feedback lands — the vote is the whole point.
          Visibility re-evaluates on tour start/end and modal close, which
          covers every path that could reveal or retire the nudge. */}
      <FeedbackNudge
        visible={!run && !welcomeOpen && !hasSubmittedFeedback()}
        onClick={() => startTour('visual')}
      />
      <Joyride
        steps={
          tour === 'visual' && visualShort
            ? visualStepsShort
            : tourConfig[tour].steps
        }
        run={run}
        continuous
        onEvent={handleEvent}
        locale={joyrideLocale}
        options={joyrideOptions}
        styles={joyrideStyles}
      />
    </GuidedShowcaseContext.Provider>
  )
}

export function useGuidedShowcase() {
  const ctx = useContext(GuidedShowcaseContext)
  if (!ctx) {
    throw new Error('useGuidedShowcase must be used within GuidedShowcaseProvider')
  }
  return ctx
}
