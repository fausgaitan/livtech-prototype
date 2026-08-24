import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

import { useVariant } from '@/lib/variant'
import {
  activityMix,
  totalTouchpoints,
  gradientDonutPalette,
} from '@/lib/dashboard-data'

export function ActivityMixCard() {
  const { isGradient, isMinimal } = useVariant()
  const sliceColor = (i: number) =>
    isGradient ? gradientDonutPalette[i] : activityMix[i].color
  // Option B: thin ring with rounded segment caps and dot legend markers.
  const thin = isMinimal

  return (
    <section className="p-6">
      <div className="flex items-start justify-between">
        <h2 className="text-sm font-semibold text-black">Activity Mix</h2>
        <p className="text-xs text-muted-foreground">
          {totalTouchpoints} touchpoints this month
        </p>
      </div>

      <div className="mt-4 flex items-center gap-10">
        {/* Donut */}
        <div className="relative size-[220px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activityMix}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={isGradient ? 94 : thin ? 98 : 86}
                outerRadius={106}
                paddingAngle={thin ? 4 : 2}
                cornerRadius={thin ? 6 : 0}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                isAnimationActive
                animationBegin={100}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {activityMix.map((slice, i) => (
                  <Cell key={slice.name} fill={sliceColor(i)} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[42px] font-semibold leading-none text-black">
              {totalTouchpoints}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">activities</span>
          </div>
        </div>

        {/* Legend */}
        <ul className="w-full max-w-[260px] space-y-3">
          {activityMix.map((slice, i) => (
            <li key={slice.name} className="flex items-center gap-3 text-sm">
              <span
                className={thin ? 'size-[9px] shrink-0 rounded-full' : 'size-[9px] shrink-0 rounded-xs'}
                style={{ backgroundColor: sliceColor(i) }}
              />
              <span className="flex-1 text-foreground">{slice.name}</span>
              <span className="w-6 text-right font-bold tabular-nums text-foreground">
                {slice.value}
              </span>
              <span className="w-10 text-right tabular-nums text-foreground">
                {slice.percent}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
