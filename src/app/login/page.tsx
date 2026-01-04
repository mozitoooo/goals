"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/Logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FFF8E7] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-[#4ECDC4] rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-[#FFE66D] rounded-lg rotate-12 animate-float" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-1/3 left-10 w-16 h-16 bg-[#FF6B6B] rounded-full animate-float" style={{ animationDelay: '1.4s' }} />
        <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-[#95E1D3] rounded-lg rotate-45 animate-float" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-10 left-1/3 text-5xl animate-float" style={{ animationDelay: '1s' }}>*</div>
        <div className="absolute bottom-1/4 right-10 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>~</div>
      </div>
      
      <div className="w-full max-w-md relative bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-8 retro-shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-black text-[#1a1a2e] mb-2">Welcome Back!</h1>
          <p className="text-[#1a1a2e]/70 font-medium">
            Sign in to continue tracking your goals
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-[#FF6B6B]/20 border-2 border-[#FF6B6B] text-[#1a1a2e] text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#1a1a2e] font-bold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#FFF8E7] border-2 border-[#1a1a2e] focus:border-[#FF6B6B] focus:ring-0 rounded-lg h-12 font-medium"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#1a1a2e] font-bold">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#FFF8E7] border-2 border-[#1a1a2e] focus:border-[#FF6B6B] focus:ring-0 rounded-lg h-12 font-medium"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full retro-btn bg-[#FF6B6B] text-[#FFFDF5] hover:bg-[#ff5252] rounded-lg h-12 text-lg"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          
          <p className="text-sm text-[#1a1a2e]/70 text-center font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#FF6B6B] hover:underline font-bold">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
