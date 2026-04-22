// @ts-nocheck
"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Heart, MessageCircle, Share2, MoreVertical, ChevronUp, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecipeSwiperProps {
  isOpen: boolean
  onClose: () => void
}

const recipes = [
  {
    id: 1,
    title: "Fluffy Japanese Souffle Pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=800&fit=crop",
    chef: "Yuki Tanaka",
    chefAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    description: "Cloud-like pancakes with vanilla",
    rating: 4.9,
    reviews: 2847,
    time: "45 min",
  },
  {
    id: 2,
    title: "Creamy Tuscan Garlic Chicken",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&h=800&fit=crop",
    chef: "Marco Rossi",
    chefAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    description: "Restaurant-quality dinner in 35 min",
    rating: 4.8,
    reviews: 1923,
    time: "35 min",
  },
  {
    id: 3,
    title: "Rainbow Poke Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=800&fit=crop",
    chef: "Kenji Nakamura",
    chefAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    description: "Fresh and vibrant Hawaiian bowl",
    rating: 4.7,
    reviews: 1456,
    time: "25 min",
  },
  {
    id: 4,
    title: "Double Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=800&fit=crop",
    chef: "Sophie Laurent",
    chefAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    description: "Decadent molten chocolate cakes",
    rating: 4.9,
    reviews: 3201,
    time: "30 min",
  },
  {
    id: 5,
    title: "Spicy Korean Fried Chicken",
    image: "https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=500&h=800&fit=crop",
    chef: "Min-Jun Park",
    chefAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    description: "Ultra-crispy with sweet-spicy glaze",
    rating: 4.8,
    reviews: 2156,
    time: "50 min",
  },
  {
    id: 6,
    title: "Seared Salmon with Asparagus",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=800&fit=crop",
    chef: "Emma Wilson",
    chefAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    description: "Elegant and healthy dinner",
    rating: 4.8,
    reviews: 1234,
    time: "20 min",
  },
  {
    id: 7,
    title: "Homemade Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&h=800&fit=crop",
    chef: "Giovanni Ferrari",
    chefAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    description: "Classic Italian with fresh basil",
    rating: 4.9,
    reviews: 2876,
    time: "40 min",
  },
  {
    id: 8,
    title: "Mango Sticky Rice",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=800&fit=crop",
    chef: "Aom Tanakorn",
    chefAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    description: "Sweet Thai dessert perfection",
    rating: 4.9,
    reviews: 1987,
    time: "15 min",
  },
]

export function RecipeSwiper({ isOpen, onClose }: RecipeSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedRecipes, setLikedRecipes] = useState<number[]>([])
  const touchStart = useRef(0)
  const touchEnd = useRef(0)

  if (!isOpen) return null

  const currentRecipe = recipes[currentIndex % recipes.length]

  const handleSwipeDown = () => {
    if (currentIndex < recipes.length * 3 - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleSwipeUp = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

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

    if (isSwipeDown) handleSwipeDown()
    if (isSwipeUp) handleSwipeUp()
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
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Progress indicator */}
      <div className="absolute top-4 right-4 z-20 text-white text-sm font-medium">
        {(currentIndex % recipes.length) + 1} / {recipes.length}
      </div>

      {/* Main container */}
      <div
        className="relative w-full h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cards container - Vertical infinite scroll */}
        <div className="relative w-full h-full">
          {recipes.map((recipe, index) => (
            <div
              key={recipe.id}
              className={cn(
                "absolute inset-0 w-full h-full transition-all duration-500 ease-out",
                index === currentIndex % recipes.length
                  ? "opacity-100 translate-y-0"
                  : index < currentIndex % recipes.length
                  ? "opacity-0 -translate-y-full"
                  : "opacity-0 translate-y-full"
              )}
            >
              {/* Full-screen image */}
              <div className="relative w-full h-full">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Gradient overlay - Top to bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />

                {/* Content - Positioned absolutely at bottom */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                  {/* Top - Icons and info */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-xs opacity-75">Today</p>
                      <p className="text-sm font-medium">{recipe.time}</p>
                    </div>
                  </div>

                  {/* Bottom - Recipe info and actions */}
                  <div className="space-y-6">
                    {/* Recipe title and description */}
                    <div>
                      <h2 className="text-3xl font-bold leading-tight mb-2">
                        {recipe.title}
                      </h2>
                      <p className="text-sm opacity-90">{recipe.description}</p>
                    </div>

                    {/* Chef info - like Locket style */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/40">
                          <Image
                            src={recipe.chefAvatar}
                            alt={recipe.chef}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">by {recipe.chef}</p>
                          <p className="text-xs opacity-75">
                            ★ {recipe.rating} ({recipe.reviews})
                          </p>
                        </div>
                      </div>

                      {/* Action buttons - Vertical stack on right */}
                      <div className="flex flex-col gap-3">
                        {/* Like */}
                        <button
                          onClick={toggleLike}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all active:scale-75"
                        >
                          <Heart
                            className="w-5 h-5"
                            fill={isLiked ? "currentColor" : "none"}
                            color={isLiked ? "#ef4444" : "white"}
                            strokeWidth={2}
                          />
                        </button>

                        {/* Comment */}
                        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </button>

                        {/* Share */}
                        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                          <Share2 className="w-5 h-5 text-white" />
                        </button>

                        {/* More */}
                        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                          <MoreVertical className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Swipe hint - Bottom center */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 text-xs animate-pulse">
                  <span>Swipe up</span>
                  <ChevronUp className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
