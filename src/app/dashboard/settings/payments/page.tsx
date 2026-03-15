import PaymentSettingsForm from './PaymentSettingsForm'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PaymentsSettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: integrationData } = await supabase
        .from('seller_integrations')
        .select('*')
        .eq('user_id', user.id)
        .single()

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">To'lov Sozlamalari</h1>
                <p className="text-neutral-500 mt-1">Shaxsiy do'koningiz uchun to'lov tizimlarini ulang.</p>
            </div>

            <PaymentSettingsForm initialData={integrationData || null} />
        </div>
    )
}
