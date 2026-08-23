import { useState, type ReactNode } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { MobileNav } from '../components/layout/MobileNav'

interface ResidentLayoutProps {
  children: ReactNode
}

export function ResidentLayout({
  children,
}: ResidentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-ivory-100)]">
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8">
            <div className="mx-auto w-full max-w-[1440px]">
              {children}
            </div>
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}