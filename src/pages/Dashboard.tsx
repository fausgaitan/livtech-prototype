import { useState } from 'react'
import { ChevronRight, ChevronLeft, CalendarMinus2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useVariant } from '@/lib/variant'
import { dashboardTabs } from '@/lib/dashboard-data'
import { ActivityMixCard } from '@/components/dashboard/ActivityMixCard'
import { TotalActivitiesCard } from '@/components/dashboard/TotalActivitiesCard'
import { LeadSourceCard } from '@/components/dashboard/LeadSourceCard'

function DateStepper({ className }: { className?: string }) {
  return (
    <button
      className={cn(
        'flex h-9 items-center gap-2 px-4 text-sm font-medium shadow-xs transition-colors',
        className,
      )}
    >
      <ChevronLeft className="size-4" />
      <CalendarMinus2 className="size-4" />
      <span>October 2026</span>
      <ChevronRight className="size-4" />
    </button>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(dashboardTabs[0].label)
  const { isGradient, isMinimal } = useVariant()

  const tabs = (
    <>
      {dashboardTabs.map((tab) => {
        const isActive = tab.label === activeTab
        return (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors',
              isGradient
                ? cn(
                    'h-9 rounded-full px-4',
                    isActive
                      ? 'bg-[#e8f3fe] text-black'
                      : 'text-foreground hover:bg-black/5',
                  )
                : isMinimal
                  ? cn(
                      // Segmented control: equal-width segments
                      'h-8 flex-1 justify-center rounded-[6px] px-4',
                      isActive
                        ? 'border border-black/10 bg-white font-normal text-[#6831dc] shadow-xs'
                        : 'font-normal text-foreground hover:bg-white/60',
                    )
                  : cn(
                      'h-9 rounded-t-md px-4',
                      isActive
                        ? 'border-b-[1.5px] border-[#6e33ea] bg-white text-black'
                        : 'bg-[#f4f4f4] text-foreground hover:bg-[#efefef]',
                    ),
            )}
          >
            <tab.icon
              className={cn(
                'size-4',
                isActive &&
                  (isGradient
                    ? 'text-[#411a84]'
                    : isMinimal
                      ? 'text-[#6831dc]'
                      : 'text-[#6e33ea]'),
              )}
            />
            {tab.label}
          </button>
        )
      })}
    </>
  )

  return (
    <div className="flex w-full flex-col gap-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2.5 text-sm">
          <span className="text-muted-foreground">CRM</span>
          <ChevronRight className="size-[15px] text-muted-foreground" />
          <span className="text-foreground">Dashboard</span>
        </nav>

        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-black">Dashboard</h1>
          {!isGradient && (
            <DateStepper
              className={cn(
                isMinimal
                  ? 'rounded-full border border-[#d6dee8] bg-white text-black/70 hover:bg-black/5'
                  : 'rounded-md bg-[#f5f5f5] text-foreground hover:bg-[#ececec]',
              )}
            />
          )}
        </div>

        {isGradient ? (
          /* ---------- Option C: floating pill tab row + separate cards ---------- */
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-full border-[1.5px] border-white bg-white/80 p-2.5 shadow-xs backdrop-blur-sm">
              {tabs}
              <DateStepper className="ml-auto rounded-full bg-white text-black/60 hover:bg-white/70" />
            </div>

            <div id="dashboard-charts" className="grid grid-cols-1 gap-3 lg:grid-cols-[1.15fr_1fr]">
              <div className="rounded-[20px] bg-white shadow-xs">
                <ActivityMixCard />
              </div>
              <div className="rounded-[20px] bg-white shadow-xs">
                <TotalActivitiesCard />
              </div>
            </div>
            <div className="rounded-[16px] border-[1.5px] border-white bg-white shadow-xs">
              <LeadSourceCard />
            </div>
          </div>
        ) : isMinimal ? (
          /* ---------- Option B: segmented control + thin bordered cards ---------- */
          <div className="flex flex-col gap-4">
            <div className="flex h-10 w-full items-center gap-2 rounded-[8px] bg-[#f8f6ff] p-1 shadow-[inset_0_0_4px_rgba(0,0,0,0.05)]">
              {tabs}
            </div>

            <div id="dashboard-charts" className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
              <div className="rounded-[16px] border border-black/10 bg-white">
                <ActivityMixCard />
              </div>
              <div className="rounded-[16px] border border-black/10 bg-white">
                <TotalActivitiesCard />
              </div>
            </div>
            <div className="rounded-[16px] border border-black/10 bg-white">
              <LeadSourceCard />
            </div>
          </div>
        ) : (
          /* ---------- Option A: connected tabs + single divided card ---------- */
          <div className="flex flex-col">
            <div className="flex gap-2 border-b border-black/5">{tabs}</div>

            <div id="dashboard-charts" className="overflow-hidden rounded-lg rounded-tl-none bg-white shadow-xs">
              <div className="grid grid-cols-1 divide-y divide-black/5 lg:grid-cols-[1.15fr_1fr] lg:divide-x lg:divide-y-0">
                <ActivityMixCard />
                <TotalActivitiesCard />
              </div>
              <div className="border-t border-black/5">
                <LeadSourceCard />
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
