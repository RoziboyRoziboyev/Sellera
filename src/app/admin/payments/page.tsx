import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PaymentsClient from './PaymentsClient'

export default async function AdminPaymentsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'super_admin') {
        redirect('/dashboard')
    }

    const { data: payments } = await supabase
        .from('payments_history')
        .select('*, profiles(email)')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">To'lovlar Tasdig'i</h1>
                <p className="text-neutral-500 mt-1">Hamkorlar yuklagan to'lov cheklarini tekshirish va tasdiqlash.</p>
            </div>
            <PaymentsClient payments={payments || []} />
        </div>
    )
}
