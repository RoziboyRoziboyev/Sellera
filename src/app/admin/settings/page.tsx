import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SettingsForm from './SettingsForm'

export default async function AdminSettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'super_admin') {
        redirect('/dashboard')
    }

    const { data: settings } = await supabase.from('platform_settings').select('*').eq('id', 1).single()

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Global Sozlamalar</h1>
                <p className="text-neutral-500 mt-1">Platforma bo'yicha umumiy sozlamalarni tahrirlash.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm max-w-xl">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Balans yig'ish rekvezitlari</h3>
                <SettingsForm initialSettings={settings} />
            </div>
        </div>
    )
}
