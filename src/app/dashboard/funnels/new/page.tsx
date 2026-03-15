import CreateFunnelForm from './CreateFunnelForm'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function NewFunnelPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Yangi Voronka yaratish</h1>
            <CreateFunnelForm userId={user.id} />
        </div>
    )
}
