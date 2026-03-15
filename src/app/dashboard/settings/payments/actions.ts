'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function savePaymentSettings(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const payload = {
        user_id: user.id,
        click_merchant_id: formData.get('click_merchant_id') as string,
        click_service_id: formData.get('click_service_id') as string,
        click_secret_key: formData.get('click_secret_key') as string,
        payme_merchant_id: formData.get('payme_merchant_id') as string,
        uzum_nasiya_id: formData.get('uzum_nasiya_id') as string,
        alif_nasiya_token: formData.get('alif_nasiya_token') as string,
    }

    const { error } = await supabase
        .from('seller_integrations')
        .upsert(payload, { onConflict: 'user_id' })

    if (error) {
        console.error(error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/settings/payments')
    return { success: true }
}
