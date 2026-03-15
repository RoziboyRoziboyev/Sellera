import { createClient } from '@/utils/supabase/server'

export default async function AdminPage() {
    const supabase = await createClient()

    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Foydalanuvchilar Boshqaruvi</h1>
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-neutral-500 bg-neutral-50 uppercase border-b border-neutral-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Tugilgan sana</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Rol</th>
                                <th className="px-6 py-4 font-semibold text-right">Balans</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map(user => (
                                <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                                    <td className="px-6 py-4 text-neutral-500">{new Date(user.created_at).toLocaleDateString('uz-UZ')}</td>
                                    <td className="px-6 py-4 font-medium">{user.email || 'Noma\'lum'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                                        {Number(user.balance).toLocaleString()} UZS
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
