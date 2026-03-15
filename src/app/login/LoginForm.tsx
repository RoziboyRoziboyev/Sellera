'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function LoginForm() {
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<'login' | 'signup'>('login')

    async function handleSubmit(formData: FormData) {
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
                <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    className="focus-visible:ring-emerald-500" 
                />
            </div>

            <div className="flex flex-col space-y-2 pt-4">
                <Button 
                    type="submit" 
                    disabled={loading}
                    onClick={() => setMode('login')}
                    className="bg-emerald-600 hover:bg-emerald-700 font-medium"
                >
                    {loading && mode === 'login' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Tizimga kirish
                </Button>
                
                <Button 
                    type="submit" 
                    variant="outline"
                    disabled={loading}
                    onClick={() => setMode('signup')}
                    className="text-neutral-600 hover:text-neutral-900 font-medium"
                >
                    {loading && mode === 'signup' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Hisob yaratish
                </Button>
            </div>
        </form>
    )
}
