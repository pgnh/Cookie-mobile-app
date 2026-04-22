// @ts-nocheck
"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Heart, MoreVertical, X } from "lucide-react"
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
  },
  {
    id: 2,
    title: "Fluffy Japanese Souffle Pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop",
    userName: "Yuki Tanaka",
    date: "19 Mar 2026",
    activity: "Just posted",
  },
  {
    id: 3,
    title: "Creamy Tuscan Garlic Chicken",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=600&fit=crop",
    userName: "Marco Rossi",
    date: "18 Mar 2026",
    activity: "2 hearts",
  },
  {
    id: 4,
    title: "Rainbow Poke Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop",
    userName: "Kenji Nakamura",
    date: "17 Mar 2026",
    activity: "5 hearts",
  },
  {
    id: 5,
    title: "Double Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=600&fit=crop",
    userName: "Sophie Laurent",
    date: "16 Mar 2026",
    activity: "8 hearts",
  },
  {
    id: 6,
    title: "Spicy Korean Fried Chicken",
    image: "https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=400&h=600&fit=crop",
    userName: "Min-Jun Park",
    date: "15 Mar 2026",
    activity: "12 hearts",
  },
  {
    id: 7,
    title: "Seared Salmon with Asparagus",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop",
    userName: "Emma Wilson",
    date: "14 Mar 2026",
    activity: "3 hearts",
  },
  {
    id: 8,
    title: "Homemade Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=600&fit=crop",
    userName: "Giovanni Ferrari",
    date: "13 Mar 2026",
    activity: "15 hearts",
  },
]

export function RecipeSwiper({ isOpen, onClose }: RecipeSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedRecipes, setLikedRecipes] = useState<number[]>([])
  const touchStart = useRef(0)
  const touchEnd = useRef(0)

  if (!isOpen) return null

  const currentRecipe = recipes[currentIndex % recipes.length]
  const isLiked = likedRecipes.includes(currentRecipe.id)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientY
  }

  const handleTouchEnd = () => {
    const distance = touchStart.current - touchEnd.current
    const isSwipeDown = distance > 50
    const isSwipeUp = distance < -50

    if (isSwipeUp && currentIndex < recipes.length * 3) {
      setCurrentIndex(prev => prev + 1)
    }
    if (isSwipeDown && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const toggleLike = () => {
    if (likedRecipes.includes(currentRecipe.id)) {
      setLikedRecipes(prev => prev.filter(id => id !== currentRecipe.id))
    } else {
      setLikedRecipes(prev => [...prev, currentRecipe.id])
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Main container - Locket style */}
      <div
        className="relative w-full max-w-sm h-auto flex flex-col items-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image frame - Locket style */}
        <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl mb-6 transition-all duration-500">
          {/* Image */}
          <Image
            src={currentRecipe.image}
            alt={currentRecipe.title}
            fill
            className="object-cover"
            priority
          />

          {/* Overlay gradient at bottom of image */}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Info section below frame */}
        <div className="w-full text-center text-white space-y-3 pb-6">
          {/* Title */}
          <h2 className="text-lg font-semibold leading-tight px-2">
            {currentRecipe.title}
          </h2>

          {/* User info */}
          <div className="text-sm">
            <p className="font-medium">{currentRecipe.userName}</p>
            <p className="text-xs text-gray-400">{currentRecipe.date}</p>
          </div>

          {/* Activity */}
          <p className="text-xs text-gray-300">💔 {currentRecipe.activity}</p>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={toggleLike}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <Heart
                className="w-6 h-6"
                fill={isLiked ? "currentColor" : "none"}
                color={isLiked ? "#ef4444" : "white"}
                strokeWidth={2}
              />
              <span className="text-sm">{isLiked ? "Liked" : "Like"}</span>
            </button>

            <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Swipe indicator */}
        <div className="absolute -bottom-12 text-center text-white/40 text-xs">
          Swipe up for more
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-6 right-6 text-white/60 text-sm font-medium">
        {(currentIndex % recipes.length) + 1} / {recipes.length}
      </div>
    </div>
  )
}
