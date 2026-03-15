'use client'

import { useState } from 'react'
import { captureLead, finalizeOrder } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ShieldCheck, Truck, Clock } from 'lucide-react'

export default function FunnelClient({ product }: { product: any }) {
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('+998')
    const [region, setRegion] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('Cash')

    const [orderId, setOrderId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (product.pixel_fb_id) {
            console.log(`FB Pixel Lead fired to ${product.pixel_fb_id}`)
        }
        if (product.pixel_tt_id) {
            console.log(`TT Pixel Lead fired to ${product.pixel_tt_id}`)
        }

        const sourceId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('ref') || undefined : undefined

        const res = await captureLead(product.id, name, phone, sourceId)
        if (res.error) {
            toast.error(res.error)
            setLoading(false)
            return
        }

        setOrderId(res.data.id)
        setStep(2)
        setLoading(false)
    }

    const handleFinalize = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orderId) return
        setLoading(true)

        const res = await finalizeOrder(orderId, region, paymentMethod)
        if (res.error) {
            toast.error(res.error)
            setLoading(false)
            return
        }

        setStep(3)
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-neutral-100 flex justify-center pb-24 font-sans">
            <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden self-start sm:mt-12 sm:rounded-2xl">
                <div className="relative h-72 bg-neutral-200">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-neutral-400">No Image</div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-sm font-bold text-emerald-700">
                        Top Sotuv
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-6 text-center border-b border-neutral-100 pb-6">
                        <h1 className="text-2xl font-bold text-neutral-900 leading-tight">{product.name}</h1>
                        <p className="text-emerald-600 font-extrabold text-2xl mt-2 tracking-tight">{Number(product.price).toLocaleString()} UZS</p>
                    </div>

                    {step === 1 && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <p className="text-neutral-600 text-sm leading-relaxed mb-6 whitespace-pre-line text-center">{product.description}</p>

                            <form onSubmit={handleLeadSubmit} className="space-y-4">
                                <div className="bg-emerald-50 rounded-xl p-4 mb-2 border border-emerald-100/50 flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-emerald-900 text-sm mb-0.5">Maxsus Taklif!</h3>
                                        <p className="text-emerald-700 text-xs">Hozir buyurtma bering va chegirmaga ega bo'ling.</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-neutral-600 ml-1">Ismingiz</Label>
                                    <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Ali Valiyev" className="bg-neutral-50 h-12 rounded-xl" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-neutral-600 ml-1">Telefon raqamingiz</Label>
                                    <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="bg-neutral-50 h-12 rounded-xl font-medium tracking-wider" />
                                </div>

                                <Button type="submit" className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 rounded-xl mt-6 font-bold" disabled={loading}>
                                    {loading ? "Biroz kuting..." : "Buyurtma berish"}
                                </Button>

                                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-neutral-400 text-xs font-medium">
                                    <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> 100% xavfsiz</div>
                                    <div className="flex items-center gap-1.5"><Truck className="w-4 h-4" /> Tezkor yetkazish</div>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleFinalize} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">2</div>
                                <h2 className="text-lg font-bold text-neutral-900">Yetkazib berish va To'lov</h2>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="region" className="text-neutral-600 ml-1">Viloyat va tuman</Label>
                                <Input id="region" value={region} onChange={e => setRegion(e.target.value)} required placeholder="Sizning manzilingiz..." className="bg-neutral-50 h-12 rounded-xl" />
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label className="text-neutral-600 ml-1">To'lov usulini tanlang</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Cash', 'Click', 'Payme', 'Uzum Nasiya'].map(method => (
                                        <div
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={`border-2 p-3 rounded-xl cursor-pointer text-center text-sm font-bold transition-all flex items-center justify-center h-14 ${paymentMethod === method ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-neutral-100 text-neutral-600 bg-white hover:bg-neutral-50 hover:border-neutral-200'}`}
                                        >
                                            {method === 'Cash' ? 'Naqd pul' : method}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 rounded-xl mt-6 font-bold" disabled={loading}>
                                {loading ? "Biroz kuting..." : "Tasdiqlash"}
                            </Button>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-10 animate-in zoom-in-95 fill-mode-both duration-500">
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <ShieldCheck className="w-12 h-12" />
                            </div>
                            <h2 className="text-2xl font-black text-neutral-900 mb-3">Buyurtma qabul qilindi!</h2>
                            <p className="text-neutral-500 mb-8 max-w-[250px] mx-auto leading-relaxed">Tez orada operatorlarimiz siz bilan bog'lanishadi. Rahmat!</p>
                            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 shadow-sm inline-block">
                                <p className="text-sm text-neutral-600 font-medium">Buyurtma ID: <span className="text-neutral-900 font-bold">#{orderId?.split('-')[0]}</span></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
