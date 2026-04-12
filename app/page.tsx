"use client"

import { useState } from "react"
import { TopNav } from "@/components/cookie/top-nav"
import { BottomNav } from "@/components/cookie/bottom-nav"
import { MasonryFeed } from "@/components/cookie/masonry-feed"
import { CameraCapture } from "@/components/cookie/camera-capture"

type Tab = "Explore" | "Recipes" | "Reviews"

export default function CookieApp() {
  const [activeTab, setActiveTab] = useState<Tab>("Explore")
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background w-full max-w-md mx-auto relative">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pb-24">
        <MasonryFeed />
      </main>
      
      <BottomNav onCreateClick={() => setIsCameraOpen(true)} />
      
      <CameraCapture 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
      />
    </div>
  )
}
