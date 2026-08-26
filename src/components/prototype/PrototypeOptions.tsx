import { useEffect, useState } from 'react'
import {
  SlidersHorizontal,
  Compass,
  Check,
  MousePointerClick,
  RotateCcw,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useVariant, variantLabels, type VariantKey } from '@/lib/variant'
import {
  useGuidedShowcase,
  hasSubmittedFeedback,
  resetFeedback,
} from '@/components/prototype/GuidedShowcase'
import atomicLogo from '@/assets/atomic-health-logo.svg'

const variantKeys = Object.keys(variantLabels) as VariantKey[]

/**
 * Atomic Health prototype tooling — floating control in the bottom-right.
 * Branding: pale ice blue, near-black text, minimal. Distinct on purpose
 * from the Livtech product UI so clients read it as "prototype chrome".
 */
const atomic = {
  bg: '#eaf6fe',
  bgHover: '#dcefFC',
  border: '#cde8fa',
  text: '#0f1e2e',
}

export function PrototypeOptions() {
  const [open, setOpen] = useState(false)
  // Bumped after Reset Feedback so the panel re-reads the submitted state.
  const [, setResetTick] = useState(0)
  const { variant, setVariant } = useVariant()
  const { startTour, tourActive } = useGuidedShowcase()

  // Tours can start from outside this panel (feedback nudge, welcome modal).
  // Close the popover so it doesn't linger behind the tour tooltip.
  useEffect(() => {
    if (tourActive) setOpen(false)
  }, [tourActive])

  return (
    <div className="fixed right-5 bottom-5 z-40 flex flex-col items-end gap-2">
      {open && (
        <div
          className="w-[268px] rounded-xl border p-1.5 shadow-lg animate-in fade-in slide-in-from-bottom-1 duration-150"
          style={{ backgroundColor: atomic.bg, borderColor: atomic.border }}
        >
          {/* Variant options */}
          <div className="flex flex-col gap-0.5">
            {variantKeys.map((key) => {
              const isSelected = key === variant
              return (
                <button
                  key={key}
                  onClick={() => setVariant(key)}
                  className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-left text-sm transition-colors"
                  style={{
                    color: atomic.text,
                    backgroundColor: isSelected ? atomic.bgHover : undefined,
                    fontWeight: isSelected ? 500 : 400,
                  }}
                >
                  <span className="flex-1">{variantLabels[key]}</span>
                  {isSelected && <Check className="size-4 shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Straight divider — a border-t on the rounded button would curve */}
          <div
            className="my-1.5 border-t"
            style={{ borderColor: atomic.border }}
          />

          {/* Guided Showcase — visual directions walkthrough + feedback ask */}
          <button
            onClick={() => {
              setOpen(false)
              startTour('visual')
            }}
            className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm transition-colors"
            style={{ color: atomic.text }}
          >
            <Compass className="size-4" />
            <span className="flex-1">Take a Tour</span>
            {hasSubmittedFeedback() && (
              <span
                className="rounded-full border px-1.5 py-px text-[10px] font-medium"
                style={{ borderColor: atomic.border, color: `${atomic.text}99` }}
              >
                Submitted ✓
              </span>
            )}
          </button>

          {/* Deep dive — sidebar, switcher, modal, and drawer patterns */}
          <button
            onClick={() => {
              setOpen(false)
              startTour('ux')
            }}
            className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm transition-colors"
            style={{ color: atomic.text }}
          >
            <MousePointerClick className="size-4" />
            <span className="flex-1">See UX Details</span>
          </button>

          {/* Clears answers; the next submission creates a fresh record */}
          {hasSubmittedFeedback() && (
            <button
              onClick={() => {
                resetFeedback()
                setResetTick((n) => n + 1)
              }}
              className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm transition-colors"
              style={{ color: `${atomic.text}99` }}
            >
              <RotateCcw className="size-4" />
              <span className="flex-1">Reset Feedback</span>
              <span
                className="rounded-full border px-1.5 py-px text-[10px] font-medium"
                style={{ borderColor: atomic.border, color: `${atomic.text}99` }}
              >
                Testing only
              </span>
            </button>
          )}

          {/* Brand footer — logo recolored to brand navy, straight on the blue */}
          <div
            className="mt-1 flex items-center justify-end gap-1.5 border-t px-2.5 pt-2.5 pb-1"
            style={{ borderColor: atomic.border }}
          >
            <span className="text-xs" style={{ color: `${atomic.text}99` }}>
              by
            </span>
            <img src={atomicLogo} alt="Atomic Health" className="h-[22px] w-auto" />
          </div>
        </div>
      )}

      <button
        id="prototype-options"
        // Locked while the Guided Showcase is running — the tour drives
        // the theme itself and anchors its tooltips to this button.
        disabled={tourActive}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-md transition-colors',
          tourActive && 'pointer-events-none opacity-60',
        )}
        style={{
          backgroundColor: open ? atomic.bgHover : atomic.bg,
          borderColor: atomic.border,
          color: atomic.text,
        }}
      >
        <SlidersHorizontal className="size-3.5" />
        Prototype Options
      </button>
    </div>
  )
}
