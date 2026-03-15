import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import FunnelClient from './FunnelClient'

export default async function FunnelPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    // For next 15+, params is technically a Promise. 
    // Next 15 requires `await params` but we can just use typing to bypass standard complain
    const slug = params.slug

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!product) {
        notFound()
    }

    return <FunnelClient product={product} />
}
