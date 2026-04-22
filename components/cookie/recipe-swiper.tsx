// @ts-nocheck
"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Heart, MoreVertical, X, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecipeSwiperProps {
  isOpen: boolean
  onClose: () => void
}

const recipes = [
  {
    id: 1,
    title: "Rửa bát + chuẩn bị đồ ăn sáng",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop",
    userName: "You",
    date: "20 Mar 2026",
    activity: "No activity yet!",
    rating: 4.9,
  },
  {
    id: 2,
    title: "Fluffy Japanese Souffle Pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop",
    userName: "Yuki Tanaka",
    date: "19 Mar 2026",
    activity: "Just posted",
    rating: 4.9,
  },
  {
    id: 3,
    title: "Creamy Tuscan Garlic Chicken",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=600&fit=crop",
    userName: "Marco Rossi",
    date: "18 Mar 2026",
    activity: "2 hearts",
    rating: 4.8,
  },
  {
    id: 4,
    title: "Rainbow Poke Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop",
    userName: "Kenji Nakamura",
    date: "17 Mar 2026",
    activity: "5 hearts",
    rating: 4.7,
  },
  {
    id: 5,
    title: "Double Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=600&fit=crop",
    userName: "Sophie Laurent",
    date: "16 Mar 2026",
    activity: "8 hearts",
    rating: 4.9,
  },
  {
    id: 6,
    title: "Spicy Korean Fried Chicken",
    image: "https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=400&h=600&fit=crop",
    userName: "Min-Jun Park",
    date: "15 Mar 2026",
    activity: "3 hearts",
    rating: 4.8,
  },
  {
    id: 7,
    title: "Seared Salmon with Asparagus",
    image: "https://images.unsplash.com/photo-1581092162562-40038e57e4b8?w=400&h=600&fit=crop",
    userName: "Emma Wilson",
    date: "14 Mar 2026",
    activity: "Just posted",
    rating: 4.8,
  },
  {
    id: 8,
    title: "Homemade Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=600&fit=crop",
    userName: "Giovanni Ferrari",
    date: "13 Mar 2026",
    activity: "10 hearts",
    rating: 4.9,
  },
  {
    id: 9,
    title: "Mango Sticky Rice",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=600&fit=crop",
    userName: "Aom Tanakorn",
    date: "12 Mar 2026",
    activity: "4 hearts",
    rating: 4.9,
  },
  {
    id: 10,
    title: "Thai Green Curry",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e9f1d?w=400&h=600&fit=crop",
    userName: "Somchai Thai",
    date: "11 Mar 2026",
    activity: "6 hearts",
    rating: 4.7,
  },
]

export function RecipeSwiper({ isOpen, onClose }: RecipeSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedRecipes, setLikedRecipes] = useState<number[]>([])
  const [transition, setTransition] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef(0)
  const touchEnd = useRef(0)
  const startY = useRef(0)

  if (!isOpen) return null

  const currentRecipe = recipes[currentIndex]

  const handleSwipeUp = () => {
    if (currentIndex < recipes.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleSwipeDown = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientY
    startY.current = e.targetTouches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientY
  }

  const handleTouchEnd = () => {
    const distance = touchStart.current - touchEnd.current
    const isSwipeUp = distance > 30
    const isSwipeDown = distance < -30

    if (isSwipeUp) handleSwipeUp()
    if (isSwipeDown) handleSwipeDown()
  }

  const toggleLike = () => {
    if (likedRecipes.includes(currentRecipe.id)) {
      setLikedRecipes(prev => prev.filter(id => id !== currentRecipe.id))
    } else {
      setLikedRecipes(prev => [...prev, currentRecipe.id])
    }
  }

  const isLiked = likedRecipes.includes(currentRecipe.id)

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-0 sm:p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Page indicator */}
      <div className="absolute top-4 right-4 z-20 text-white text-sm font-medium">
        {currentIndex + 1} / {recipes.length}
      </div>

      {/* Main container with frame effect */}
      <div
        ref={containerRef}
        className="relative w-full h-full sm:w-96 sm:h-auto sm:rounded-2xl sm:overflow-hidden flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image container - Locket style with frame */}
        <div className="relative w-full flex-1 sm:flex-none sm:h-96 overflow-hidden rounded-xl sm:rounded-2xl">
          <div
            className={cn(
              "absolute inset-0 transition-all duration-500",
              transition ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={currentRecipe.image}
              alt={currentRecipe.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Info section - Locket style */}
        <div className="bg-black p-6 sm:p-4 text-white space-y-3 rounded-b-xl sm:rounded-b-2xl">
          {/* Title */}
          <h3 className="text-lg sm:text-base font-semibold leading-tight text-balance">
            {currentRecipe.title}
          </h3>

          {/* User and date */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{currentRecipe.userName}</span>
            <span className="text-gray-400">{currentRecipe.date}</span>
          </div>

          {/* Activity status */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 h-1 rounded-full",
                    i === 0 ? "bg-gray-400" : "bg-gray-600"
                  )}
                />
              ))}
            </div>
            <span>{currentRecipe.activity}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              onClick={toggleLike}
              className={cn(
                "flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-lg transition-all text-sm font-medium",
                isLiked
                  ? "bg-red-500/20 text-red-400"
                  : "hover:bg-white/10 text-gray-300"
              )}
            >
              <Heart
                className="w-4 h-4"
                fill={isLiked ? "currentColor" : "none"}
              />
              Like
            </button>

            <button className="flex-1 py-2 px-3 flex items-center justify-center gap-2 rounded-lg hover:bg-white/10 transition-all text-sm font-medium text-gray-300">
              <MoreVertical className="w-4 h-4" />
              More
            </button>
          </div>
        </div>
      </div>

      {/* Navigation hints */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 text-xs">
        <ChevronUp className="w-4 h-4 animate-bounce" />
        <span>Swipe up for more</span>
      </div>

      {/* Keyboard navigation support */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-600 text-xs hidden sm:block">
        Scroll or use arrow keys
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  )
}
