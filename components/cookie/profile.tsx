"use client"

import { useState } from "react"
import Image from "next/image"
import {
  X, MapPin, Link2, Settings, Share2, Grid3x3,
  ChefHat, Star, Bookmark, Heart, Clock, Flame,
  BadgeCheck, Edit3, MoreHorizontal, MessageCircle, Camera, ImagePlus, Check, ChevronLeft,
  Moon, Sun, Bell, Shield, User, Lock, HelpCircle, LogOut, ChevronRight, Languages, Eye, EyeOff
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileTab = "Posts" | "Recipes" | "Reviews" | "Saved"

// ─── Mock Data ────────────────────────────────────────────────────────────────

const userProfile = {
  name: "Alex Thompson",
  username: "alexthompson",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  bio: "Food lover & home chef 👨‍🍳\nExploring one recipe at a time ✨\nTokyo → NYC",
  location: "New York, USA",
  website: "cookie.app/alexthompson",
  verified: true,
  stats: {
    posts: 247,
    followers: 12400,
    following: 891,
  },
}

const highlights = [
  { id: "1", label: "Italian", emoji: "🍝", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=100&h=100&fit=crop" },
  { id: "2", label: "Breakfast", emoji: "☕", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop" },
  { id: "3", label: "Reviews", emoji: "⭐", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop" },
  { id: "4", label: "Desserts", emoji: "🍰", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=100&h=100&fit=crop" },
  { id: "5", label: "Travel", emoji: "🌏", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop" },
]

const postGrid = [
  { id: "1", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop", likes: 2340 },
  { id: "2", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop", likes: 4123 },
  { id: "3", image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=400&fit=crop", likes: 4521 },
  { id: "4", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop", likes: 892 },
  { id: "5", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop", likes: 3156 },
  { id: "6", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop", likes: 5234 },
  { id: "7", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop", likes: 2891 },
  { id: "8", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop", likes: 1245 },
  { id: "9", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop", likes: 1823 },
]

const myRecipes = [
  {
    id: "1",
    title: "Perfect Sourdough Bread",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    time: "4h",
    difficulty: "Hard",
    rating: 4.9,
    likes: 2340,
    category: "Baking",
  },
  {
    id: "2",
    title: "5-Minute Matcha Latte",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop",
    time: "5 min",
    difficulty: "Easy",
    rating: 4.8,
    likes: 4521,
    category: "Drinks",
  },
  {
    id: "3",
    title: "Classic French Croissants",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
    time: "3h",
    difficulty: "Hard",
    rating: 4.7,
    likes: 4123,
    category: "Baking",
  },
  {
    id: "4",
    title: "Rainbow Poke Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    time: "25 min",
    difficulty: "Easy",
    rating: 4.7,
    likes: 2891,
    category: "Healthy",
  },
]

const myReviews = [
  {
    id: "1",
    dish: "Tonkotsu Ramen",
    restaurant: "Ichiran Ramen",
    location: "Tokyo, Japan",
    rating: 5,
    comment: "The broth has been simmered for 18 hours and you can taste every minute of it. 10/10 🍜",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    likes: 1823,
    time: "2d",
  },
  {
    id: "2",
    dish: "Avocado Toast",
    restaurant: "The Daily Press",
    location: "New York, USA",
    rating: 4,
    comment: "Simple but executed perfectly. The sourdough base makes all the difference 🥑",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    likes: 892,
    time: "1w",
  },
  {
    id: "3",
    dish: "Japanese Cheesecake",
    restaurant: "Uncle Tetsu",
    location: "New York, USA",
    rating: 5,
    comment: "Cloud-like texture that melts instantly. The best cheesecake I've ever had 🍰",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
    likes: 3156,
    time: "2w",
  },
]

const savedPosts = [
  { id: "1", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop", likes: 2847 },
  { id: "2", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=400&fit=crop", likes: 1923 },
  { id: "3", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop", likes: 3201 },
  { id: "4", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop", likes: 1456 },
  { id: "5", image: "https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=400&h=400&fit=crop", likes: 2156 },
  { id: "6", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop", likes: 1823 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatStat(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

function getDifficultyColor(d: string) {
  if (d === "Easy") return "text-green-600 bg-green-50"
  if (d === "Medium") return "text-yellow-600 bg-yellow-50"
  return "text-red-600 bg-red-50"
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PostGrid({ posts }: { posts: typeof postGrid }) {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.map((post, i) => (
        <button key={post.id} className="relative aspect-square group overflow-hidden">
          <Image src={post.image} alt="Post" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <Heart className="w-4 h-4 text-white fill-white" />
              <span className="text-white text-xs font-bold">{formatStat(post.likes)}</span>
            </div>
          </div>
          {i === 0 && (
            <div className="absolute top-1.5 right-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

function RecipeList({ recipes }: { recipes: typeof myRecipes }) {
  return (
    <div className="px-4 py-3 space-y-3">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="flex gap-3 bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent" />
          </div>
          <div className="flex-1 min-w-0 py-2.5 pr-3">
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {recipe.category}
            </span>
            <h3 className="font-bold text-sm text-foreground mt-1 line-clamp-1">{recipe.title}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-primary fill-primary" />
                <span className="text-xs font-semibold text-foreground">{recipe.rating}</span>
              </div>
              <div className="flex items-center gap-0.5 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{recipe.time}</span>
              </div>
              <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", getDifficultyColor(recipe.difficulty))}>
                {recipe.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <Heart className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{formatStat(recipe.likes)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ReviewList({ reviews }: { reviews: typeof myReviews }) {
  return (
    <div className="px-4 py-3 space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="relative w-full h-32">
            <Image src={review.image} alt={review.dish} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-2 left-3 right-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-sm">{review.dish}</p>
                  <p className="text-white/80 text-xs">{review.restaurant}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-primary fill-primary" : "text-white/30")} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="px-3 py-2.5">
            <div className="flex items-center gap-1 mb-1.5">
              <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{review.location}</span>
              <span className="text-muted-foreground ml-auto text-xs">{review.time}</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed line-clamp-2">{review.comment}</p>
            <div className="flex items-center gap-1 mt-2">
              <button className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors">
                <Heart className="w-3.5 h-3.5" />
                <span className="text-xs">{formatStat(review.likes)}</span>
              </button>
              <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 transition-colors ml-3">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="text-xs">Reply</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProfileProps {
  isOpen: boolean
  onClose: () => void
}

export function Profile({ isOpen, onClose }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Posts")
  const [isFollowing, setIsFollowing] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  // Profile state (editable)
  const [profile, setProfile] = useState(userProfile)
  
  // Form state
  const [formData, setFormData] = useState({
    name: profile.name,
    username: profile.username,
    bio: profile.bio,
    location: profile.location,
    website: profile.website,
  })
  
  // Settings state
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    pushNotifications: true,
    emailNotifications: false,
    privateAccount: false,
    showActivity: true,
    language: "English",
  })

  if (!isOpen) return null
  
  const handleSaveProfile = () => {
    setProfile(prev => ({
      ...prev,
      ...formData
    }))
    setIsEditProfileOpen(false)
  }

  const tabs: { id: ProfileTab; icon: React.ReactNode; label: string }[] = [
    { id: "Posts", icon: <Grid3x3 className="w-4 h-4" />, label: "Posts" },
    { id: "Recipes", icon: <ChefHat className="w-4 h-4" />, label: "Recipes" },
    { id: "Reviews", icon: <Star className="w-4 h-4" />, label: "Reviews" },
    { id: "Saved", icon: <Bookmark className="w-4 h-4" />, label: "Saved" },
  ]

  return (
    <div className="fixed inset-0 z-[90] bg-background overflow-y-auto max-w-md mx-auto">
      {/* ── Floating Header ── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[100] flex items-center justify-between px-3 py-3">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
        >
          <X className="w-4.5 h-4.5 w-[18px] h-[18px] text-white" />
        </button>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
            <Share2 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Settings className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* ── Cover Photo ── */}
      <div className="relative w-full h-48">
        <Image src={userProfile.cover} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />
      </div>

      {/* ── Profile Info ── */}
      <div className="px-4 pb-0">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-12 mb-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-background shadow-lg">
              <Image src={userProfile.avatar} alt={userProfile.name} width={96} height={96} className="object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-2 border-background flex items-center justify-center shadow-sm">
              <Edit3 className="w-3 h-3 text-primary-foreground" />
            </button>
          </div>
          {/* Quick action buttons */}
          <div className="flex items-center gap-2 pb-1">
            <button
              onClick={() => {
                setFormData({
                  name: profile.name,
                  username: profile.username,
                  bio: profile.bio,
                  location: profile.location,
                  website: profile.website,
                })
                setIsEditProfileOpen(true)
              }}
              className="px-4 py-1.5 rounded-full border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Edit Profile
            </button>
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <MoreHorizontal className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Name + verified */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <h1 className="text-xl font-bold text-foreground">{profile.name}</h1>
          {profile.verified && (
            <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">@{profile.username}</p>

        {/* Bio */}
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-3">
          {profile.bio}
        </p>

        {/* Location + Website */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">{profile.location}</span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Link2 className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{profile.website}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around py-3 bg-muted/50 rounded-2xl mb-4">
          {[
            { label: "Posts", value: userProfile.stats.posts },
            { label: "Followers", value: formatStat(userProfile.stats.followers) },
            { label: "Following", value: formatStat(userProfile.stats.following) },
          ].map((stat, i) => (
            <button key={stat.label} className="flex flex-col items-center gap-0.5 flex-1">
              <span className="text-lg font-bold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Story Highlights ── */}
      <div className="px-4 mb-4">
        <div className="flex gap-4 overflow-x-auto pb-1">
          {highlights.map((h) => (
            <button key={h.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/30 p-0.5 bg-background">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image src={h.image} alt={h.label} fill className="object-cover" />
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">{h.label}</span>
            </button>
          ))}
          <button className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
              <span className="text-2xl text-muted-foreground leading-none">+</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">New</span>
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors",
                activeTab === tab.id
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="pb-8">
        {activeTab === "Posts" && <PostGrid posts={postGrid} />}
        {activeTab === "Recipes" && <RecipeList recipes={myRecipes} />}
        {activeTab === "Reviews" && <ReviewList reviews={myReviews} />}
        {activeTab === "Saved" && <PostGrid posts={savedPosts} />}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          EDIT PROFILE MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[100] bg-background overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border/50">
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">Cancel</span>
            </button>
            <h2 className="font-semibold text-foreground">Edit Profile</h2>
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
          </div>

          {/* Cover Photo Edit */}
          <div className="relative w-full h-40">
            <Image src={profile.cover} alt="Cover" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            <button className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-sm font-medium">Change Cover</span>
            </button>
          </div>

          {/* Avatar Edit */}
          <div className="px-4 -mt-10 mb-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-background shadow-lg">
                <Image src={profile.avatar} alt={profile.name} width={80} height={80} className="object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-2 border-background flex items-center justify-center shadow-sm">
                <Camera className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="px-4 space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Your name"
              />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Username</label>
              <div className="flex items-center">
                <span className="px-4 py-3 rounded-l-xl bg-muted border border-r-0 border-border/50 text-muted-foreground text-sm">@</span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="flex-1 px-4 py-3 rounded-r-xl bg-muted border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="username"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/150</p>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Website</label>
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Footer spacing */}
          <div className="h-8" />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SETTINGS MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] bg-background overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border/50">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">Back</span>
            </button>
            <h2 className="font-semibold text-foreground">Settings</h2>
            <div className="w-16" /> {/* Spacer for alignment */}
          </div>

          {/* User Card */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/20">
                <Image src={profile.avatar} alt={profile.name} width={56} height={56} className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground">{profile.name}</p>
                <p className="text-xs text-muted-foreground">@{profile.username}</p>
              </div>
              <button
                onClick={() => {
                  setIsSettingsOpen(false)
                  setIsEditProfileOpen(true)
                }}
                className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="px-4 space-y-6 pb-8">
            {/* Account Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Account</h3>
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors border-b border-border/50">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">Account Info</p>
                    <p className="text-xs text-muted-foreground">Name, email, phone</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors border-b border-border/50">
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">Security</p>
                    <p className="text-xs text-muted-foreground">Password, 2FA</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">Privacy</p>
                    <p className="text-xs text-muted-foreground">Account visibility</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Preferences</h3>
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                {/* Dark Mode Toggle */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                    {settings.darkMode ? (
                      <Moon className="w-4 h-4 text-slate-600" />
                    ) : (
                      <Sun className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">{settings.darkMode ? "On" : "Off"}</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                    className={cn(
                      "w-11 h-6 rounded-full transition-colors relative",
                      settings.darkMode ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                      settings.darkMode ? "translate-x-5.5 left-0.5" : "translate-x-0.5 left-0.5"
                    )} />
                  </button>
                </div>

                {/* Language */}
                <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors border-b border-border/50">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Languages className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">Language</p>
                    <p className="text-xs text-muted-foreground">{settings.language}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Notifications Toggle */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Notifications</p>
                    <p className="text-xs text-muted-foreground">{settings.notifications ? "Enabled" : "Disabled"}</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                    className={cn(
                      "w-11 h-6 rounded-full transition-colors relative",
                      settings.notifications ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                      settings.notifications ? "translate-x-5.5 left-0.5" : "translate-x-0.5 left-0.5"
                    )} />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Privacy</h3>
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                {/* Private Account */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50">
                  <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center">
                    {settings.privateAccount ? (
                      <Lock className="w-4 h-4 text-yellow-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Private Account</p>
                    <p className="text-xs text-muted-foreground">{settings.privateAccount ? "Only followers can see" : "Everyone can see"}</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, privateAccount: !prev.privateAccount }))}
                    className={cn(
                      "w-11 h-6 rounded-full transition-colors relative",
                      settings.privateAccount ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                      settings.privateAccount ? "translate-x-5.5 left-0.5" : "translate-x-0.5 left-0.5"
                    )} />
                  </button>
                </div>

                {/* Show Activity */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center">
                    <EyeOff className="w-4 h-4 text-teal-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Activity Status</p>
                    <p className="text-xs text-muted-foreground">{settings.showActivity ? "Visible" : "Hidden"}</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, showActivity: !prev.showActivity }))}
                    className={cn(
                      "w-11 h-6 rounded-full transition-colors relative",
                      settings.showActivity ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                      settings.showActivity ? "translate-x-5.5 left-0.5" : "translate-x-0.5 left-0.5"
                    )} />
                  </button>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Support</h3>
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors border-b border-border/50">
                  <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-pink-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">Help Center</p>
                    <p className="text-xs text-muted-foreground">FAQs and support</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-destructive">Log Out</p>
                  </div>
                </button>
              </div>
            </div>

            {/* App Info */}
            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">Cookie App v1.0.0</p>
              <p className="text-xs text-muted-foreground">© 2026 Cookie Inc.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
