'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { submitPaymentProof } from './actions'
import { createClient } from '@/utils/supabase/client'
import { Copy, UploadCloud } from 'lucide-react'

export default function BillingForm({ userId, globalCard, globalName }: { userId: string, globalCard: string, globalName: string }) {
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const supabase = createClient()

    const handleCopyCard = () => {
        navigator.clipboard.writeText(globalCard || "8600 1234 5678 9012")
        toast.info("Karta raqami nusxalandi!")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return toast.error("Iltimos, chek rasmini yuklang.")

        setLoading(true)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${userId}_${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('receipts')
                .getPublicUrl(filePath)

            const result = await submitPaymentProof(Number(amount), publicUrl)

            if (result.error) throw new Error(result.error)

            toast.success("To'lov cheki yuborildi! Tasdiqlanishini kuting.")
            setAmount('')
            setFile(null)
        } catch (err: any) {
            toast.error(err.message || "Xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-neutral-200 shadow-sm h-fit">
                <CardHeader>
                    <CardTitle>Balansni To'ldirish</CardTitle>
                    <CardDescription>Pul tushirish uchun quyidagi karta raqamiga to'lov qiling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                        <div>
                            <p className="text-emerald-800 font-medium text-sm mb-1">{globalName || 'Sellera.uz Admin'}</p>
                            <p className="text-xl font-bold text-emerald-900 tracking-wider">{globalCard || '8600 1234 5678 9012'}</p>
                        </div>
                        <button onClick={handleCopyCard} className="p-2 hover:bg-emerald-100 rounded-lg transition-colors text-emerald-600">
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-sm text-neutral-500">
                        To'lov qilingandan so'ng, chekni rasmga olib o'ng tomondagi formaga yuklang. Balans tez orada tasdiqlanadi.
                    </p>
                </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Chekni yuklash</CardTitle>
                    <CardDescription>To'lov cheki va miqdorini tahrirlang</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">To'lov miqdori (UZS)</Label>
                            <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="Masalan: 500000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="receipt">Chek rasmi</Label>
                            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer relative">
                                <Input id="receipt" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <UploadCloud className="w-8 h-8 text-neutral-400 mb-2" />
                                <p className="text-sm text-neutral-600 font-medium">Bosing yoki rasmni bu yerga tashlang</p>
                                <p className="text-xs text-neutral-400 mt-1">{file ? file.name : "JPEG, PNG, JPG"}</p>
                            </div>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            {loading ? "Yuborilmoqda..." : "Tasdiqlashga yuborish"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
