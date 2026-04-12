"use client"

import { useState } from "react"
import { Search, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = ["Explore", "Recipes", "Reviews"] as const
type Tab = (typeof tabs)[number]

interface TopNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function TopNav({ activeTab, onTabChange }: TopNavProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="px-4 pt-3 pb-2">
        {/* Logo and Search Row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-lg text-foreground">Cookie</span>
          </div>
          
          <div className={cn(
            "flex-1 flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200",
            searchFocused 
              ? "bg-white ring-2 ring-primary shadow-sm" 
              : "bg-muted"
          )}>
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search recipes, reviews..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
          
          <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-semibold rounded-full transition-all duration-200",
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
