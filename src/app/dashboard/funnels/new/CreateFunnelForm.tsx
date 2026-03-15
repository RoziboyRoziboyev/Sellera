'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Info } from 'lucide-react'
import { toast } from 'sonner'
import { saveFunnel } from './actions'

export default function CreateFunnelForm({ userId }: { userId: string }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [fbPixel, setFbPixel] = useState('')
    const [ttPixel, setTtPixel] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = ''

            if (file) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
                const filePath = `${userId}/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('product_images')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('product_images')
                    .getPublicUrl(filePath)

                imageUrl = publicUrl
            }

            const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`

            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('price', price)
            formData.append('pixel_fb_id', fbPixel)
            formData.append('pixel_tt_id', ttPixel)
            formData.append('image_url', imageUrl)
            formData.append('slug', uniqueSlug)

            const result = await saveFunnel(formData)
            if (result.error) throw new Error(result.error)

            toast.success("Muvaffaqiyatli saqlandi!")
            router.push('/dashboard/funnels')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 md:p-8 rounded-xl border border-neutral-200 shadow-sm">
            <div className="space-y-2">
                <Label htmlFor="name">Mahsulot nomi</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Masalan: Aqlli soat X1" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image" className="space-x-2">Mahsulot rasmi</Label>
                <Input id="image" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Narxi (UZS)</Label>
                <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="Masalan: 250000" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="fbPixel">Facebook Pixel ID</Label>
                        <div className="group relative flex items-center justify-center">
                            <Info className="w-4 h-4 text-neutral-400 cursor-help" />
                            <div className="hidden group-hover:block absolute bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded p-2 text-center z-10 shadow-lg">
                                Bu yerga Facebook Pixel ID-ingizni kiriting. Ushbu ID orqali reklamangiz natijadorligi kuzatiladi.
                            </div>
                        </div>
                    </div>
                    <Input id="fbPixel" value={fbPixel} onChange={e => setFbPixel(e.target.value)} placeholder="0000000000000000" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="ttPixel">TikTok Pixel ID</Label>
                        <div className="group relative flex items-center justify-center">
                            <Info className="w-4 h-4 text-neutral-400 cursor-help" />
                            <div className="hidden group-hover:block absolute bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded p-2 text-center z-10 shadow-lg">
                                Bu yerga TikTok Pixel ID-ingizni kiriting. Bu savdolarni kuzatish uchun juda muhim.
                            </div>
                        </div>
                    </div>
                    <Input id="ttPixel" value={ttPixel} onChange={e => setTtPixel(e.target.value)} placeholder="0000000000000000" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Mahsulot tavsifi</Label>
                <textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    className="flex min-h-[120px] w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Mahsulot haqida to'liq tavsif...">
                </textarea>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? "Saqlanmoqda..." : "Saqlash va Voronka yaratish"}
            </Button>
        </form>
    )
}
