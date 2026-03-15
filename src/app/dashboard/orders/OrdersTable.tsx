'use client'

import { useState } from 'react'
import { updateOrderStatus } from './actions'
import { toast } from 'sonner'
import { Phone, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function OrdersTable({ orders }: { orders: any[] }) {
    const [filter, setFilter] = useState('all')

    const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter)

    const handleStatusChange = async (id: string, status: string) => {
        toast.promise(updateOrderStatus(id, status), {
            loading: "Yangilanmoqda...",
            success: "Buyurtma statusi o'zgardi!",
            error: "Xatolik yuz berdi"
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['all', 'lead', 'pending', 'paid', 'cancelled'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                    >
                        {f === 'all' ? 'Barchasi' : f === 'lead' ? 'Yangi Lidlar' : f === 'pending' ? 'Kutilmoqda' : f === 'paid' ? 'Sotildi' : 'Bekor Qilindi'}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-neutral-500 bg-neutral-50 uppercase border-b border-neutral-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Mijoz / Mahsulot</th>
                                <th className="px-6 py-4 font-semibold">Telefon</th>
                                <th className="px-6 py-4 font-semibold">Sana</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Hech qanday buyurtma topilmadi</td>
                                </tr>
                            )}
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-neutral-900">{order.customer_name}</div>
                                        <div className="text-xs text-neutral-500 mt-1">{order.products?.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={`tel:${order.customer_phone}`} className="inline-flex items-center gap-1.5 text-emerald-600 font-medium hover:underline bg-emerald-50 px-3 py-1.5 rounded-lg">
                                            <Phone className="w-3.5 h-3.5" /> {order.customer_phone}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500 text-xs">
                                        {new Date(order.created_at).toLocaleString('uz-UZ')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                      ${order.status === 'lead' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {order.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                                            {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                            {(order.status === 'lead' || order.status === 'pending') && <Clock className="w-3 h-3" />}
                                            {order.status === 'lead' ? 'Yangi' : order.status === 'pending' ? 'Kutilmoqda' : order.status === 'paid' ? 'Sotildi' : 'Bekor'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {order.status !== 'paid' && (
                                                <button onClick={() => handleStatusChange(order.id, 'paid')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200" title="Sotildi">
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            {order.status !== 'cancelled' && (
                                                <button onClick={() => handleStatusChange(order.id, 'cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200" title="Bekor qilish">
                                                    <XCircle className="w-4 h-4" />
                                                </button>
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
