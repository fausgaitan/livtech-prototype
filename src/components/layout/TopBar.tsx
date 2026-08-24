import { useState } from 'react'
import {
  Building,
  ChevronDown,
  Search,
  Bell,
  Inbox,
  Sun,
  LayoutGrid,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useVariant } from '@/lib/variant'
import { useGuidedShowcase } from '@/components/prototype/GuidedShowcase'
import avatar from '@/assets/avatar-erin.png'
import eldermarkLogo from '@/assets/eldermark-logo.png'

const iconButtons = [
  { icon: Bell, dot: true },
  { icon: Inbox, dot: true },
  { icon: Sun, dot: false },
  { icon: LayoutGrid, dot: false },
]

export function TopBar() {
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const { isGradient, isMinimal } = useVariant()
  const { tourElement } = useGuidedShowcase()
  const light = isGradient || isMinimal
  // The guided tour force-opens the switcher to present it as a whole.
  const switcherVisible = switcherOpen || tourElement === 'switcher'

  return (
    <header
      className={cn(
        'flex h-[67px] shrink-0 items-center',
        isGradient
          ? 'gap-3 bg-transparent text-black'
          : isMinimal
            ? 'gap-4 bg-white pr-4 text-black'
            : 'gap-4 bg-[#27115a] pr-4 text-white',
      )}
    >
      {/* Product suite switcher */}
      <div className={cn('relative shrink-0', isGradient && 'order-2 ml-auto')}>
        <button
          id="product-switcher"
          onClick={() => setSwitcherOpen((o) => !o)}
          className={cn(
            'flex h-9 w-[140px] items-center gap-2 px-3 text-sm shadow-xs transition-colors',
            isGradient
              ? 'rounded-full bg-white text-black/80 hover:bg-white/70'
              : isMinimal
                ? 'rounded-md border border-[#d6dee8] bg-white text-black hover:bg-black/5'
                : 'rounded-md border border-black/10 bg-white/10 hover:bg-white/15',
          )}
        >
          {/* Eldermark orange mark — left glyph cropped from the wordmark asset */}
          <span className="relative h-[14px] w-[12.25px] shrink-0 overflow-hidden">
            <img
              src={eldermarkLogo}
              alt=""
              className="absolute top-0 left-0 h-full w-auto max-w-none"
            />
          </span>
          <span className="flex-1 truncate text-left">Eldermark</span>
          <ChevronDown
            className={cn(
              'size-4 shrink-0 opacity-80 transition-transform duration-200',
              switcherVisible && 'rotate-180',
            )}
          />
        </button>

        {switcherVisible && (
          <>
            {/* click-away catcher */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setSwitcherOpen(false)}
            />
            <div
              id="product-switcher-panel"
              className={cn(
                'absolute top-full left-0 z-50 mt-2 w-[300px] rounded-xl border p-3 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150',
                isGradient
                  ? 'rounded-[20px] border-[1.5px] border-white bg-white/90 text-black backdrop-blur-sm'
                  : isMinimal
                    ? 'border-black/5 bg-white text-black'
                    : 'border-white/10 bg-[#27115a] text-white',
              )}
            >
              <div className="grid grid-cols-3 gap-1">
                {/* Eldermark — the selected product */}
                <button
                  onClick={() => setSwitcherOpen(false)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 transition-colors',
                    isGradient
                      ? 'rounded-2xl bg-[#e8f3fe]'
                      : isMinimal
                        ? 'rounded-lg bg-[#eee8f4]'
                        : 'rounded-lg bg-white/20',
                  )}
                >
                  {/* Actual Eldermark mark, natural shape — not circle-cropped */}
                  <span className="relative h-10 w-[35px] overflow-hidden">
                    <img
                      src={eldermarkLogo}
                      alt="Eldermark"
                      className="absolute top-0 left-0 h-full w-auto max-w-none"
                    />
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      light ? 'text-black' : 'text-white',
                    )}
                  >
                    Eldermark
                  </span>
                </button>

                {/* Placeholder products */}
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setSwitcherOpen(false)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 transition-colors',
                      isGradient
                        ? 'rounded-2xl hover:bg-black/5'
                        : isMinimal
                          ? 'rounded-lg hover:bg-black/5'
                          : 'rounded-lg hover:bg-white/10',
                    )}
                  >
                    <span
                      className={cn(
                        'size-10 rounded-full border',
                        light
                          ? 'border-black/5 bg-black/5'
                          : 'border-white/10 bg-white/10',
                      )}
                    />
                    <span
                      className={cn(
                        'text-xs',
                        light ? 'text-black/70' : 'text-white/70',
                      )}
                    >
                      Product
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Org select */}
      <button
        className={cn(
          'flex h-9 shrink-0 items-center gap-2 px-3 text-sm shadow-xs transition-colors',
          isGradient
            ? 'order-3 w-[181px] rounded-full bg-white text-black/80 hover:bg-white/70'
            : isMinimal
              ? 'w-[229px] rounded-md border border-[#d6dee8] bg-white text-black hover:bg-black/5'
              : 'w-[229px] rounded-md bg-white/10 hover:bg-white/15',
        )}
      >
        <Building className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left">Oakwood Manor</span>
        <ChevronDown className="size-4 shrink-0 opacity-80" />
      </button>

      {/* Search */}
      <div
        className={cn(
          'flex h-9 items-center gap-1.5 px-3 shadow-xs',
          isGradient
            ? 'order-1 w-[331px] rounded-full bg-white'
            : isMinimal
              ? 'w-full max-w-[317px] rounded-md border border-[#d6dee8] bg-white'
              : 'w-full max-w-[317px] rounded-md bg-white/10',
        )}
      >
        <Search className="size-4 shrink-0 opacity-80" />
        <input
          type="text"
          placeholder="Search residents, meds, incidents..."
          className={cn(
            'w-full bg-transparent text-sm focus:outline-none',
            light
              ? 'text-black placeholder:text-black/50'
              : 'text-white placeholder:text-white/50',
          )}
        />
      </div>

      {/* Right cluster */}
      <div
        className={cn('flex items-center gap-3', isGradient ? 'order-4' : 'ml-auto')}
      >
        <div className="flex items-center gap-1.5">
          {iconButtons.map(({ icon: Icon, dot }, i) => (
            <button
              key={i}
              className={cn(
                'relative flex size-8 items-center justify-center transition-colors',
                isGradient
                  ? 'rounded-full bg-white shadow-xs hover:bg-white/70'
                  : isMinimal
                    ? 'rounded-md hover:bg-black/5'
                    : 'rounded-md hover:bg-white/10',
              )}
            >
              <Icon className="size-3.5" />
              {dot && (
                <span className="absolute top-1.5 right-1.5 size-[5px] rounded-full bg-[#f97316]" />
              )}
            </button>
          ))}
        </div>

        <div
          className={cn('h-[18px] w-px', light ? 'bg-black/20' : 'bg-white/20')}
        />

        <div className="flex items-center gap-2">
          <img
            src={avatar}
            alt="Erin Ziebart"
            className="size-8 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm font-medium">Erin Ziebart</p>
            <p
              className={cn(
                'text-xs',
                light ? 'text-black/60' : 'text-white/60',
              )}
            >
              Charge Nurse
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
