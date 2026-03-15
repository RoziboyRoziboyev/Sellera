import { createClient } from '@/utils/supabase/server'

export async function sendFbCapiEvent(pixelId: string, accessToken: string, eventName: string, eventData: any, userData: any) {
    if (!pixelId || !accessToken) return false

    try {
        const payload = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "website",
                    user_data: userData,
                    custom_data: eventData,
                }
            ],
            access_token: accessToken
        }

        const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            console.error("CAPI API Error:", await res.text())
            return false
        }

        return true
    } catch (err) {
        console.error("CAPI Request failed:", err)
        return false
    }
}
