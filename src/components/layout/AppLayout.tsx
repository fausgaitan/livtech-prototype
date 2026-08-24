import { useState, type ReactNode } from 'react'

import { useVariant } from '@/lib/variant'
import { AppSidebar } from './AppSidebar'
import { TopBar } from './TopBar'
import { PrototypeOptions } from '@/components/prototype/PrototypeOptions'

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { isGradient, isMinimal } = useVariant()

  if (isMinimal) {
    // Option B — Minimalistic: white shell, sidebar carries a subtle
    // purple gradient; cards use borders instead of surface contrast.
    return (
      <div id="app-shell" className="flex h-screen overflow-hidden bg-white">
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          {/* Inset content panel — same rounded-corner treatment as Option A
              so sidebar + topbar read as one continuous shell. */}
          <main className="flex-1 overflow-auto rounded-tl-lg border-t border-l border-black/5 bg-[#faf9fd] p-6">
            {children}
          </main>
        </div>
        <PrototypeOptions />
      </div>
    )
  }

  if (isGradient) {
    // Option C — Subtle Gradient: floating sidebar + transparent topbar
    // on a light blue → light purple gradient.
    return (
      <div
        id="app-shell"
        className="flex h-screen gap-6 overflow-hidden p-[18px]"
        style={{
          backgroundImage: 'linear-gradient(180deg, #e8f3fe 0%, #dbd2e9 100%)',
        }}
      >
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto pt-3">{children}</main>
        </div>
        <PrototypeOptions />
      </div>
    )
  }

  return (
    <div id="app-shell" className="flex h-screen overflow-hidden bg-[#3a197a]">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto rounded-tl-lg bg-[#ededed] p-6">
          {children}
        </main>
      </div>
      <PrototypeOptions />
    </div>
  )
}
