'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function moderateProduct(productId: string, status: 'approved' | 'rejected') {
    const supabase = await createClient()

    // Verify super admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'super_admin') return { error: 'Unauthorized' }

    const { error } = await supabase.from('products').update({ status }).eq('id', productId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/marketplace')
    return { success: true }
}
