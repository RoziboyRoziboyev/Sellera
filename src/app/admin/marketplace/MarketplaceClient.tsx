'use client'

import { useState } from 'react'
import { moderateProduct } from './actions'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MarketplaceClient({ products }: { products: any[] }) {
    const [filter, setFilter] = useState('pending')

    const filteredProducts = products.filter(p => filter === 'all' || p.status === filter)

    const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
        toast.promise(moderateProduct(id, status), {
            loading: "Jarayonda...",
            success: "Muvaffaqiyatli saqlandi!",
            error: "Xatolik yuz berdi"
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 mb-4">
                {['all', 'pending', 'approved', 'rejected'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                    >
                        {f === 'pending' ? 'Kutilmoqda' : f === 'approved' ? 'Tasdiqlangan' : f === 'rejected' ? 'Rad etilgan' : 'Barchasi'}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-neutral-500 bg-neutral-50 uppercase border-b border-neutral-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Mahsulot / Email</th>
                                <th className="px-6 py-4 font-semibold">Narx / Views</th>
                                <th className="px-6 py-4 font-semibold">Holat</th>
                                <th className="px-6 py-4 font-semibold text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Hech qanday mahsulot topilmadi</td>
                                </tr>
                            )}
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt="img" className="w-10 h-10 rounded object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 bg-neutral-100 rounded"></div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-neutral-900">{product.name}</div>
                                                <div className="text-xs text-neutral-500 mt-0.5">{product.profiles?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-emerald-600">{Number(product.price).toLocaleString()} UZS</div>
                                        <div className="text-xs text-neutral-500 mt-1">{product.views} views</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                      ${product.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                product.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {product.status === 'pending' && <Clock className="w-3 h-3" />}
                                            {product.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                                            {product.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                            <span className="capitalize">{product.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {product.status !== 'approved' && (
                                                <Button size="sm" onClick={() => handleModerate(product.id, 'approved')} className="bg-emerald-600 hover:bg-emerald-700">Tasdiqlash</Button>
                                            )}
                                            {product.status !== 'rejected' && (
                                                <Button size="sm" variant="outline" onClick={() => handleModerate(product.id, 'rejected')} className="text-red-600 border-red-200 hover:bg-red-50">Rad etish</Button>
                                            )}
                                        </div>
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
