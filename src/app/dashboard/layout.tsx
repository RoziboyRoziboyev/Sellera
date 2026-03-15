import { Ghost } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-neutral-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-neutral-200">
                    <span className="text-xl font-bold text-emerald-600 flex items-center gap-2">
                        <Ghost className="w-6 h-6" /> Sellera.uz
                    </span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <a href="/dashboard" className="block px-3 py-2 rounded-md bg-emerald-50 text-emerald-600 font-medium">Asosiy sahifa</a>
                    <a href="/dashboard/funnels" className="block px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-medium">Voronkalar</a>
                    <a href="/dashboard/orders" className="block px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-medium">Buyurtmalar</a>
                    <a href="/dashboard/billing" className="block px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-medium">Balans</a>
                    <a href="/dashboard/settings" className="block px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 font-medium">Sozlamalar</a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input type="text" placeholder="Qidirish..." className="pl-9 pr-4 py-2 bg-neutral-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-64 transition-all" />
                            <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                            P
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
