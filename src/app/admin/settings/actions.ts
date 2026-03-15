'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateGlobalSettings(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (adminProfile?.role !== 'super_admin') return { error: 'Unauthorized' }

    const cardNumber = formData.get('card_number') as string
    const receiverName = formData.get('receiver_name') as string

    const { error } = await supabase
        .from('platform_settings')
        .upsert({ id: 1, card_number: cardNumber, receiver_name: receiverName })

    if (error) return { error: error.message }

    revalidatePath('/admin/settings')
    revalidatePath('/dashboard/billing')
    return { success: true }
}
