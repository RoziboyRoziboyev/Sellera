import LoginForm from './LoginForm'
import { Ghost } from 'lucide-react'

export default function LoginPage() {
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

                <LoginForm />
            </div>
        </div>
    )
}
