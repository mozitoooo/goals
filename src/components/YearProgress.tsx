'use client'

import { useState, useEffect } from 'react'

export function YearProgress() {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setNow(new Date()), 100)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="mb-10 bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-6 max-w-lg mx-auto retro-shadow animate-pulse">
        <div className="h-5 bg-[#FFE66D] rounded w-1/3 mb-4 mx-auto" />
        <div className="w-full h-6 bg-[#1a1a2e]/10 rounded-lg mb-4" />
        <div className="h-10 bg-[#FF6B6B]/30 rounded w-1/2 mx-auto" />
      </div>
    )
  }

  const startOf2026 = new Date(2026, 0, 1)
  const endOf2026 = new Date(2026, 11, 31, 23, 59, 59, 999)
  const totalMs = endOf2026.getTime() - startOf2026.getTime()
  const elapsedMs = Math.max(0, Math.min(now.getTime() - startOf2026.getTime(), totalMs))
  const percentPassed = (elapsedMs / totalMs) * 100

  const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((elapsedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000)

  return (
    <div className="mb-10 bg-[#FFFDF5] border-3 border-[#1a1a2e] rounded-xl p-6 max-w-lg mx-auto retro-shadow text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xl">~</span>
        <p className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wider">2026 Year Progress</p>
        <span className="text-xl">~</span>
      </div>
      
      <div className="w-full h-8 bg-[#1a1a2e] rounded-lg overflow-hidden mb-4 border-2 border-[#1a1a2e] p-1">
        <div 
          className="h-full bg-gradient-to-r from-[#FF6B6B] via-[#FFE66D] to-[#4ECDC4] rounded transition-all duration-300"
          style={{ width: `${percentPassed}%` }}
        />
      </div>
      
      <div className="space-y-2">
        <p className="text-4xl font-black text-[#FF6B6B] tabular-nums tracking-tight font-mono">
          {percentPassed.toPrecision(6)}%
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-[#4ECDC4] border-2 border-[#1a1a2e] rounded-lg text-sm font-bold">{days}d</span>
          <span className="px-3 py-1 bg-[#FFE66D] border-2 border-[#1a1a2e] rounded-lg text-sm font-bold">{hours}h</span>
          <span className="px-3 py-1 bg-[#FF6B6B] border-2 border-[#1a1a2e] rounded-lg text-sm font-bold text-white">{minutes}m</span>
          <span className="px-3 py-1 bg-[#95E1D3] border-2 border-[#1a1a2e] rounded-lg text-sm font-bold">{seconds}s</span>
        </div>
      </div>
    </div>
  )
}
