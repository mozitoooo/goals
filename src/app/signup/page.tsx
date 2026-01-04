"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/Logo"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (username.length < 3) {
      setError("Username must be at least 3 characters")
      setLoading(false)
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores")
      setLoading(false)
      return
    }

    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username.toLowerCase())
      .single()

    if (existingUser) {
      setError("Username is already taken")
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase(),
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        username: username.toLowerCase(),
        email: email,
      })

      if (profileError) {
        setError("Failed to create profile")
        setLoading(false)
        return
      }

      router.push("/dashboard")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FFF8E7] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#FF6B6B] rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-[#4ECDC4] rounded-lg rotate-12 animate-float" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-[#FFE66D] rounded-full animate-float" style={{ animationDelay: '1.4s' }} />
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-[#DDA0DD] rounded-lg rotate-45 animate-float" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-10 right-1/3 text-5xl animate-float" style={{ animationDelay: '1s' }}>+</div>
        <div className="absolute bottom-1/4 left-10 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>~</div>
      </div>
      
      <div className="w-full max-w-md relative bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-8 retro-shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-black text-[#1a1a2e] mb-2">Join Goals!</h1>
          <p className="text-[#1a1a2e]/70 font-medium">
            Start tracking your yearly goals today
          </p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-[#FF6B6B]/20 border-2 border-[#FF6B6B] text-[#1a1a2e] text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[#1a1a2e] font-bold">Username</Label>
            <Input
              id="username"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-[#FFF8E7] border-2 border-[#1a1a2e] focus:border-[#4ECDC4] focus:ring-0 rounded-lg h-12 font-medium"
            />
            <p className="text-xs text-[#1a1a2e]/60 font-medium px-1">
              Your public profile: goals.qzz.io/{username.toLowerCase() || "username"}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#1a1a2e] font-bold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#FFF8E7] border-2 border-[#1a1a2e] focus:border-[#4ECDC4] focus:ring-0 rounded-lg h-12 font-medium"
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
              minLength={6}
              className="bg-[#FFF8E7] border-2 border-[#1a1a2e] focus:border-[#4ECDC4] focus:ring-0 rounded-lg h-12 font-medium"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full retro-btn bg-[#4ECDC4] text-[#1a1a2e] hover:bg-[#3dbdb5] rounded-lg h-12 text-lg"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
          
          <p className="text-sm text-[#1a1a2e]/70 text-center font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FF6B6B] hover:underline font-bold">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
