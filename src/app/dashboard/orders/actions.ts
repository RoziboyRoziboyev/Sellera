'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const supabase = await createClient()

    // Verify the order belongs to one of the user's products
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // We could rely purely on RLS, but explicit update is fine 
    // (RLS ensures they can only update their own orders)
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/orders')
    return { success: true }
}
