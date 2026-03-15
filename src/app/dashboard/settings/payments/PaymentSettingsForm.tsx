'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { savePaymentSettings } from './actions'

type IntegrationData = {
    click_merchant_id: string | null
    click_service_id: string | null
    click_secret_key: string | null
    payme_merchant_id: string | null
    uzum_nasiya_id: string | null
    alif_nasiya_token: string | null
}

export default function PaymentSettingsForm({ initialData }: { initialData: IntegrationData | null }) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const result = await savePaymentSettings(formData)
            if (result?.error) throw new Error(result.error)

            toast.success("Muvaffaqiyatli saqlandi!")
        } catch (error: any) {
            toast.error(error.message || "Xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Click Integratsiyasi</CardTitle>
                    <CardDescription>Click to'lov tizimini ulash uchun kerakli ma'lumotlar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="click_merchant_id">Merchant ID</Label>
                            <Input id="click_merchant_id" name="click_merchant_id" defaultValue={initialData?.click_merchant_id || ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="click_service_id">Service ID</Label>
                            <Input id="click_service_id" name="click_service_id" defaultValue={initialData?.click_service_id || ''} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="click_secret_key">Secret Key</Label>
                            <Input id="click_secret_key" name="click_secret_key" defaultValue={initialData?.click_secret_key || ''} type="password" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle>Payme Integratsiyasi</CardTitle>
                    <CardDescription>Payme to'lov tizimini ulash uchun kerakli ma'lumotlar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="payme_merchant_id">Merchant ID (Secret Key)</Label>
                        <Input id="payme_merchant_id" name="payme_merchant_id" defaultValue={initialData?.payme_merchant_id || ''} type="password" />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-neutral-200">
                    <CardHeader>
                        <CardTitle>Uzum Nasiya</CardTitle>
                        <CardDescription>Muddatli to'lov integratsiyasi</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="uzum_nasiya_id">Application ID</Label>
                            <Input id="uzum_nasiya_id" name="uzum_nasiya_id" defaultValue={initialData?.uzum_nasiya_id || ''} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200">
                    <CardHeader>
                        <CardTitle>Alif Nasiya</CardTitle>
                        <CardDescription>Muddatli to'lov integratsiyasi</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="alif_nasiya_token">Token / ID</Label>
                            <Input id="alif_nasiya_token" name="alif_nasiya_token" defaultValue={initialData?.alif_nasiya_token || ''} type="password" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto px-8">
                    {loading ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
            </div>
        </form>
    )
}
