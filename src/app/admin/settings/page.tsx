import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateGlobalSettings } from './actions'

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
                <form action={updateGlobalSettings} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="card_number">Karta raqami</Label>
                        <Input id="card_number" name="card_number" defaultValue={settings?.card_number || '8600 1234 5678 9012'} placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="space-y-2 mb-6">
                        <Label htmlFor="receiver_name">Qabul qiluvchi ismi</Label>
                        <Input id="receiver_name" name="receiver_name" defaultValue={settings?.receiver_name || 'Sellera.uz Admin'} placeholder="Eshmat Toshmatov" />
                    </div>

                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto px-8 mt-2">Saqlash</Button>
                </form>
            </div>
        </div>
    )
}
