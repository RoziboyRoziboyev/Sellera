import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Ghost } from 'lucide-react'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return (
        <div className="flex w-full h-screen items-center justify-center bg-neutral-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                        <Ghost className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900">Sellera.uz ga Xush Kelibsiz</h1>
                    <p className="text-neutral-500 mt-2 text-center text-sm">
                        Hisobingizga kiring yoki voronkalarni boshqarish uchun yangi hisob yarating.
                    </p>
                </div>

                <form className="flex flex-col space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email manzil</Label>
                        <Input id="email" name="email" type="email" placeholder="siz@example.com" required className="focus-visible:ring-emerald-500" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Parol</Label>
                        <Input id="password" name="password" type="password" required className="focus-visible:ring-emerald-500" />
                    </div>

                    {searchParams?.message && (
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center font-medium">
                            {searchParams.message}
                        </p>
                    )}

                    <div className="flex flex-col space-y-2 pt-4">
                        <Button formAction={login} className="bg-emerald-600 hover:bg-emerald-700 font-medium">
                            Tizimga kirish
                        </Button>
                        <Button formAction={signup} variant="outline" className="text-neutral-600 hover:text-neutral-900 font-medium">
                            Hisob yaratish
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
