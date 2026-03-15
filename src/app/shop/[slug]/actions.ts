'use server'

import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'

async function hash(str: string) {
    return crypto.createHash('sha256').update(str.toLowerCase().trim()).digest('hex')
}

export async function captureLead(productId: string, name: string, phone: string, sourceId?: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.from('orders').insert({
        product_id: productId,
        customer_name: name,
        customer_phone: phone,
        status: 'lead',
        source_id: sourceId || null
    }).select().single()

    if (error) {
        console.error("Lead Error:", error)
        return { error: error.message }
    }

    try {
        const { data: pData } = await supabase
            .from('products')
            .select('name, pixel_fb_id, user_id, profiles!inner(telegram_chat_id)')
            .eq('id', productId)
            .single()

        // 1. Telegram
        const chatId = (pData?.profiles as any)?.[0]?.telegram_chat_id || (pData?.profiles as any)?.telegram_chat_id
        if (chatId) {
            const msg = `🔥 <b>Yangi lid!</b>\n👤 Ism: ${name}\n📞 Tel: ${phone}\n📦 Mahsulot: ${pData?.name}`
            const { sendTelegramMessage } = await import('@/utils/telegram')
            await sendTelegramMessage(chatId, msg)
        }

        // 2. Facebook CAPI
        if (pData?.pixel_fb_id && pData?.user_id) {
            const { data: integration } = await supabase
                .from('seller_integrations')
                .select('fb_access_token')
                .eq('user_id', pData.user_id)
                .single()

            if (integration?.fb_access_token) {
                const { sendFbCapiEvent } = await import('@/utils/capi')
                await sendFbCapiEvent(
                    pData.pixel_fb_id,
                    integration.fb_access_token,
                    'Lead',
                    {},
                    { ph: await hash(phone), fn: await hash(name) }
                )
            }
        }
    } catch (e) {
        console.error("Notifications/Tracking error:", e)
    }

    return { data }
}

export async function finalizeOrder(orderId: string, region: string, paymentMethod: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.from('orders').update({
        address_region: region,
        payment_method: paymentMethod,
        status: 'pending'
    }).eq('id', orderId).select().single()

    if (error) {
        console.error("Finalize Error:", error)
        return { error: error.message }
    }

    return { data }
}
