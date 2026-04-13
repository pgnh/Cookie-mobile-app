"use client"

import { useState } from "react"
import Image from "next/image"
import {
  X, MapPin, Link2, Settings, Share2, Grid3x3,
  ChefHat, Star, Bookmark, Heart, Clock, Flame,
  BadgeCheck, Edit3, MoreHorizontal, MessageCircle,
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

  if (!isOpen) return null

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
          <button className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
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
            <button className="px-4 py-1.5 rounded-full border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors">
              Edit Profile
            </button>
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <MoreHorizontal className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Name + verified */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <h1 className="text-xl font-bold text-foreground">{userProfile.name}</h1>
          {userProfile.verified && (
            <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">@{userProfile.username}</p>

        {/* Bio */}
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-3">
          {userProfile.bio}
        </p>

        {/* Location + Website */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">{userProfile.location}</span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Link2 className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{userProfile.website}</span>
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
    </div>
  )
}
