'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function processPayment(paymentId: string, userId: string, amount: number, action: 'approve' | 'reject') {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (adminProfile?.role !== 'super_admin') return { error: 'Unauthorized' }

    // Start transaction logic via RPC or two consecutive queries. 
    // For simplicity, we update payments status and then update user balance.
    const { error: paymentError } = await supabase
        .from('payments_history')
        .update({ status: action === 'approve' ? 'approved' : 'rejected' })
        .eq('id', paymentId)

    if (paymentError) return { error: paymentError.message }

    if (action === 'approve') {
        // Fetch current balance
        const { data: profile } = await supabase.from('profiles').select('balance').eq('id', userId).single()
        const currentBalance = Number(profile?.balance || 0)

        // Increment balance
        const { error: balanceError } = await supabase
            .from('profiles')
            .update({ balance: currentBalance + amount })
            .eq('id', userId)

        if (balanceError) {
            // In a robust system, we would rollback here if balanceError.
            return { error: 'Payment marked approved but balance update failed: ' + balanceError.message }
        }
    }

    revalidatePath('/admin/payments')
    revalidatePath('/admin')
    return { success: true }
}
