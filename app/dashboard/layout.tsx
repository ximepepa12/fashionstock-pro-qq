'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardTopbar } from '@/components/dashboard/topbar'
import { useMockStore } from '@/lib/mock-store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { session, sessionReady } = useMockStore()

  useEffect(() => {
    if (sessionReady && !session) router.replace('/sign-in')
  }, [sessionReady, session, router])

  if (!sessionReady || !session) {
    return (
      <main className="grid min-h-screen place-items-center bg-white">
        <Spinner className="size-6 text-[#4f46e5]" />
      </main>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#fbfbfe]">
      <DashboardSidebar rol={session.rol} />
      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar session={session} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
