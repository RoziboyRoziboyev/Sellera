'use server'

import { createClient } from '@/utils/supabase/server'
import { sendTelegramMessage } from '@/utils/telegram'
import { revalidatePath } from 'next/cache'

export async function submitPaymentProof(amount: number, receiptUrl: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // 1. Insert into history
    const { error } = await supabase.from('payments_history').insert({
        user_id: user.id,
        amount: amount,
        receipt_url: receiptUrl,
        status: 'pending'
    })

    if (error) {
        return { error: error.message }
    }

    // 2. Fetch User Email and Super Admin Chat ID
    const { data: profile } = await supabase.from('profiles').select('email').eq('id', user.id).single()

    // Hardcode or query for super admin. For true scalability: query role='super_admin'
    const { data: superAdmins } = await supabase.from('profiles')
        .select('telegram_chat_id')
        .eq('role', 'super_admin')
        .not('telegram_chat_id', 'is', null)
        .limit(1)

    const adminChatId = superAdmins?.[0]?.telegram_chat_id

    if (adminChatId) {
        const msg = `💰 <b>Yangi to'lov so'rovi!</b>\n👤 Hamkor: ${profile?.email || 'Noma\'lum'}\n💵 Miqdor: ${amount.toLocaleString()} UZS\n🔗 Chekni tekshirish: ${receiptUrl}`
        await sendTelegramMessage(adminChatId, msg)
    }

    revalidatePath('/dashboard/billing')
    return { success: true }
}
