import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import OrdersTable from './OrdersTable'

export default async function OrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: orders } = await supabase
        .from('orders')
        .select('*, products!inner(name, user_id)')
        .eq('products.user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Buyurtmalar Jurnali</h1>
                <p className="text-neutral-500 mt-1">Barcha lid va buyurtmalarni shu yerdan boshqaring.</p>
            </div>
            <OrdersTable orders={orders || []} />
        </div>
    )
}
