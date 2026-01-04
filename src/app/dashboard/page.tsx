"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Logo } from "@/components/Logo"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

interface Goal {
  id: string
  title: string
  goal_type: "one_time" | "progress"
  progress: number
  is_completed: boolean
  year: number
}

interface Profile {
  username: string
  email: string
}

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalType, setNewGoalType] = useState<"one_time" | "progress">("one_time")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/login")
      return
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, email")
      .eq("id", user.id)
      .single()

    if (profileData) {
      setProfile(profileData)
    }

    const currentYear = new Date().getFullYear()
    const { data: goalsData } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("year", currentYear)
      .order("created_at", { ascending: false })

    if (goalsData) {
      setGoals(goalsData)
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const currentYear = new Date().getFullYear()
    
    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        title: newGoalTitle,
        goal_type: newGoalType,
        year: currentYear,
        progress: newGoalType === "one_time" ? 0 : 0,
        is_completed: false,
      })
      .select()
      .single()

    if (!error && data) {
      setGoals([data, ...goals])
      setNewGoalTitle("")
      setNewGoalType("one_time")
      setDialogOpen(false)
    }
  }

  const handleToggleComplete = async (goal: Goal) => {
    const newCompleted = !goal.is_completed
    const newProgress = goal.goal_type === "one_time" ? (newCompleted ? 100 : 0) : goal.progress

    const { error } = await supabase
      .from("goals")
      .update({ 
        is_completed: newCompleted,
        progress: newProgress,
        updated_at: new Date().toISOString()
      })
      .eq("id", goal.id)

    if (!error) {
      setGoals(goals.map(g => 
        g.id === goal.id 
          ? { ...g, is_completed: newCompleted, progress: newProgress }
          : g
      ))
    }
  }

  const handleUpdateProgress = async (goalId: string, newProgress: number) => {
    const { error } = await supabase
      .from("goals")
      .update({ 
        progress: newProgress,
        is_completed: newProgress >= 100,
        updated_at: new Date().toISOString()
      })
      .eq("id", goalId)

    if (!error) {
      setGoals(goals.map(g => 
        g.id === goalId 
          ? { ...g, progress: newProgress, is_completed: newProgress >= 100 }
          : g
      ))
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", goalId)

    if (!error) {
      setGoals(goals.filter(g => g.id !== goalId))
      setEditDialogOpen(false)
      setEditingGoal(null)
    }
  }

  const completedGoals = goals.filter(g => g.is_completed).length
  const totalProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) 
    : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8E7]">
        <div className="text-2xl font-black text-[#1a1a2e] animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-[#FFE66D]/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-[#4ECDC4]/30 rounded-lg rotate-12 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-[#FF6B6B]/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <header className="relative border-b-3 border-[#1a1a2e] bg-[#FFFDF5]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            {profile && (
              <Link 
                href={`/${profile.username}`}
                className="text-sm text-[#1a1a2e]/70 hover:text-[#FF6B6B] transition-colors font-bold"
              >
                View public profile
              </Link>
            )}
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="font-bold text-[#1a1a2e] hover:bg-[#FFE66D]"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#1a1a2e] mb-2">
            Welcome back{profile ? `, ${profile.username}` : ""}!
          </h1>
          <p className="text-[#1a1a2e]/70 font-medium">Track your {new Date().getFullYear()} goals and make progress every day.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-6 retro-shadow">
            <p className="text-sm font-bold text-[#1a1a2e]/60 uppercase tracking-wider mb-1">Total Goals</p>
            <div className="text-4xl font-black text-[#1a1a2e]">{goals.length}</div>
          </div>
          <div className="bg-[#4ECDC4] border-3 border-[#1a1a2e] rounded-xl p-6 retro-shadow">
            <p className="text-sm font-bold text-[#1a1a2e]/60 uppercase tracking-wider mb-1">Completed</p>
            <div className="text-4xl font-black text-[#1a1a2e]">{completedGoals}</div>
          </div>
          <div className="bg-[#FFE66D] border-3 border-[#1a1a2e] rounded-xl p-6 retro-shadow">
            <p className="text-sm font-bold text-[#1a1a2e]/60 uppercase tracking-wider mb-1">Overall Progress</p>
            <div className="text-4xl font-black text-[#1a1a2e]">{totalProgress}%</div>
            <div className="w-full h-3 bg-[#1a1a2e] rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-[#FF6B6B] rounded-full transition-all"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#1a1a2e]">Your Goals</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="retro-btn bg-[#FF6B6B] text-[#FFFDF5] hover:bg-[#ff5252] rounded-lg">
                <span className="mr-2 text-lg">+</span>
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl retro-shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-[#1a1a2e]">Add New Goal</DialogTitle>
                <DialogDescription className="text-[#1a1a2e]/70 font-medium">
                  Create a new goal for {new Date().getFullYear()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title" className="text-[#1a1a2e] font-bold">Goal Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g., Read 12 books"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="bg-[#FFF8E7] border-2 border-[#1a1a2e] focus:border-[#FF6B6B] focus:ring-0 rounded-lg h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-type" className="text-[#1a1a2e] font-bold">Goal Type</Label>
                  <Select value={newGoalType} onValueChange={(v: "one_time" | "progress") => setNewGoalType(v)}>
                    <SelectTrigger className="bg-[#FFF8E7] border-2 border-[#1a1a2e] focus:border-[#FF6B6B] focus:ring-0 rounded-lg h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#FFFDF5] border-2 border-[#1a1a2e] rounded-lg">
                      <SelectItem value="one_time">One-time Task</SelectItem>
                      <SelectItem value="progress">Cumulative Progress (0-100%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-[#1a1a2e]/60 font-medium">
                    {newGoalType === "one_time" 
                      ? "A single task that can be marked as complete"
                      : "A goal with gradual progress tracking (0-100%)"
                    }
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddGoal}
                  className="retro-btn bg-[#4ECDC4] text-[#1a1a2e] hover:bg-[#3dbdb5] rounded-lg"
                >
                  Add Goal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {goals.length === 0 ? (
          <div className="bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-12 text-center retro-shadow">
            <div className="mx-auto w-20 h-20 bg-[#FFE66D] border-3 border-[#1a1a2e] rounded-xl flex items-center justify-center mb-4 retro-shadow-sm">
              <span className="text-4xl">?</span>
            </div>
            <h3 className="text-2xl font-black text-[#1a1a2e] mb-2">No goals yet!</h3>
            <p className="text-[#1a1a2e]/70 font-medium mb-4">Start by adding your first goal for {new Date().getFullYear()}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {goals.map((goal) => (
              <div 
                key={goal.id} 
                className={`bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-6 retro-shadow transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#1a1a2e] ${goal.is_completed ? "opacity-75" : ""}`}
              >
                <div className="flex items-start gap-4">
                  {goal.goal_type === "one_time" ? (
                    <Checkbox
                      checked={goal.is_completed}
                      onCheckedChange={() => handleToggleComplete(goal)}
                      className="mt-1 w-6 h-6 border-2 border-[#1a1a2e] data-[state=checked]:bg-[#4ECDC4] data-[state=checked]:border-[#1a1a2e] rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 mt-0.5 bg-[#FF6B6B] border-2 border-[#1a1a2e] rounded-lg flex items-center justify-center retro-shadow-sm">
                      <span className="text-xs font-black text-white">{goal.progress}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-xl font-black text-[#1a1a2e] ${goal.is_completed ? "line-through opacity-60" : ""}`}>
                        {goal.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-lg font-bold border-2 border-[#1a1a2e] ${
                          goal.goal_type === "one_time" 
                            ? "bg-[#FFE66D]" 
                            : "bg-[#4ECDC4]"
                        }`}>
                          {goal.goal_type === "one_time" ? "One-time" : "Progress"}
                        </span>
                        <Dialog open={editDialogOpen && editingGoal?.id === goal.id} onOpenChange={(open) => {
                          setEditDialogOpen(open)
                          if (!open) setEditingGoal(null)
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingGoal(goal)}
                              className="text-[#1a1a2e] hover:bg-[#FFE66D] font-bold"
                            >
                              ...
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl retro-shadow-lg">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-black text-[#1a1a2e]">Manage Goal</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-[#1a1a2e] font-bold mb-4">{goal.title}</p>
                              <Button 
                                onClick={() => handleDeleteGoal(goal.id)}
                                className="w-full retro-btn bg-[#FF6B6B] text-[#FFFDF5] hover:bg-[#ff5252] rounded-lg"
                              >
                                Delete Goal
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    {goal.goal_type === "progress" && (
                      <div className="space-y-3 mt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#4ECDC4] animate-pulse" />
                            <span className="text-[#1a1a2e] font-black uppercase text-xs tracking-wider">Current Progress</span>
                          </div>
                          <div className="bg-[#1a1a2e] text-white px-3 py-1 rounded-lg text-sm font-black retro-shadow-sm">
                            {goal.progress}%
                          </div>
                        </div>
                        
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-xl border-3 border-[#1a1a2e] bg-[#FFF8E7]">
                            <div 
                              style={{ width: `${goal.progress}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#FF6B6B] via-[#FFE66D] to-[#4ECDC4] transition-all duration-500 ease-out border-r-3 border-[#1a1a2e]"
                            />
                          </div>
                          
                          <div className="px-1">
                            <Slider
                              value={[goal.progress]}
                              onValueChange={(v) => handleUpdateProgress(goal.id, v[0])}
                              max={100}
                              step={1}
                              className="[&>span:first-child]:bg-[#1a1a2e] [&>span:first-child]:h-3 [&>span:first-child>span]:bg-[#4ECDC4] [&>span:last-child]:bg-[#FF6B6B] [&>span:last-child]:border-3 [&>span:last-child]:border-[#1a1a2e] [&>span:last-child]:w-6 [&>span:last-child]:h-6 [&>span:last-child]:cursor-pointer [&>span:last-child]:hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="flex justify-between mt-2 px-1">
                            <span className="text-[10px] font-black text-[#1a1a2e]/40">START</span>
                            <span className="text-[10px] font-black text-[#1a1a2e]/40">FINISH</span>
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
      </main>
    </div>
  )
}
