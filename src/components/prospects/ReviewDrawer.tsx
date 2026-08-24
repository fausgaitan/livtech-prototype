import { useEffect } from 'react'
import {
  X,
  Download,
  PenLine,
  CircleCheck,
  Clock,
  FileText,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { prospect } from '@/lib/prospects-data'
import avatarErin from '@/assets/avatar-erin.png'

type ReviewDrawerProps = {
  open: boolean
  onClose: () => void
}

/** Demo content — category scores for the Level of Care review. */
const categoryScores = [
  { label: 'Activities of Daily Living', score: 9, max: 12 },
  { label: 'Mobility & Transfers', score: 7, max: 10 },
  { label: 'Cognition & Memory', score: 8, max: 10 },
  { label: 'Medication Management', score: 6, max: 10 },
  { label: 'Behavioral Health', score: 5, max: 8 },
  { label: 'Nutrition & Dining', score: 7, max: 10 },
]

const totalScore = categoryScores.reduce((sum, c) => sum + c.score, 0)
const maxScore = categoryScores.reduce((sum, c) => sum + c.max, 0)

const timeline = [
  { label: 'Evaluation created', date: 'Oct 10, 2026', done: true },
  { label: 'Submitted by Erin Ziebart', date: 'Oct 12, 2026', done: true },
  { label: 'Finalized & locked', date: 'Oct 14, 2026', done: true },
  { label: 'Pending family signature', date: '—', done: false },
]

export function ReviewDrawer({ open, onClose }: ReviewDrawerProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        id="review-drawer"
        className="absolute top-0 right-0 flex h-full w-full max-w-[440px] flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-black/5 px-6 py-5">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Evaluation Review
            </p>
            <div className="mt-1 flex items-center gap-2.5">
              <h2 className="text-base font-semibold text-black">
                Level of Care Evaluation
              </h2>
              <span className="rounded-md bg-[#f4f4f4] px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Finalized
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {prospect.name} · Completed Oct 14, 2026
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
          {/* Result summary */}
          <div className="rounded-xl bg-[#f5f3ff] p-5">
            <p className="text-xs font-medium text-[#452986]/70">
              Recommended Care Level
            </p>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-xl font-semibold text-[#452986]">
                Level 3 — Enhanced
              </p>
              <p className="text-sm font-medium text-[#452986]">
                {totalScore}{' '}
                <span className="font-normal text-[#452986]/60">
                  / {maxScore} points
                </span>
              </p>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#452986]/10">
              <div
                className="h-full rounded-full bg-[#6e33ea]"
                style={{ width: `${(totalScore / maxScore) * 100}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#452986]/80">
              Resident meets criteria for Assisted Living placement with
              enhanced medication support and twice-daily mobility assistance.
            </p>
          </div>

          {/* Category breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-black">Category Scores</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {categoryScores.map((cat) => (
                <li key={cat.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{cat.label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {cat.score}/{cat.max}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#f4f4f4]">
                    <div
                      className="h-full rounded-full bg-[#6e33ea]/70"
                      style={{ width: `${(cat.score / cat.max) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Assessor */}
          <div>
            <h3 className="text-sm font-semibold text-black">Completed By</h3>
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-border p-3">
              <img
                src={avatarErin}
                alt="Erin Ziebart"
                className="size-9 rounded-full object-cover"
              />
              <div className="flex-1 leading-tight">
                <p className="text-sm font-medium text-black">Erin Ziebart</p>
                <p className="text-xs text-muted-foreground">Charge Nurse</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-md bg-[#d7fce3] px-2 py-0.5 text-xs font-medium text-[#0f484a]">
                <CircleCheck className="size-3.5" />
                Signed
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-black">History</h3>
            <ul className="mt-3 flex flex-col">
              {timeline.map((step, i) => (
                <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
                  {/* connector */}
                  {i < timeline.length - 1 && (
                    <span className="absolute top-5 left-[7px] h-[calc(100%-16px)] w-px bg-border" />
                  )}
                  <span
                    className={cn(
                      'mt-0.5 flex size-[15px] shrink-0 items-center justify-center rounded-full',
                      step.done
                        ? 'bg-[#6e33ea] text-white'
                        : 'border border-border bg-white text-muted-foreground',
                    )}
                  >
                    {step.done ? (
                      <CircleCheck className="size-3" />
                    ) : (
                      <Clock className="size-2.5" />
                    )}
                  </span>
                  <div className="flex-1 leading-tight">
                    <p
                      className={cn(
                        'text-sm',
                        step.done ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Source document */}
          <button className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted">
            <span className="flex size-9 items-center justify-center rounded-md bg-[#f5f3ff]">
              <FileText className="size-4 text-[#452986]" />
            </span>
            <span className="flex-1 leading-tight">
              <span className="block text-sm font-medium text-black">
                Level-of-Care-Evaluation.pdf
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                12 pages · 1.4 MB
              </span>
            </span>
            <Download className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-end gap-3 border-t border-black/5 bg-[#fafafa] px-6 py-4">
          <Button variant="outline" size="lg" className="text-sm" onClick={onClose}>
            <Download className="size-4 text-muted-foreground" />
            Download PDF
          </Button>
          <Button
            size="lg"
            className="bg-[#452986] text-sm text-white hover:bg-[#452986]/90"
            onClick={onClose}
          >
            <PenLine className="size-4" />
            Approve & Sign
          </Button>
        </div>
      </div>
    </div>
  )
}
