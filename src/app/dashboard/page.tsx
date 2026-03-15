import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { period } = await (searchParams as any) || {}
    const activePeriod = period || '30'
    const dateFilter = new Date()
    dateFilter.setDate(dateFilter.getDate() - parseInt(activePeriod))

    // Fetch Total Views
    const { data: products } = await supabase
        .from('products')
        .select('views')
        .eq('user_id', user.id)

    const totalViews = products?.reduce((acc, p) => acc + (p.views || 0), 0) || 0

    // Fetch Total Leads
    const { count: totalLeads } = await supabase
        .from('orders')
        .select('*, products!inner(user_id)', { count: 'exact', head: true })
        .eq('products.user_id', user.id)
        .gte('created_at', dateFilter.toISOString())

    const leads = totalLeads || 0
    const conversionRate = totalViews > 0 ? ((leads / totalViews) * 100).toFixed(1) : '0.0'

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Overview</h1>

                <div className="bg-white border text-sm border-neutral-200 rounded-lg p-1 flex gap-1">
                    <Link href="/dashboard?period=1" className={`px-3 py-1.5 rounded-md ${activePeriod === '1' ? 'bg-neutral-100 font-medium text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>Bugun</Link>
                    <Link href="/dashboard?period=7" className={`px-3 py-1.5 rounded-md ${activePeriod === '7' ? 'bg-neutral-100 font-medium text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>7 kun</Link>
                    <Link href="/dashboard?period=30" className={`px-3 py-1.5 rounded-md ${activePeriod === '30' ? 'bg-neutral-100 font-medium text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>30 kun</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
                    <p className="text-sm font-medium text-neutral-500">Tashriflar (Views)</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">{totalViews}</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
                    <p className="text-sm font-medium text-neutral-500">Lidlar (Leads)</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">{leads}</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
                    <p className="text-sm font-medium text-neutral-500">Konversiya (CR)</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{conversionRate}%</p>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-bold text-neutral-900 mb-4">Tezkor havolalar</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/dashboard/funnels/new" className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow text-center">
                        <div className="text-emerald-600 font-medium">Yangi voronka yaratish</div>
                    </Link>
                    <Link href="/dashboard/billing" className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow text-center">
                        <div className="text-emerald-600 font-medium">Balansni to'ldirish</div>
                    </Link>
                    <Link href="/dashboard/settings/payments" className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow text-center">
                        <div className="text-emerald-600 font-medium">To'lov integratsiyasi</div>
                    </Link>
                    <Link href="/dashboard/orders" className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-md transition-shadow text-center">
                        <div className="text-emerald-600 font-medium">Barcha buyurtmalar</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
