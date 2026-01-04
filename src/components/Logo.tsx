import { Target } from "lucide-react"
import Link from "next/link"

export function Logo({ className = "", size = "md" }: { className?: string, size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { box: "w-10 h-10", icon: 20, text: "text-xl" },
    md: { box: "w-12 h-12", icon: 24, text: "text-2xl" },
    lg: { box: "w-16 h-16", icon: 32, text: "text-4xl" }
  }
  
  const currentSize = sizes[size]

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className={`${currentSize.box} bg-[#FF6B6B] border-3 border-[#1a1a2e] rounded-lg flex items-center justify-center retro-shadow-sm rotate-3 group-hover:rotate-0 transition-transform`}>
        <Target size={currentSize.icon} className="text-[#1a1a2e]" strokeWidth={3} />
      </div>
      <span className={`${currentSize.text} font-black text-[#1a1a2e] tracking-tight`}>
        GOAL<span className="text-[#FF6B6B]">S</span>
      </span>
    </Link>
  )
}
