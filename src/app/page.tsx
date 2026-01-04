import Link from "next/link"
import { Button } from "@/components/ui/button"
import { YearProgress } from "@/components/YearProgress"
import { Logo } from "@/components/Logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFF8E7] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#FF6B6B] rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-16 h-16 bg-[#4ECDC4] rounded-lg rotate-12 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-[#FFE66D] rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-[#95E1D3] rounded-lg rotate-45 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/3 w-8 h-8 bg-[#DDA0DD] rounded-full animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="absolute top-20 right-1/4 text-6xl animate-float" style={{ animationDelay: '0.3s' }}>*</div>
        <div className="absolute bottom-1/3 left-20 text-4xl animate-float" style={{ animationDelay: '0.8s' }}>~</div>
        <div className="absolute top-1/2 right-10 text-5xl animate-float" style={{ animationDelay: '1.3s' }}>+</div>
      </div>

      <header className="relative border-b-3 border-[#1a1a2e] bg-[#FFFDF5]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="font-bold text-[#1a1a2e] hover:bg-[#FFE66D]">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="retro-btn bg-[#4ECDC4] text-[#1a1a2e] hover:bg-[#3dbdb5] rounded-lg px-6">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFE66D] text-[#1a1a2e] text-sm font-bold mb-8 border-2 border-[#1a1a2e] retro-shadow-sm">
            <span className="text-lg">*</span>
            <span>Your {new Date().getFullYear()} journey starts here!</span>
            <span className="text-lg">*</span>
          </div>
          
          <YearProgress />

          <h1 className="text-5xl md:text-7xl font-black text-[#1a1a2e] mb-6 leading-tight">
            Track your goals,<br />
            <span className="text-[#FF6B6B] relative inline-block">
              share your progress
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 2 100 2 150 6C200 10 250 4 298 8" stroke="#FFE66D" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          
          <p className="text-xl text-[#1a1a2e]/70 max-w-2xl mx-auto mb-10 font-medium">
            Set meaningful goals for the year, track your progress, and share your journey with a beautiful public profile page.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="retro-btn bg-[#FF6B6B] text-[#FFFDF5] hover:bg-[#ff5252] rounded-lg px-8 h-14 text-lg">
                Start tracking for free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="retro-btn bg-[#FFFDF5] text-[#1a1a2e] hover:bg-[#FFE66D] rounded-lg px-8 h-14 text-lg">
                Sign in
              </Button>
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-8 retro-shadow-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#1a1a2e] transition-all">
              <div className="w-16 h-16 bg-[#4ECDC4] border-3 border-[#1a1a2e] rounded-lg flex items-center justify-center mb-6 retro-shadow-sm rotate-3">
                <span className="text-3xl">!</span>
              </div>
              <h3 className="text-xl font-black text-[#1a1a2e] mb-3">Two Goal Types</h3>
              <p className="text-[#1a1a2e]/70 font-medium">
                Choose between one-time tasks you can check off, or progressive goals with 0-100% tracking for long-term achievements.
              </p>
            </div>

            <div className="bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-8 retro-shadow-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#1a1a2e] transition-all">
              <div className="w-16 h-16 bg-[#FFE66D] border-3 border-[#1a1a2e] rounded-lg flex items-center justify-center mb-6 retro-shadow-sm -rotate-3">
                <span className="text-3xl">^</span>
              </div>
              <h3 className="text-xl font-black text-[#1a1a2e] mb-3">Track Progress</h3>
              <p className="text-[#1a1a2e]/70 font-medium">
                Update your progress anytime with our intuitive slider. Watch your overall completion percentage grow as you achieve more.
              </p>
            </div>

            <div className="bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-8 retro-shadow-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#1a1a2e] transition-all">
              <div className="w-16 h-16 bg-[#FF6B6B] border-3 border-[#1a1a2e] rounded-lg flex items-center justify-center mb-6 retro-shadow-sm rotate-6">
                <span className="text-3xl text-white">@</span>
              </div>
              <h3 className="text-xl font-black text-[#1a1a2e] mb-3">Share Publicly</h3>
              <p className="text-[#1a1a2e]/70 font-medium">
                Get your own public profile page at goals.qzz.io/username. Share your aspirations and inspire others on their journey.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-[#95E1D3] border-3 border-[#1a1a2e] rounded-2xl p-12 retro-shadow-lg">
            <h2 className="text-4xl font-black text-[#1a1a2e] mb-6">
              Ready to achieve more in {new Date().getFullYear()}?
            </h2>
            <p className="text-lg text-[#1a1a2e]/80 mb-8 font-medium">
              Join goal-setters who are turning their aspirations into achievements.
            </p>
            <Link href="/signup">
              <Button size="lg" className="retro-btn bg-[#1a1a2e] text-[#FFFDF5] hover:bg-[#2a2a4e] rounded-lg px-10 h-14 text-lg">
                Create your free account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative border-t-3 border-[#1a1a2e] bg-[#FFFDF5]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-[#1a1a2e]/70 font-medium">
              Created with love by <a href="https://x.com/MazenALDamshity" target="_blank" rel="noopener noreferrer" className="text-[#FF6B6B] hover:underline font-bold">Mazen ALDamshity</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
