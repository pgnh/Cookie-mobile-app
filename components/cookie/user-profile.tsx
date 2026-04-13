"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  ArrowLeft, MapPin, Link as LinkIcon, Calendar, Users, Grid3X3, Bookmark, Tag,
  MessageCircle, Heart, Share2, MoreHorizontal, Verified, Plus
} from "lucide-react"

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
  user?: {
    id: string
    name: string
    username: string
    avatar: string
    bio?: string
    location?: string
    website?: string
    joinedDate?: string
    followers: number
    following: number
    posts: number
    isVerified?: boolean
  }
}

export function UserProfile({ isOpen, onClose, user }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts")
  const [isFollowing, setIsFollowing] = useState(false)
  const [followers, setFollowers] = useState(user?.followers || 0)

  if (!isOpen || !user) return null

  const handleFollow = () => {
    if (isFollowing) {
      setFollowers(prev => prev - 1)
    } else {
      setFollowers(prev => prev + 1)
    }
    setIsFollowing(!isFollowing)
  }

  // Mock posts for the user
  const mockPosts = [
    { id: 1, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80", likes: 234 },
    { id: 2, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", likes: 189 },
    { id: 3, image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", likes: 456 },
    { id: 4, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80", likes: 123 },
    { id: 5, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80", likes: 567 },
    { id: 6, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80", likes: 345 },
  ]

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-card overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-card/95 backdrop-blur-md border-b border-border/50">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="font-semibold text-foreground">Profile</span>
        </div>

        {/* Profile Content */}
        <div className="pb-6">
          {/* Cover Image */}
          <div className="relative h-40 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5">
            <Image
              src="https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=800&q=80"
              alt="Cover"
              fill
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>

          {/* Avatar & Actions */}
          <div className="px-4 -mt-16 relative">
            <div className="flex items-end justify-between">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-card bg-card">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <button className="p-2.5 rounded-full border border-border hover:bg-muted transition-colors">
                  <Share2 className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={handleFollow}
                  className={cn(
                    "px-6 py-2.5 rounded-full font-semibold text-sm transition-all",
                    isFollowing
                      ? "bg-muted text-foreground border border-border"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-4 mt-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
              {user.isVerified && (
                <Verified className="w-5 h-5 text-primary fill-primary" />
              )}
            </div>
            <p className="text-muted-foreground">@{user.username}</p>

            {/* Bio */}
            <p className="mt-3 text-sm text-foreground leading-relaxed">
              {user.bio || "Food enthusiast & home cook 🍳 Sharing my culinary adventures and recipes with you all. Let's cook together! 👨‍🍳"}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{user.location || "New York, USA"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4" />
                <span className="text-primary">{user.website || "instagram.com/chef"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Joined {user.joinedDate || "March 2024"}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 py-3 border-y border-border/50">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground">{user.posts}</span>
                <span className="text-sm text-muted-foreground">Posts</span>
              </div>
              <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <span className="font-bold text-foreground">{followers.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">Followers</span>
              </button>
              <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <span className="font-bold text-foreground">{user.following.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">Following</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border/50 mt-1">
              {[
                { id: "posts", icon: Grid3X3, label: "Posts" },
                { id: "saved", icon: Bookmark, label: "Saved" },
                { id: "tagged", icon: Tag, label: "Tagged" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2",
                    activeTab === tab.id
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-3 gap-1 mt-4">
              {mockPosts.map((post) => (
                <div key={post.id} className="relative aspect-square group cursor-pointer">
                  <Image
                    src={post.image}
                    alt="Post"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-1 text-white">
                      <Heart className="w-4 h-4 fill-white" />
                      <span className="text-sm font-semibold">{post.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Action Button */}
            <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50">
              <Plus className="w-7 h-7 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
