import { ShieldCheck } from "lucide-react"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

    if (profile?.role !== 'super_admin') {
        redirect('/dashboard')
    }

    return (
        <div className="flex h-screen bg-neutral-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col text-slate-300">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="text-xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" /> Admin
                    </span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <a href="/admin" className="block px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white font-medium">Foydalanuvchilar</a>
                    <a href="/admin/payments" className="block px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white font-medium">To'lovlar tasdig'i</a>
                    <a href="/admin/marketplace" className="block px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white font-medium">Marketplace</a>
                    <a href="/admin/settings" className="block px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white font-medium">Sozlamalar</a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
                    <div className="text-xl font-semibold text-neutral-800">Super Admin Panel</div>
                    <div className="flex items-center gap-4">
                        <a href="/dashboard" className="text-sm font-medium text-emerald-600 hover:underline">Asosiy sahifa</a>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
                            SA
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
