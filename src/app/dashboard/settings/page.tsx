import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateTelegramId } from './actions'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('telegram_chat_id, email').eq('id', user.id).single()

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Platforma Sozlamalari</h1>
                <p className="text-neutral-500 mt-1">Hisob raqamingiz va xabarnomalar uchun sozlamalar.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200 mt-6 max-w-xl shadow-sm">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Telegram Bildirishnomalari</h3>
                <p className="text-sm text-neutral-500 mb-6">Savdolar va yangi lidlar haqida tezkor bildirishnomalar olish uchun botga ulanib, Chat ID ni kiriting.</p>

                <form action={updateTelegramId} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="telegram_chat_id">Sizning Chat ID raqamingiz</Label>
                        <Input id="telegram_chat_id" name="telegram_chat_id" defaultValue={profile?.telegram_chat_id || ''} placeholder="Masalan: 123456789" />
                    </div>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto px-8">Saqlash</Button>
                </form>
            </div>
        </div>
    )
}
