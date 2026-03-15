'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTelegramId(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const chatId = formData.get('telegram_chat_id') as string

    await supabase.from('profiles').update({ telegram_chat_id: chatId }).eq('id', user.id)

    revalidatePath('/dashboard/settings')
}
