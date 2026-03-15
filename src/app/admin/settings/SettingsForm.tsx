'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { updateGlobalSettings } from './actions'
import { useState } from 'react'

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await updateGlobalSettings(formData)
        setLoading(false)
        
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Sozlamalar saqlandi!")
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="card_number">Karta raqami</Label>
                <Input id="card_number" name="card_number" defaultValue={initialSettings?.card_number || '8600 1234 5678 9012'} placeholder="0000 0000 0000 0000" />
            </div>
            <div className="space-y-2 mb-6">
                <Label htmlFor="receiver_name">Qabul qiluvchi ismi</Label>
                <Input id="receiver_name" name="receiver_name" defaultValue={initialSettings?.receiver_name || 'Sellera.uz Admin'} placeholder="Eshmat Toshmatov" />
            </div>

            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto px-8 mt-2">
                {loading ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
        </form>
    )
}
