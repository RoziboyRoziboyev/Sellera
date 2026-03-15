'use client'

import { useState } from 'react'
import { processPayment } from './actions'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PaymentsClient({ payments }: { payments: any[] }) {
    const [filter, setFilter] = useState('pending')
    const filteredPayments = payments.filter(p => filter === 'all' || p.status === filter)

    const handleProcess = async (id: string, userId: string, amount: number, action: 'approve' | 'reject') => {
        toast.promise(processPayment(id, userId, amount, action), {
            loading: "Jarayonda...",
            success: "To'lov holati yangilandi!",
            error: "Xatolik yuzaga keldi"
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
                                <th className="px-6 py-4 font-semibold">Foydalanuvchi</th>
                                <th className="px-6 py-4 font-semibold">Miqdor</th>
                                <th className="px-6 py-4 font-semibold">Chek Rasmi</th>
                                <th className="px-6 py-4 font-semibold">Holat</th>
                                <th className="px-6 py-4 font-semibold text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Hech qanday to'lov topilmadi</td>
                                </tr>
                            )}
                            {filteredPayments.map(payment => (
                                <tr key={payment.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                                    <td className="px-6 py-4 font-medium text-neutral-900">
                                        {payment.profiles?.email}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                        {Number(payment.amount).toLocaleString()} UZS
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={payment.receipt_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Chekni ko'rish</a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                                            ${payment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                payment.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {payment.status === 'pending' && <Clock className="w-3 h-3" />}
                                            {payment.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                                            {payment.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                            <span className="capitalize">{payment.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {payment.status !== 'approved' && (
                                                <Button size="sm" onClick={() => handleProcess(payment.id, payment.user_id, payment.amount, 'approve')} className="bg-emerald-600 hover:bg-emerald-700">Tasdiqlash</Button>
                                            )}
                                            {payment.status !== 'rejected' && (
                                                <Button size="sm" variant="outline" onClick={() => handleProcess(payment.id, payment.user_id, payment.amount, 'reject')} className="text-red-600 border-red-200 hover:bg-red-50">Rad etish</Button>
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
