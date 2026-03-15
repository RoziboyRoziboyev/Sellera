import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BillingForm from './BillingForm'

export default async function BillingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user.id).single()

    const { data: globalSettings } = await supabase.from('platform_settings').select('*').eq('id', 1).single()

    return (
        <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Billing va Balans</h1>
                    <p className="text-neutral-500 mt-1">Joriy balans va hisobni to'ldirish joyi.</p>
                </div>
                <div className="bg-emerald-600 px-6 py-4 rounded-xl text-white shadow-xl shadow-emerald-600/20">
                    <p className="text-sm text-emerald-100 font-medium">Joriy Balans</p>
                    <p className="text-2xl font-bold">{Number(profile?.balance || 0).toLocaleString()} UZS</p>
                </div>
            </div>

            <BillingForm
                userId={user.id}
                globalCard={globalSettings?.card_number || '8600 1234 5678 9012'}
                globalName={globalSettings?.receiver_name || 'Sellera.uz Admin'}
            />
        </div>
    )
}
