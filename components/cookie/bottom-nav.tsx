"use client"

import { Home, Compass, Plus, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Compass, label: "Discover", active: false },
  { icon: Plus, label: "Create", center: true },
  { icon: MessageCircle, label: "Messages", active: false },
  { icon: User, label: "Profile", active: false },
] as const

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => {
          if (item.center) {
            return (
              <button
                key={item.label}
                className="relative -mt-6 flex items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                  <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
                </div>
              </button>
            )
          }

          const Icon = item.icon
          return (
            <button
              key={item.label}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
                item.active 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-6 h-6 transition-all",
                item.active && "stroke-[2.5px]"
              )} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
