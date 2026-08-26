import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useVariant } from '@/lib/variant'
import { primaryNav, footerNav, type NavItem } from '@/lib/dashboard-data'
import logo from '@/assets/livtech-logo.svg'
import logoMark from '@/assets/livtech-mark.svg'
import logoColor from '@/assets/livtech-logo-color.png'
import logoMarkColor from '@/assets/livtech-mark-color.svg'

type AppSidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

/**
 * Styled hover tooltip for collapsed-rail icons that have no submenu flyout.
 * Portaled to <body> for the same reason as the flyout: Option C's
 * backdrop-blur makes the rail the containing block for fixed descendants.
 */
function RailTooltip({
  label,
  light,
  isGradient,
  children,
}: {
  label: string
  light: boolean
  isGradient: boolean
  children: React.ReactNode
}) {
  const [top, setTop] = useState<number | null>(null)

  return (
    <div
      className="flex w-full justify-center"
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setTop(rect.top + rect.height / 2)
      }}
      onMouseLeave={() => setTop(null)}
    >
      {children}
      {top !== null &&
        createPortal(
          <div
            className={cn(
              'pointer-events-none fixed z-50 -translate-y-1/2 pl-2',
              isGradient ? 'left-[74px]' : 'left-[56px]',
            )}
            style={{ top }}
          >
            <div
              className={cn(
                'rounded-md border px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shadow-md animate-in fade-in slide-in-from-left-1 duration-150',
                light
                  ? 'border-black/5 bg-white text-black'
                  : 'border-white/10 bg-[#27115a] text-white',
              )}
            >
              {label}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isGradient, isMinimal } = useVariant()
  // B and C are both light (dark text) shells with different surfaces.
  const light = isGradient || isMinimal
  const lightActiveBg = isGradient ? 'bg-[#e8f3fe]' : 'bg-[#eee8f4]'

  // The group matching the current route starts open.
  const routeGroup = primaryNav.find(
    (item) => item.basePath && pathname.startsWith(item.basePath),
  )
  const [openGroup, setOpenGroup] = useState<string | null>(
    routeGroup?.label ?? null,
  )

  // Keep the accordion synced when navigation happens outside the sidebar
  // (collapsed-rail flyouts, the guided tour, deep links).
  const routeGroupLabel = routeGroup?.label ?? null
  useEffect(() => {
    if (routeGroupLabel) setOpenGroup(routeGroupLabel)
  }, [routeGroupLabel])
  // Hover flyout for the collapsed rail: which group + its viewport y position.
  const [flyout, setFlyout] = useState<{ label: string; top: number } | null>(null)
  // Grace period so the pointer can travel from the icon to the popover
  // without the flyout closing mid-flight.
  const flyoutCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelFlyoutClose = () => {
    if (flyoutCloseTimer.current) {
      clearTimeout(flyoutCloseTimer.current)
      flyoutCloseTimer.current = null
    }
  }

  const openFlyout = (label: string, top: number) => {
    cancelFlyoutClose()
    setFlyout({ label, top })
  }

  const scheduleFlyoutClose = () => {
    cancelFlyoutClose()
    flyoutCloseTimer.current = setTimeout(() => setFlyout(null), 200)
  }

  const isGroupActive = (item: NavItem) =>
    Boolean(item.basePath && pathname.startsWith(item.basePath))

  const handleGroupClick = (item: NavItem) => {
    if (item.children) {
      setOpenGroup(openGroup === item.label ? null : item.label)
    }
    if (item.defaultPath && !pathname.startsWith(item.basePath ?? '')) {
      navigate(item.defaultPath)
      setOpenGroup(item.label)
    }
  }

  return (
    <aside
      id="app-sidebar"
      className={cn(
        'group/sidebar flex flex-col overflow-hidden shrink-0',
        'transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[56px]' : 'w-[232px]',
        isGradient
          ? cn(
              'h-full border-[1.5px] border-white bg-white/80 text-black shadow-xs backdrop-blur-sm',
              // Collapsed rail reads as a large vertical pill
              collapsed ? 'rounded-[28px]' : 'rounded-[20px]',
            )
          : isMinimal
            ? 'h-full bg-gradient-to-b from-white from-[29%] to-[#f4f1ff] text-black'
            : 'h-full bg-[#27115a] text-white',
      )}
    >
      {/* Persistent header — logos crossfade in place, never scale */}
      <div className="relative h-[70px] w-full shrink-0">
        <img
          src={light ? logoMarkColor : logoMark}
          alt=""
          aria-hidden={!collapsed}
          className={cn(
            'absolute top-1/2 left-[15px] h-[29px] w-[26px] max-w-none -translate-y-1/2',
            'transition-all duration-300 ease-in-out',
            collapsed ? 'opacity-100 delay-150' : 'opacity-0',
          )}
        />
        <img
          src={light ? logoColor : logo}
          alt="Livtech"
          className={cn(
            'absolute top-1/2 max-w-none -translate-y-1/2',
            light ? 'left-[16px] h-[33px] w-auto' : 'left-[24px] h-[29px] w-[156px]',
            'transition-all duration-300 ease-in-out',
            collapsed ? '-translate-x-2 opacity-0' : 'translate-x-0 opacity-100 delay-100',
          )}
        />
      </div>

      {collapsed ? (
        /* ---------- Collapsed rail ---------- */
        <div className="flex min-h-0 w-[56px] flex-1 flex-col items-center animate-in fade-in slide-in-from-left-2 duration-300">
          <nav className="flex flex-1 flex-col items-center gap-2.5 py-2">
            {primaryNav.map((item) => {
              const iconButton = (
                <button
                  onClick={() => item.defaultPath && navigate(item.defaultPath)}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-[10px] transition-colors',
                    isGroupActive(item)
                      ? light
                        ? lightActiveBg
                        : 'bg-[#5d4d83]'
                      : light
                        ? 'hover:bg-black/5'
                        : 'hover:bg-white/10',
                  )}
                >
                  <item.icon className="size-4 opacity-60" />
                </button>
              )

              // Leaf items get a tooltip; group items get the submenu flyout
              // (its header already names the group).
              if (!item.children) {
                return (
                  <RailTooltip
                    key={item.label}
                    label={item.label}
                    light={light}
                    isGradient={isGradient}
                  >
                    {iconButton}
                  </RailTooltip>
                )
              }

              return (
              <div
                key={item.label}
                className="flex w-full justify-center"
                onMouseEnter={(e) =>
                  openFlyout(item.label, e.currentTarget.getBoundingClientRect().top)
                }
                onMouseLeave={scheduleFlyoutClose}
              >
                {iconButton}

                {/* Submenu popover — portaled to <body>: inside the aside,
                    Option C's backdrop-blur makes the rail the containing
                    block for fixed descendants, clipping the flyout. */}
                {item.children &&
                  flyout?.label === item.label &&
                  createPortal(
                  <div
                    // 8px visible gap to the rail; never closer than 8px below
                    // the topbar (67px) so the top gap matches the left gap.
                    // Gradient layout pads the page by 18px, shifting the rail edge.
                    className={cn('fixed z-50 pl-2', isGradient ? 'left-[74px]' : 'left-[56px]')}
                    style={{ top: Math.max(75, flyout.top - 8) }}
                    onMouseEnter={cancelFlyoutClose}
                    onMouseLeave={scheduleFlyoutClose}
                  >
                    <div
                      className={cn(
                        'min-w-[176px] rounded-lg border p-1.5 shadow-xl animate-in fade-in slide-in-from-left-1 duration-150',
                        light
                          ? 'border-black/5 bg-white text-black'
                          : 'border-white/10 bg-[#27115a] text-white',
                      )}
                    >
                      <p
                        className={cn(
                          'px-2 py-1.5 text-xs font-medium',
                          light ? 'text-black/50' : 'text-white/50',
                        )}
                      >
                        {item.label}
                      </p>
                      <ul className="flex flex-col gap-0.5">
                        {item.children.map((child) => {
                          const childActive = Boolean(
                            child.path && pathname === child.path,
                          )
                          return (
                            <li key={child.label}>
                              <button
                                onClick={() => {
                                  if (child.path) {
                                    navigate(child.path)
                                    setFlyout(null)
                                  }
                                }}
                                className={cn(
                                  'flex h-7 w-full items-center rounded-md px-2 text-left text-sm transition-colors',
                                  childActive
                                    ? light
                                      ? cn(lightActiveBg, 'text-black')
                                      : 'bg-white/20 text-white'
                                    : light
                                      ? 'text-black/70 hover:bg-black/5 hover:text-black'
                                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                                )}
                              >
                                <span className="flex-1 truncate">{child.label}</span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>,
                  document.body,
                )}
              </div>
              )
            })}
          </nav>

          <div className="flex shrink-0 flex-col items-center gap-2.5 py-5">
            {/* Ever-present per client feedback — no hover reveal */}
            <RailTooltip label="Expand" light={light} isGradient={isGradient}>
              <button
                onClick={onToggle}
                className={cn(
                  'flex size-8 items-center justify-center rounded-[10px] transition-colors',
                  light ? 'hover:bg-black/5' : 'hover:bg-white/10',
                )}
              >
                <ChevronsRight className="size-4 opacity-60" />
              </button>
            </RailTooltip>
            {footerNav.map((item) => (
              <RailTooltip
                key={item.label}
                label={item.label}
                light={light}
                isGradient={isGradient}
              >
                <button
                  className={cn(
                    'flex size-8 items-center justify-center rounded-[10px] transition-colors',
                    light ? 'hover:bg-black/5' : 'hover:bg-white/10',
                  )}
                >
                  <item.icon className="size-4 opacity-60" />
                </button>
              </RailTooltip>
            ))}
          </div>
        </div>
      ) : (
        /* ---------- Expanded sidebar ---------- */
        <div className="flex min-h-0 w-[232px] flex-1 flex-col animate-in fade-in slide-in-from-left-2 duration-300">
          <nav className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
            <ul className="flex flex-col gap-1">
              {primaryNav.map((item) => {
                const isOpen = openGroup === item.label
                const groupActive = isGroupActive(item)
                return (
                  <li key={item.label} className="relative">
                    {/* Option C active indicator — purple bar at the sidebar edge */}
                    {isGradient && groupActive && (
                      <span className="absolute top-0 -left-2 h-8 w-1 rounded-r-[4px] bg-[#411a84]" />
                    )}
                    <button
                      onClick={() => handleGroupClick(item)}
                      className={cn(
                        'flex h-8 w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-colors',
                        groupActive
                          ? isGradient
                            ? 'font-medium text-black'
                            : isMinimal
                              ? 'bg-[#eee8f4] font-medium text-black'
                              : 'bg-white/25 font-medium'
                          : light
                            ? 'text-black/90 hover:bg-black/5'
                            : 'text-white/90 hover:bg-white/10',
                      )}
                    >
                      <item.icon className="size-4 shrink-0 opacity-60" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <ChevronRight
                        className={cn(
                          'size-4 shrink-0 transition-transform duration-200',
                          isOpen && 'rotate-90',
                        )}
                      />
                    </button>

                    {item.children && isOpen && (
                      <ul
                        className={cn(
                          'relative mt-1 ml-6 flex flex-col gap-1 pl-0 animate-in fade-in slide-in-from-top-1 duration-200',
                          !light && 'border-l border-white/15',
                          isMinimal && 'border-l border-black/10',
                        )}
                      >
                        {item.children.map((child) => {
                          const childActive = Boolean(
                            child.path && pathname === child.path,
                          )
                          return (
                            <li key={child.label}>
                              <button
                                onClick={() => child.path && navigate(child.path)}
                                className={cn(
                                  'flex h-7 w-full items-center px-2 text-left text-sm transition-colors',
                                  isGradient ? 'rounded-full px-3' : 'rounded-md',
                                  childActive
                                    ? isGradient
                                      ? 'bg-white font-medium text-black shadow-xs'
                                      : isMinimal
                                        ? 'bg-[#eee8f4] font-medium text-black'
                                        : 'bg-white/20 text-white'
                                    : light
                                      ? 'text-black/70 hover:bg-black/5 hover:text-black'
                                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                                )}
                              >
                                <span className="flex-1 truncate">{child.label}</span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 flex-col gap-1 p-2">
            {/* Ever-present per client feedback — no hover reveal */}
            <button
              onClick={onToggle}
              className={cn(
                'flex h-8 w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-colors',
                light
                  ? 'text-black/90 hover:bg-black/5'
                  : 'text-white/90 hover:bg-white/10',
              )}
            >
              <ChevronsLeft className="size-4 shrink-0 opacity-60" />
              <span className="flex-1 truncate">Collapse</span>
            </button>
            {footerNav.map((item) => (
              <button
                key={item.label}
                className={cn(
                  'flex h-8 w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-colors',
                  light
                    ? 'text-black/90 hover:bg-black/5'
                    : 'text-white/90 hover:bg-white/10',
                )}
              >
                <item.icon className="size-4 shrink-0 opacity-60" />
                <span className="flex-1 truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
