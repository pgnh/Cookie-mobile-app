"use client"

import { useState, useEffect } from "react"
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
import { createBrowserClient } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

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
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createBrowserClient()

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setIsLoading(false)
      
      // After splash, show login if not authenticated
      if (!session?.user) {
        setShowLogin(true)
      }
    }

    checkAuth()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          setShowLogin(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleLogin = (method: "google" | "apple" | "phone") => {
    console.log(`[Auth] Successfully logged in with ${method}`)
    // Auth state is handled by onAuthStateChange listener
  }

  const handleSkipLogin = () => {
    console.log("[Auth] Skipping login, exploring as guest")
    setShowLogin(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowLogin(true)
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
        user={user}
        onLogout={handleLogout}
      />

      <Notifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  )
}
