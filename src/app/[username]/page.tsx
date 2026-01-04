import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/Logo"

interface Goal {
  id: string
  title: string
  goal_type: "one_time" | "progress"
  progress: number
  is_completed: boolean
  year: number
}

interface Props {
  params: Promise<{ username: string }>
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, created_at")
    .eq("username", username.toLowerCase())
    .single()

  if (!profile) {
    notFound()
  }

  const currentYear = new Date().getFullYear()
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", profile.id)
    .eq("year", currentYear)
    .order("created_at", { ascending: false })

  const userGoals: Goal[] = goals || []
  const completedGoals = userGoals.filter(g => g.is_completed).length
  const totalProgress = userGoals.length > 0 
    ? Math.round(userGoals.reduce((acc, g) => acc + g.progress, 0) / userGoals.length) 
    : 0

  return (
    <div className="min-h-screen bg-[#FFF8E7] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF6B6B]/20 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-[#4ECDC4]/20 rounded-lg rotate-12 animate-float" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-[#FFE66D]/30 rounded-full animate-float" style={{ animationDelay: '1.4s' }} />
        <div className="absolute top-10 right-10 text-4xl animate-float" style={{ animationDelay: '0.3s' }}>*</div>
        <div className="absolute bottom-20 left-1/4 text-3xl animate-float" style={{ animationDelay: '1s' }}>~</div>
      </div>

      <header className="relative border-b-3 border-[#1a1a2e] bg-[#FFFDF5]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <Link 
            href="/signup"
            className="retro-btn bg-[#4ECDC4] text-[#1a1a2e] px-5 py-2 rounded-lg font-bold text-sm border-2 border-[#1a1a2e]"
          >
            Join Goals
          </Link>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="mx-auto w-28 h-28 bg-[#FF6B6B] border-3 border-[#1a1a2e] rounded-2xl flex items-center justify-center mb-6 retro-shadow-lg rotate-3">
            <span className="text-5xl font-black text-white">
              {profile.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl font-black text-[#1a1a2e] mb-2">@{profile.username}</h1>
          <p className="text-[#1a1a2e]/70 font-medium">{currentYear} Goals Journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-6 text-center retro-shadow">
            <div className="text-4xl font-black text-[#1a1a2e] mb-1">{userGoals.length}</div>
            <div className="text-sm text-[#1a1a2e]/60 font-bold uppercase tracking-wider">Total Goals</div>
          </div>
          <div className="bg-[#4ECDC4] border-3 border-[#1a1a2e] rounded-xl p-6 text-center retro-shadow">
            <div className="text-4xl font-black text-[#1a1a2e] mb-1">{completedGoals}</div>
            <div className="text-sm text-[#1a1a2e]/60 font-bold uppercase tracking-wider">Completed</div>
          </div>
          <div className="bg-[#FFE66D] border-3 border-[#1a1a2e] rounded-xl p-6 text-center retro-shadow">
            <div className="text-4xl font-black text-[#1a1a2e] mb-1">{totalProgress}%</div>
            <div className="text-sm text-[#1a1a2e]/60 font-bold uppercase tracking-wider">Overall Progress</div>
          </div>
        </div>

        {userGoals.length === 0 ? (
          <div className="bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-12 text-center retro-shadow">
            <div className="mx-auto w-20 h-20 bg-[#FFE66D] border-3 border-[#1a1a2e] rounded-xl flex items-center justify-center mb-4 retro-shadow-sm">
              <span className="text-4xl">?</span>
            </div>
            <h3 className="text-2xl font-black text-[#1a1a2e] mb-2">No goals yet!</h3>
            <p className="text-[#1a1a2e]/70 font-medium">@{profile.username} hasn&apos;t added any goals for {currentYear}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-[#1a1a2e] mb-6">{currentYear} Goals</h2>
            {userGoals.map((goal) => (
              <div 
                key={goal.id} 
                className={`bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-6 retro-shadow transition-all ${goal.is_completed ? "opacity-75" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-[#1a1a2e] ${
                    goal.is_completed 
                      ? "bg-[#4ECDC4]" 
                      : "bg-[#FFFDF5]"
                  }`}>
                    {goal.is_completed && (
                      <span className="text-lg font-black">!</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-xl font-black text-[#1a1a2e] ${goal.is_completed ? "line-through opacity-60" : ""}`}>
                        {goal.title}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-lg font-bold border-2 border-[#1a1a2e] ${
                        goal.goal_type === "one_time" 
                          ? "bg-[#FFE66D]" 
                          : "bg-[#4ECDC4]"
                      }`}>
                        {goal.goal_type === "one_time" ? "One-time" : "Progress"}
                      </span>
                    </div>
                      {goal.goal_type === "progress" && (
                        <div className="space-y-3 mt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#4ECDC4]" />
                              <span className="text-[#1a1a2e] font-black uppercase text-[10px] tracking-wider">Progress Status</span>
                            </div>
                            <div className="bg-[#1a1a2e] text-white px-2 py-0.5 rounded text-xs font-black">
                              {goal.progress}%
                            </div>
                          </div>
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-4 flex rounded-lg border-2 border-[#1a1a2e] bg-[#FFF8E7]">
                              <div 
                                style={{ width: `${goal.progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#FF6B6B] via-[#FFE66D] to-[#4ECDC4] transition-all duration-500 ease-out border-r-2 border-[#1a1a2e]"
                              />
                            </div>
                            <div className="flex justify-between mt-1 px-0.5">
                              <span className="text-[8px] font-black text-[#1a1a2e]/30">0%</span>
                              <span className="text-[8px] font-black text-[#1a1a2e]/30">100%</span>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="bg-[#95E1D3] border-3 border-[#1a1a2e] rounded-2xl p-8 retro-shadow-lg">
            <p className="text-[#1a1a2e] font-bold mb-4 text-lg">Want to track your own goals?</p>
            <Link 
              href="/signup"
              className="inline-block retro-btn bg-[#1a1a2e] text-[#FFFDF5] px-8 py-3 rounded-lg font-bold text-lg border-2 border-[#1a1a2e]"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative border-t-3 border-[#1a1a2e] bg-[#FFFDF5] mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-[#1a1a2e]/70 font-medium text-center">
            Created with love by <a href="https://x.com/MazenALDamshity" target="_blank" rel="noopener noreferrer" className="text-[#FF6B6B] hover:underline font-bold">Mazen ALDamshity</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
