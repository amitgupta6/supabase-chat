import { AppHeader } from "@/components/app-header"

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
