"use client"

import { useState } from "react"
import { TopNav } from "@/components/cookie/top-nav"
import { BottomNav } from "@/components/cookie/bottom-nav"
import { MasonryFeed } from "@/components/cookie/masonry-feed"
import { CameraCapture } from "@/components/cookie/camera-capture"
import { RecipeSwiper } from "@/components/cookie/recipe-swiper"
import { ReviewsFeed } from "@/components/cookie/reviews-feed"

type Tab = "Explore" | "Reviews"

export default function CookieApp() {
  const [activeTab, setActiveTab] = useState<Tab>("Explore")
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background w-full max-w-md mx-auto relative">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pb-24">
        {activeTab === "Explore" && <MasonryFeed />}
        {activeTab === "Reviews" && <ReviewsFeed isVisible={activeTab === "Reviews"} />}
      </main>
      
      <BottomNav 
        onCreateClick={() => setIsCameraOpen(true)} 
        onDiscoverClick={() => setIsDiscoverOpen(true)}
      />
      
      <CameraCapture 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
      />
      
      <RecipeSwiper 
        isOpen={isDiscoverOpen} 
        onClose={() => setIsDiscoverOpen(false)} 
      />
    </div>
  )
}
