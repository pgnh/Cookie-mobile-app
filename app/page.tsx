"use client"

import { useState } from "react"
import { TopNav } from "@/components/cookie/top-nav"
import { BottomNav } from "@/components/cookie/bottom-nav"
import { MasonryFeed } from "@/components/cookie/masonry-feed"

type Tab = "Explore" | "Recipes" | "Reviews"

export default function CookieApp() {
  const [activeTab, setActiveTab] = useState<Tab>("Explore")

  return (
    <div className="min-h-screen bg-background w-full max-w-md mx-auto relative">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pb-24">
        <MasonryFeed />
      </main>
      
      <BottomNav />
    </div>
  )
}
