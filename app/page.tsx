"use client"

import { useState } from "react"
import { TopNav } from "@/components/cookie/top-nav"
import { BottomNav } from "@/components/cookie/bottom-nav"
import { MasonryFeed } from "@/components/cookie/masonry-feed"
import { CameraCapture } from "@/components/cookie/camera-capture"
import { RecipeSwiper } from "@/components/cookie/recipe-swiper"
import { ReviewsFeed } from "@/components/cookie/reviews-feed"
import { Messages } from "@/components/cookie/messages"
import { Profile } from "@/components/cookie/profile"
import { Notifications } from "@/components/cookie/notifications"
import { SplashScreen } from "@/components/cookie/splash-screen"
import { LoginScreen } from "@/components/cookie/login-screen"

type Tab = "Explore" | "Reviews"

export default function CookieApp() {
  const [activeTab, setActiveTab] = useState<Tab>("Explore")
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false)
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleSplashComplete = () => {
    setShowSplash(false)
    // Show login screen after splash
    setShowLogin(true)
  }

  const handleLogin = (method: "google" | "apple" | "phone") => {
    console.log(`[Auth] Logging in with ${method}`)
    // TODO: Implement Supabase auth here
    setIsAuthenticated(true)
    setShowLogin(false)
  }

  const handleSkipLogin = () => {
    console.log("[Auth] Skipping login, exploring as guest")
    setShowLogin(false)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (showLogin) {
    return <LoginScreen onLogin={handleLogin} onSkip={handleSkipLogin} />
  }

  return (
    <div className="min-h-screen bg-background w-full max-w-md mx-auto relative">
      <TopNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNotificationsClick={() => setIsNotificationsOpen(true)}
      />
      
      <main className="pb-24">
        {activeTab === "Explore" && <MasonryFeed />}
        {activeTab === "Reviews" && <ReviewsFeed />}
      </main>
      
      <BottomNav 
        onCreateClick={() => {
          console.log("[App] Opening camera")
          setIsCameraOpen(true)
        }} 
        onDiscoverClick={() => setIsDiscoverOpen(true)}
        onMessagesClick={() => setIsMessagesOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
      />
      
      <CameraCapture 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
      />
      
      <RecipeSwiper 
        isOpen={isDiscoverOpen} 
        onClose={() => setIsDiscoverOpen(false)} 
      />
      
      <Messages
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
      />

      <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <Notifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  )
}
