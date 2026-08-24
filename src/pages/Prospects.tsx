import { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowLeft,
  Bed,
  Eye,
  Ellipsis,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useVariant } from '@/lib/variant'
import { Button } from '@/components/ui/button'
import { AddEvaluationModal } from '@/components/prospects/AddEvaluationModal'
import { ReviewDrawer } from '@/components/prospects/ReviewDrawer'
import { useGuidedShowcase } from '@/components/prototype/GuidedShowcase'
import {
  prospect,
  profileTabs,
  profileSubNav,
  evaluationRows,
  statusStyles,
} from '@/lib/prospects-data'
import avatarRobert from '@/assets/avatar-robert.png'

const tableColumns = [
  'Date',
  'Name',
  'Contact by',
  'Status',
  'Contact Owner',
  'Referral Source',
  'Living Preference',
]

export default function Prospects() {
  const [activeTab, setActiveTab] = useState(profileTabs[0].label)
  const [activeSection, setActiveSection] = useState('Evaluations')
  const [showAddEvaluation, setShowAddEvaluation] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const { isGradient, isMinimal } = useVariant()
  const { tourElement } = useGuidedShowcase()

  return (
    <div className="flex w-full flex-col gap-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2.5 text-sm">
          <span className="text-muted-foreground">Clinical / EHR</span>
          <ChevronRight className="size-[15px] text-muted-foreground" />
          <span className="text-muted-foreground">Prospects</span>
          <ChevronRight className="size-[15px] text-muted-foreground" />
          <span className="text-foreground">{prospect.name}</span>
        </nav>

        {/* Profile header card */}
        <div
          className={cn(
            'flex items-center gap-5 bg-white p-5 shadow-xs',
            isGradient
              ? 'rounded-[20px] border-[1.5px] border-white'
              : isMinimal
                ? 'rounded-[16px] border border-black/10'
                : 'rounded-lg',
          )}
        >
          <img
            src={avatarRobert}
            alt={prospect.name}
            className="size-16 rounded-full border-2 border-[#eee8f4] object-cover"
          />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-semibold text-black">{prospect.name}</h1>
              <span
                className={cn(
                  'bg-[#eee8f4] px-2 py-0.5 text-xs font-medium text-[#452986]',
                  isGradient ? 'rounded-full' : 'rounded-md',
                )}
              >
                {prospect.badge}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{prospect.sex}</span>
              <span>•</span>
              <span>{prospect.age}</span>
              <span>•</span>
              <span>{prospect.dob}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Bed className="size-4" />
                {prospect.room}
              </span>
              <span>•</span>
              <span>
                Target Move-in:{' '}
                <span className="font-medium text-foreground">
                  {prospect.targetMoveIn}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Profile tabs + content (flush in A, floating pills in C) */}
        <div className={cn('flex flex-col', isGradient && 'gap-3', isMinimal && 'gap-4')}>
          <div
            className={cn(
              'flex gap-2 overflow-x-auto',
              isGradient
                ? 'items-center rounded-full border-[1.5px] border-white bg-white/80 p-2.5 shadow-xs backdrop-blur-sm'
                : isMinimal
                  ? 'h-10 items-center rounded-[8px] bg-[#f8f6ff] p-1 shadow-[inset_0_0_4px_rgba(0,0,0,0.05)]'
                  : 'border-b border-black/5',
            )}
          >
            {profileTabs.map((tab) => {
              const isActive = tab.label === activeTab
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium transition-colors',
                    isGradient
                      ? cn(
                          'h-9 shrink-0 rounded-full px-4',
                          isActive
                            ? 'bg-[#e8f3fe] text-black'
                            : 'text-foreground hover:bg-black/5',
                        )
                      : isMinimal
                        ? cn(
                            'h-8 flex-1 justify-center rounded-[6px] px-4',
                            isActive
                              ? 'border border-black/10 bg-white font-normal text-[#6831dc] shadow-xs'
                              : 'font-normal text-foreground hover:bg-white/60',
                          )
                        : cn(
                            'h-9 shrink-0 rounded-t-md px-4',
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
          </div>

          <div
            className={cn(
              'flex overflow-hidden bg-white shadow-xs',
              isGradient
                ? 'rounded-[20px] border-[1.5px] border-white'
                : isMinimal
                  ? 'rounded-[16px] border border-black/10'
                  : 'rounded-lg rounded-tl-none',
            )}
          >
            {/* Left section nav */}
            <aside className="w-[176px] shrink-0 border-r border-black/5 p-4">
              <ul className="flex flex-col gap-1">
                {profileSubNav.map((section) => (
                  <li key={section}>
                    <button
                      onClick={() => setActiveSection(section)}
                      className={cn(
                        'flex h-8 w-full items-center px-3 text-left text-sm transition-colors',
                        isGradient ? 'rounded-full' : 'rounded-md',
                        section === activeSection
                          ? 'bg-[#f4f4f4] font-medium text-black'
                          : 'text-foreground hover:bg-[#f9f9f9]',
                      )}
                    >
                      {section}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Main content */}
            <div className="flex min-w-0 flex-1 flex-col p-6">
              <button className="flex items-center gap-2 self-start text-sm font-medium text-foreground transition-colors hover:text-black">
                <ArrowLeft className="size-4" />
                All Evaluations
              </button>

              {/* Title row */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-semibold text-black">
                    Level of Care Evaluation
                  </h2>
                  <span
                    className={cn(
                      'bg-[#f4f4f4] px-2 py-0.5 text-xs font-medium text-muted-foreground',
                      isGradient ? 'rounded-full' : 'rounded-md',
                    )}
                  >
                    Finalized
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn('px-4 text-sm font-normal', isGradient && 'rounded-full')}
                  >
                    Service Plan
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn('px-4 text-sm', isGradient && 'rounded-full')}
                  >
                    Actions
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
                  <Button
                    id="add-evaluation"
                    variant="outline"
                    size="lg"
                    className={cn('px-4 text-sm', isGradient && 'rounded-full')}
                    onClick={() => setShowAddEvaluation(true)}
                  >
                    Add Evaluation
                  </Button>
                  <Button
                    id="review-evaluation"
                    size="lg"
                    className={cn(
                      'bg-[#452986] px-4 text-sm text-white hover:bg-[#452986]/90',
                      isGradient && 'rounded-full',
                    )}
                    onClick={() => setShowReview(true)}
                  >
                    <Eye className="size-4" />
                    Review
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-black/5 text-left text-muted-foreground">
                      {tableColumns.map((col) => (
                        <th key={col} className="h-11 px-3 font-normal first:pl-1">
                          {col}
                        </th>
                      ))}
                      <th className="h-11 w-14 px-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationRows.map((row, i) => (
                      <tr
                        key={`${row.date}-${row.name}-${i}`}
                        className="border-b border-black/5 transition-colors last:border-0 hover:bg-[#fafafa]"
                      >
                        <td className="h-[52px] px-3 pl-1 text-foreground">{row.date}</td>
                        <td className="px-3 text-foreground">{row.name}</td>
                        <td className="px-3 text-foreground">{row.contactBy}</td>
                        <td className="px-3">
                          <span
                            className={cn(
                              'px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                              isGradient ? 'rounded-full' : 'rounded-md',
                              statusStyles[row.status],
                            )}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-3 text-foreground">{row.contactOwner}</td>
                        <td className="px-3 text-foreground">{row.referralSource}</td>
                        <td className="px-3 text-foreground">{row.livingPreference}</td>
                        <td className="px-3">
                          <button
                            className={cn(
                              'flex size-8 items-center justify-center border border-border transition-colors hover:bg-muted',
                              isGradient ? 'rounded-full' : 'rounded-md',
                            )}
                          >
                            <Ellipsis className="size-4 rotate-90 text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer / pagination */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-black">
                  Showing 1 to X of X entries
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn('gap-1 text-sm', isGradient && 'rounded-full')}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  {['1', '2', '3'].map((page) => (
                    <button
                      key={page}
                      className={cn(
                        'flex size-8 items-center justify-center text-sm transition-colors',
                        isGradient ? 'rounded-full' : 'rounded-md',
                        page === '2'
                          ? 'border border-border font-medium text-black shadow-xs'
                          : 'text-foreground hover:bg-muted',
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <span className="px-1 text-sm text-muted-foreground">…</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn('gap-1 text-sm', isGradient && 'rounded-full')}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The guided tour force-opens these to present them as a whole */}
        <AddEvaluationModal
          open={showAddEvaluation || tourElement === 'modal'}
          onClose={() => setShowAddEvaluation(false)}
        />
        <ReviewDrawer
          open={showReview || tourElement === 'drawer'}
          onClose={() => setShowReview(false)}
        />
    </div>
  )
}
