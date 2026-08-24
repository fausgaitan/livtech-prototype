import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

import { cn } from '@/lib/utils'
import { useVariant } from '@/lib/variant'
import { Badge } from '@/components/ui/badge'
import {
  totalActivitiesTrend,
  totalActivities,
  chartColors,
  gradientAreaColor,
  minimalAreaColor,
} from '@/lib/dashboard-data'

export function TotalActivitiesCard() {
  const { isGradient, isMinimal } = useVariant()
  const lineColor = isGradient
    ? gradientAreaColor
    : isMinimal
      ? minimalAreaColor
      : chartColors.email

  return (
    <section className="flex flex-col p-6">
      <div className="flex items-start justify-between">
        <h2 className="text-sm font-semibold text-black">Total Activities</h2>
        <Badge
          className={cn(
            'border-transparent',
            isGradient
              ? 'rounded-full bg-[#bedcf9] text-[#0e457e]'
              : 'bg-green-100 text-green-700',
          )}
        >
          {totalActivities.goalPercent}
        </Badge>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-black">
          {totalActivities.logged}
        </span>
        <span className="text-xs text-muted-foreground">logged</span>
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground">
          Goal: {totalActivities.goal}
        </span>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        Across calls, emails, tours and visits
      </p>

      {/* Area chart */}
      <div className="relative mt-4 h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={totalActivitiesTrend}
            margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
          >
            <defs>
              <linearGradient id="totalActivitiesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#00000010" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#73737399' }}
              ticks={['Oct 25', 'Oct 26']}
              interval="preserveStartEnd"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              fill="url(#totalActivitiesFill)"
              dot={false}
              isAnimationActive
              animationBegin={200}
              animationDuration={1100}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* The gradient variant omits the delta per the Figma */}
      {!isGradient && (
        <p
          className={cn(
            'mt-2 text-xs',
            isMinimal ? 'text-center text-[#4e1ead]' : 'text-right text-green-700',
          )}
        >
          {totalActivities.delta}
        </p>
      )}
    </section>
  )
}
