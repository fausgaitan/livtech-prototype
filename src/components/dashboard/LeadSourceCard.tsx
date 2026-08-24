import { cn } from '@/lib/utils'
import { useVariant } from '@/lib/variant'
import { Button } from '@/components/ui/button'
import {
  leadSources,
  totalNewLeads,
  gradientLeadPalette,
} from '@/lib/dashboard-data'

export function LeadSourceCard() {
  const { isGradient, isMinimal } = useVariant()
  // B and C both use the reordered palette and pill segments; B is thinner.
  const segmentColor = (i: number) =>
    isGradient || isMinimal ? gradientLeadPalette[i] : leadSources[i].color

  return (
    <section className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-black">
            Where this months leads came from
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {totalNewLeads} new leads by referral source
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className={cn('text-xs', isGradient && 'rounded-full')}
        >
          View Breakdown
        </Button>
      </div>

      {/* Segmented bar */}
      <div
        className={cn(
          'mt-4 flex w-full gap-1.5 overflow-hidden',
          isGradient ? 'h-[10px]' : isMinimal ? 'h-[8px]' : 'h-[14px]',
        )}
      >
        {leadSources.map((source, i) => (
          <div
            key={`${source.label}-${i}`}
            className={cn(
              'h-full animate-in fade-in slide-in-from-left-8 fill-mode-both duration-700',
              isGradient || isMinimal ? 'rounded-full' : 'rounded',
            )}
            style={{
              backgroundColor: segmentColor(i),
              // flex-grow keeps segments proportional while always
              // filling the full row width (percents don't sum to 100).
              flex: `${source.percent} 1 0%`,
              animationDelay: `${150 + i * 90}ms`,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        {leadSources.map((source, i) => (
          <li key={`${source.label}-${i}`} className="flex items-center gap-2.5 text-sm">
            <span className="flex items-center gap-1.5">
              <span
                className="size-[9px] rounded-xs"
                style={{ backgroundColor: segmentColor(i) }}
              />
              <span className="text-foreground">{source.label}</span>
            </span>
            <span className="font-semibold tabular-nums text-foreground">
              {source.percent}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
