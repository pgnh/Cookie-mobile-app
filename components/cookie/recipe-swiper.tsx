"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, Heart, Star, Clock, Bookmark, Share2, MessageCircle, ChevronUp, ChevronDown, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecipeSwiperProps {
  isOpen: boolean
  onClose: () => void
}

interface Recipe {
  id: number
  title: string
  image: string
  chef: string
  chefAvatar: string
  time: string
  difficulty: "Easy" | "Medium" | "Hard"
  rating: number
  reviews: number
  ingredients: string[]
  tags: string[]
  likes: number
  comments: number
}

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Fluffy Japanese Souffle Pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=1200&fit=crop",
    chef: "Yuki Tanaka",
    chefAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    time: "45 min",
    difficulty: "Medium",
    rating: 4.9,
    reviews: 2341,
    ingredients: ["Eggs", "Flour", "Milk", "Sugar", "Vanilla"],
    tags: ["Breakfast", "Japanese"],
    likes: 12400,
    comments: 856
  },
  {
    id: 2,
    title: "Creamy Garlic Tuscan Salmon",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=1200&fit=crop",
    chef: "Marco Rossi",
    chefAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    time: "30 min",
    difficulty: "Easy",
    rating: 4.8,
    reviews: 1876,
    ingredients: ["Salmon", "Garlic", "Spinach", "Cream", "Parmesan"],
    tags: ["Dinner", "Italian"],
    likes: 8900,
    comments: 432
  },
  {
    id: 3,
    title: "Korean Fried Chicken Wings",
    image: "https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=800&h=1200&fit=crop",
    chef: "Ji-Young Kim",
    chefAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    time: "1 hr",
    difficulty: "Medium",
    rating: 4.9,
    reviews: 3102,
    ingredients: ["Chicken Wings", "Gochujang", "Soy Sauce", "Honey", "Garlic"],
    tags: ["Korean", "Spicy"],
    likes: 23100,
    comments: 1204
  },
  {
    id: 4,
    title: "Matcha Tiramisu",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=1200&fit=crop",
    chef: "Sakura Ito",
    chefAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    time: "4 hrs",
    difficulty: "Hard",
    rating: 4.7,
    reviews: 956,
    ingredients: ["Matcha", "Mascarpone", "Ladyfingers", "Cream", "Sugar"],
    tags: ["Dessert", "No-Bake"],
    likes: 15600,
    comments: 723
  },
  {
    id: 5,
    title: "Spicy Thai Basil Noodles",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=1200&fit=crop",
    chef: "Siri Wongsa",
    chefAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    time: "20 min",
    difficulty: "Easy",
    rating: 4.8,
    reviews: 2156,
    ingredients: ["Rice Noodles", "Thai Basil", "Chili", "Garlic", "Soy Sauce"],
    tags: ["Thai", "Quick"],
    likes: 19800,
    comments: 945
  }
]

export function RecipeSwiper({ isOpen, onClose }: RecipeSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down" | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [likedRecipes, setLikedRecipes] = useState<number[]>([])
  const [savedRecipes, setSavedRecipes] = useState<number[]>([])
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const currentRecipe = recipes[currentIndex % recipes.length]
  const isLiked = likedRecipes.includes(currentRecipe.id)
  const isSaved = savedRecipes.includes(currentRecipe.id)

  const goToNext = () => {
    setSwipeDirection("up")
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setSwipeDirection(null)
      setDragOffset(0)
    }, 300)
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setSwipeDirection("down")
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1)
        setSwipeDirection(null)
        setDragOffset(0)
      }, 300)
    }
  }

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true)
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY
  }

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const diff = currentY - startY.current
    setDragOffset(diff)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (dragOffset < -80) {
      goToNext()
    } else if (dragOffset > 80 && currentIndex > 0) {
      goToPrev()
    } else {
      setDragOffset(0)
    }
  }

  const toggleLike = () => {
    if (isLiked) {
      setLikedRecipes(prev => prev.filter(id => id !== currentRecipe.id))
    } else {
      setLikedRecipes(prev => [...prev, currentRecipe.id])
    }
  }

  const toggleSave = () => {
    if (isSaved) {
      setSavedRecipes(prev => prev.filter(id => id !== currentRecipe.id))
    } else {
      setSavedRecipes(prev => [...prev, currentRecipe.id])
    }
  }

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500"
      case "Medium": return "bg-yellow-500"
      case "Hard": return "bg-red-500"
      default: return "bg-muted"
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black overflow-hidden">
      {/* Full screen recipe card */}
      <div 
        ref={containerRef}
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Background Image */}
        <div 
          className={cn(
            "absolute inset-0 transition-transform duration-300",
            swipeDirection === "up" && "animate-slide-up",
            swipeDirection === "down" && "animate-slide-down"
          )}
          style={{
            transform: `translateY(${dragOffset * 0.3}px)`,
          }}
        >
          <Image
            src={currentRecipe.image}
            alt={currentRecipe.title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>

        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-12 pb-4">
          <button 
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/30 backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm font-medium">
              Discover
            </span>
          </div>

          <div className="w-10" />
        </div>

        {/* Swipe hint indicators */}
        <div className={cn(
          "absolute top-1/3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity pointer-events-none",
          dragOffset < -30 ? "opacity-100" : "opacity-0"
        )}>
          <ChevronUp className="w-8 h-8 text-white animate-bounce" />
          <span className="text-white text-sm font-medium">Next recipe</span>
        </div>

        <div className={cn(
          "absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity pointer-events-none",
          dragOffset > 30 && currentIndex > 0 ? "opacity-100" : "opacity-0"
        )}>
          <span className="text-white text-sm font-medium">Previous recipe</span>
          <ChevronDown className="w-8 h-8 text-white animate-bounce" />
        </div>

        {/* Right side action buttons - TikTok style */}
        <div className="absolute right-3 bottom-36 z-20 flex flex-col items-center gap-5">
          {/* Chef avatar */}
          <div className="relative mb-2">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white">
              <Image
                src={currentRecipe.chefAvatar}
                alt={currentRecipe.chef}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <span className="text-[10px] text-primary-foreground font-bold">+</span>
            </div>
          </div>

          {/* Like button */}
          <button 
            onClick={toggleLike}
            className="flex flex-col items-center gap-1"
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              isLiked ? "bg-red-500 scale-110" : "bg-black/30 backdrop-blur-sm"
            )}>
              <Heart className={cn(
                "w-6 h-6 transition-all",
                isLiked ? "text-white fill-white" : "text-white"
              )} />
            </div>
            <span className="text-white text-xs font-medium">
              {formatCount(currentRecipe.likes + (isLiked ? 1 : 0))}
            </span>
          </button>

          {/* Comment button */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">
              {formatCount(currentRecipe.comments)}
            </span>
          </button>

          {/* Save button */}
          <button 
            onClick={toggleSave}
            className="flex flex-col items-center gap-1"
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              isSaved ? "bg-primary scale-110" : "bg-black/30 backdrop-blur-sm"
            )}>
              <Bookmark className={cn(
                "w-6 h-6 transition-all",
                isSaved ? "text-primary-foreground fill-primary-foreground" : "text-white"
              )} />
            </div>
            <span className="text-white text-xs font-medium">Save</span>
          </button>

          {/* Share button */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">Share</span>
          </button>
        </div>

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-16 z-10 p-4 pb-8">
          {/* Chef info */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white font-semibold">@{currentRecipe.chef.toLowerCase().replace(' ', '_')}</span>
            <button className="px-3 py-1 rounded-full border border-white/50 text-white text-xs font-medium">
              Follow
            </button>
          </div>

          {/* Title */}
          <h2 className="text-white text-xl font-bold leading-tight mb-3">
            {currentRecipe.title}
          </h2>

          {/* Recipe stats bar */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white text-sm">{currentRecipe.time}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm">{currentRecipe.rating}</span>
            </div>
            <div className={cn(
              "w-2 h-2 rounded-full",
              getDifficultyColor(currentRecipe.difficulty)
            )} />
            <span className="text-white/80 text-sm">{currentRecipe.difficulty}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {currentRecipe.tags.map((tag) => (
              <span 
                key={tag}
                className="text-white/90 text-sm"
              >
                #{tag.toLowerCase()}
              </span>
            ))}
          </div>

          {/* Try Recipe Button */}
          <button className="w-full py-3.5 rounded-full bg-primary flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
            <span className="text-primary-foreground font-semibold">Try This Recipe</span>
          </button>
        </div>

        {/* Progress indicator */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1">
          {recipes.map((_, index) => (
            <div 
              key={index}
              className={cn(
                "w-1 rounded-full transition-all",
                index === currentIndex % recipes.length 
                  ? "h-6 bg-white" 
                  : "h-2 bg-white/30"
              )}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        @keyframes slide-down {
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
