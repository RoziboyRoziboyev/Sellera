'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(formData: FormData) {
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (mode === 'signup' && password !== confirmPassword) {
            return toast.error("Parollar mos kelmadi!")
        }

        setLoading(true)
        
        try {
            if (mode === 'login') {
                const result = await login(formData)
                if (result?.error) {
                    toast.error(result.error)
                }
            } else {
                const result = await signup(formData)
                if (result?.error) {
                    toast.error(result.error)
                } else if (result?.success) {
                    toast.success(result.success)
                    setMode('login')
                }
            }
        } catch (err) {
            toast.error("Xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex p-1 bg-neutral-100 rounded-xl">
                <button 
                    onClick={() => setMode('login')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login' ? 'bg-white shadow-sm text-emerald-600' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                    Kirish
                </button>
                <button 
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'signup' ? 'bg-white shadow-sm text-emerald-600' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                    Ro'yxatdan o'tish
                </button>
            </div>

            <form action={handleSubmit} className="flex flex-col space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email manzil</Label>
                    <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="siz@example.com" 
                        required 
                        className="focus-visible:ring-emerald-500" 
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Parol</Label>
                    <div className="relative">
                        <Input 
                            id="password" 
                            name="password" 
                            type={showPassword ? "text" : "password"} 
                            required 
                            className="focus-visible:ring-emerald-500 pr-10" 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {mode === 'signup' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <Label htmlFor="confirmPassword">Parolni tasdiqlang</Label>
                        <Input 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type={showPassword ? "text" : "password"} 
                            required 
                            className="focus-visible:ring-emerald-500" 
                        />
                    </div>
                )}

                <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold h-12 text-base shadow-lg shadow-emerald-200 mt-2"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                        mode === 'login' ? "Tizimga kirish" : "Hisob yaratish"
                    )}
                </Button>

                {mode === 'login' && (
                    <p className="text-center text-sm text-neutral-500 mt-4">
                        Hisobingiz yo'qmi?{" "}
                        <button type="button" onClick={() => setMode('signup')} className="text-emerald-600 font-semibold hover:underline">
                            Ro'yxatdan o'ting
                        </button>
                    </p>
                )}
            </form>
        </div>
    )
}
