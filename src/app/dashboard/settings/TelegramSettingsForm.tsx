'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { updateTelegramId } from './actions'
import { useState } from 'react'

export default function TelegramSettingsForm({ initialValue }: { initialValue: string }) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await updateTelegramId(formData)
        setLoading(false)
        
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Muvaffaqiyatli saqlandi!")
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="telegram_chat_id">Sizning Chat ID raqamingiz</Label>
                <Input 
                    id="telegram_chat_id" 
                    name="telegram_chat_id" 
                    defaultValue={initialValue} 
                    placeholder="Masalan: 123456789" 
                />
            </div>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto px-8">
                {loading ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
        </form>
    )
}
