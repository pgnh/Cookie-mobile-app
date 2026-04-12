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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 w-full">
      <div className="px-3 sm:px-4 pt-3 pb-2">
        {/* Logo and Search Row */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs sm:text-sm">C</span>
            </div>
            <span className="font-bold text-base sm:text-lg text-foreground hidden xs:inline">Cookie</span>
          </div>
          
          <div className={cn(
            "flex-1 min-w-0 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200",
            searchFocused 
              ? "bg-white ring-2 ring-primary shadow-sm" 
              : "bg-muted"
          )}>
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
          
          <button className="relative p-1.5 sm:p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "flex-1 py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200",
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
