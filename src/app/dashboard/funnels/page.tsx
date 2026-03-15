import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { submitForModeration } from './actions'

export default async function FunnelsPage() {
    const supabase = await createClient()
    const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Sizning Voronkalaringiz</h1>
                <Link href="/dashboard/funnels/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <PlusCircle className="mr-2 w-4 h-4" /> Voronka Yaratish
                    </Button>
                </Link>
            </div>

            {(!products || products.length === 0) ? (
                <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <PlusCircle className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">Hozircha voronkalar yo'q</h3>
                    <p className="text-neutral-500 max-w-sm mb-6">Yangi voronka yaratish orqali mijozlarni qabul qilishni boshlang.</p>
                    <Link href="/dashboard/funnels/new">
                        <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                            Birinchi voronkani yaratish
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <div key={p.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                            {p.image_url ? (
                                <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover" />
                            ) : (
                                <div className="w-full h-40 bg-neutral-100 flex items-center justify-center text-neutral-400">Rasm yo'q</div>
                            )}
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                                <p className="text-sm text-neutral-500 mb-3 truncate">
                                    <a href={`/shop/${p.slug}`} target="_blank" rel="noreferrer" className="hover:text-emerald-600 hover:underline">/shop/{p.slug}</a>
                                </p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-semibold text-emerald-600">{Number(p.price).toLocaleString()} UZS</span>
                                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-semibold ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                            p.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                        }`}>{p.status === 'approved' ? 'Tasdiqlangan' : p.status === 'rejected' ? 'Rad etilgan' : p.status === 'pending' ? 'Kutilmoqda' : p.status}</span>
                                </div>

                                <form action={async () => { await submitForModeration(p.id) }}>
                                    <Button type="submit" variant="outline" size="sm" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50" disabled={p.status === 'approved' || p.status === 'pending'}>
                                        {p.status === 'approved' ? "Marketplaceda" : p.status === 'pending' ? "Kutilmoqda" : "Marketplacega chiqarish"}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
