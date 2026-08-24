import { useEffect, useState } from 'react'
import { X, Search, Check, ChevronDown, CalendarDays } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { evaluationTypes, prospect } from '@/lib/prospects-data'

type AddEvaluationModalProps = {
  open: boolean
  onClose: () => void
}

export function AddEvaluationModal({ open, onClose }: AddEvaluationModalProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(evaluationTypes[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Escape closes the dropdown first, then the modal.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (dropdownOpen) {
        setDropdownOpen(false)
        setQuery('')
      } else {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, dropdownOpen, onClose])

  if (!open) return null

  const selectType = (type: string) => {
    setSelected(type)
    setDropdownOpen(false)
    setQuery('')
  }

  const filtered = evaluationTypes.filter((t) =>
    t.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      {/* No overflow-hidden here — the type dropdown panel must be able to
          extend past the card's bounds without getting clipped. */}
      <div
        id="add-evaluation-modal"
        className="relative flex w-full max-w-[520px] flex-col rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-black/5 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-black">
              Create a New Evaluation
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Choose an evaluation type for {prospect.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-5">
          {/* Type picker — closed dropdown; the panel overlays instead of
              resizing the modal while searching */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Evaluation Type
            </label>
            <div className="relative mt-1.5">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex h-9 w-full items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground shadow-xs transition-colors hover:bg-muted"
              >
                <span className="flex-1 truncate text-left">{selected}</span>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    dropdownOpen && 'rotate-180',
                  )}
                />
              </button>

              {dropdownOpen && (
                <>
                  {/* click-away catcher */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                      setDropdownOpen(false)
                      setQuery('')
                    }}
                  />
                  <div className="absolute top-full right-0 left-0 z-20 mt-1.5 overflow-hidden rounded-lg border border-border bg-white shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="flex items-center gap-2 border-b border-black/5 px-3">
                      <Search className="size-4 text-muted-foreground" />
                      <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search evaluation types..."
                        className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                    <ul className="max-h-[216px] overflow-y-auto p-1">
                      {filtered.length === 0 && (
                        <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                          No evaluation types match “{query}”
                        </li>
                      )}
                      {filtered.map((type) => {
                        const isSelected = type === selected
                        return (
                          <li key={type}>
                            <button
                              onClick={() => selectType(type)}
                              className={cn(
                                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                                isSelected
                                  ? 'bg-[#f5f3ff] font-medium text-[#452986]'
                                  : 'text-foreground hover:bg-muted',
                              )}
                            >
                              <span className="flex-1">{type}</span>
                              {isSelected && <Check className="size-4 shrink-0" />}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Details row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">
                Evaluation Date
              </label>
              <button className="mt-1.5 flex h-9 w-full items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground shadow-xs transition-colors hover:bg-muted">
                <CalendarDays className="size-4 text-muted-foreground" />
                <span className="flex-1 text-left">Oct 14, 2026</span>
              </button>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Assign To
              </label>
              <button className="mt-1.5 flex h-9 w-full items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground shadow-xs transition-colors hover:bg-muted">
                <span className="flex-1 text-left">Erin Ziebart</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-black/5 bg-[#fafafa] px-6 py-4">
          <Button variant="outline" size="lg" className="text-sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="lg"
            className="bg-[#452986] text-sm text-white hover:bg-[#452986]/90"
            onClick={onClose}
          >
            Create Evaluation
          </Button>
        </div>
      </div>
    </div>
  )
}
