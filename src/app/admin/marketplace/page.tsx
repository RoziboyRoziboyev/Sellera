import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import MarketplaceClient from './MarketplaceClient'

export default async function AdminMarketplacePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

    if (profile?.role !== 'super_admin') {
        redirect('/dashboard')
    }

    const { data: products } = await supabase
        .from('products')
        .select('*, profiles(email)')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Marketplace Management</h1>
                <p className="text-neutral-500 mt-1">Hamkorlar yuborgan mahsulotlarni ko'rib chiqish va tasdiqlash.</p>
            </div>

            <MarketplaceClient products={products || []} />
        </div>
    )
}
