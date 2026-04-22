// @ts-nocheck
"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Heart, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecipeSwiperProps {
  isOpen: boolean
  onClose: () => void
}

const recipes = [
  {
    id: 1,
    title: "Rửa bát + chuẩn bị đồ ăn sáng",
    image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=500&h=700&fit=crop",
    userName: "You",
    date: "20 Mar 2026",
    activity: "No activity yet!",
  },
  {
    id: 2,
    title: "Fluffy Japanese Souffle Pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=700&fit=crop",
    userName: "Yuki Tanaka",
    date: "19 Mar 2026",
    activity: "3 likes",
  },
  {
    id: 3,
    title: "Creamy Tuscan Garlic Chicken",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&h=700&fit=crop",
    userName: "Marco Rossi",
    date: "18 Mar 2026",
    activity: "5 likes",
  },
  {
    id: 4,
    title: "Rainbow Poke Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=700&fit=crop",
    userName: "Kenji Nakamura",
    date: "17 Mar 2026",
    activity: "8 likes",
  },
  {
    id: 5,
    title: "Double Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=700&fit=crop",
    userName: "Sophie Laurent",
    date: "16 Mar 2026",
    activity: "12 likes",
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

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEnd.current = e.changedTouches[0].clientY
    const distance = touchStart.current - touchEnd.current

    if (distance > 50 && currentIndex < recipes.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else if (distance < -50 && currentIndex > 0) {
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
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-20 text-white/70 hover:text-white transition-colors"
      >
        <span className="text-2xl">✕</span>
      </button>

      {/* Progress indicator */}
      <div className="absolute top-6 right-6 text-white/60 text-xs font-medium">
        {(currentIndex % recipes.length) + 1} / {recipes.length}
      </div>

      {/* Main card container */}
      <div className="flex-1 flex items-center justify-center w-full px-4">
        <div className="w-full max-w-sm">
          {/* Large rounded image - Locket style */}
          <div className="relative w-full aspect-square rounded-4xl overflow-hidden shadow-2xl mb-8">
            <Image
              src={currentRecipe.image}
              alt={currentRecipe.title}
              fill
              className="object-cover"
              priority
            />

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

            {/* Title overlay on image */}
            <div className="absolute bottom-0 inset-x-0 p-6">
              <p className="text-white font-semibold text-lg line-clamp-2">
                {currentRecipe.title}
              </p>
            </div>
          </div>

          {/* Info section below image */}
          <div className="text-center space-y-4">
            {/* User and date */}
            <div className="text-white">
              <p className="text-base font-medium">
                {currentRecipe.userName}{" "}
                <span className="text-white/60 font-normal text-sm">
                  {currentRecipe.date}
                </span>
              </p>
            </div>

            {/* Activity */}
            <p className="text-white/70 text-sm flex items-center justify-center gap-1.5">
              <span>✨</span>
              {currentRecipe.activity}
            </p>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <button
                onClick={toggleLike}
                className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity"
              >
                <Heart
                  className="w-6 h-6"
                  fill={isLiked ? "currentColor" : "none"}
                  color={isLiked ? "#ef4444" : "white"}
                  strokeWidth={2}
                />
              </button>

              <button className="text-white/60 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe indicator */}
      <div className="absolute bottom-8 text-white/40 text-xs text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="w-1 h-1 rounded-full bg-white/30" />
          </div>
          <span>Swipe up or down</span>
        </div>
      </div>
    </div>
  )
}
