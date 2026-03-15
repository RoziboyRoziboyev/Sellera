import Link from "next/link";
import { ArrowRight, BarChart3, Globe, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-neutral-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-600">Sellera.uz</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-neutral-500 hover:text-emerald-600 transition-colors">Xususiyatlar</Link>
            <Link href="#about" className="text-sm font-medium text-neutral-500 hover:text-emerald-600 transition-colors">Biz haqimizda</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-neutral-600 hover:text-emerald-600 transition-colors">Kirish</Link>
            <Link href="/login" className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">
              Boshlash
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              O'zbekistondagi №1 Savdo Platformasi
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">
              Savdolaringizni <span className="text-emerald-600">Sellera.uz</span> orqali avtomatlashtiring
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-neutral-500 md:text-xl">
              Hamkorlik platformasi orqali mahsulotlaringizni minglab sotuvchilarga ulashing va savdo hajmini 10 barobargacha oshiring. Barchasi bir joyda.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login" className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 text-lg font-bold text-white shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all sm:w-auto">
                Hoziroq ro'yxatdan o'tish
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#features" className="flex h-14 w-full items-center justify-center rounded-full border border-neutral-200 px-8 text-lg font-bold hover:bg-neutral-50 transition-all sm:w-auto">
                Platforma haqida
              </Link>
            </div>
          </div>

          {/* Background shapes */}
          <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-50/50 blur-3xl opacity-50"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-neutral-50 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold md:text-4xl text-neutral-900">Nima uchun Aynan Sellera?</h2>
              <p className="mt-4 text-neutral-500">Platformamiz savdo ekotizimini to'liq qamrab oladi.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Dinamik Voronkalar",
                  desc: "Mijozlar uchun bir necha daqiqada tayyor savdo sahifalarini (funnels) yarating va ulashing.",
                  icon: Globe,
                },
                {
                  title: "Aniq Statistika",
                  desc: "Har bir hamkor va har bir buyurtmani real vaqt rejimida kuzatib boring.",
                  icon: BarChart3,
                },
                {
                  title: "Xavfsiz To'lovlar",
                  desc: "Manual chek tekshirish va balansni avtomatlashtirilgan to'ldirish tizimi.",
                  icon: ShieldCheck,
                }
              ].map((f, i) => (
                <div key={i} className="group rounded-3xl bg-white p-8 border border-neutral-100 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-600/5">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <f.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="leading-relaxed text-neutral-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-emerald-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold tracking-tight text-neutral-900">Sellera.uz</span>
            </div>
            <p className="text-sm text-neutral-400">
              © 2026 Sellera.uz — Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-sm font-medium text-neutral-500 hover:text-emerald-600 transition-colors">Yordam</Link>
              <Link href="/login" className="text-sm font-medium text-neutral-500 hover:text-emerald-600 transition-colors">Qoidalar</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
