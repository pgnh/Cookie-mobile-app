"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, Heart, Star, Clock, Bookmark, RotateCcw, Share2, Info } from "lucide-react"
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
    tags: ["Breakfast", "Japanese", "Sweet"]
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
    tags: ["Dinner", "Healthy", "Italian"]
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
    tags: ["Korean", "Spicy", "Crispy"]
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
    tags: ["Dessert", "Japanese", "No-Bake"]
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
    tags: ["Thai", "Spicy", "Quick"]
  }
]

export function RecipeSwiper({ isOpen, onClose }: RecipeSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [likedRecipes, setLikedRecipes] = useState<number[]>([])
  const [showInfo, setShowInfo] = useState(false)
  const startX = useRef(0)
  const cardRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const currentRecipe = recipes[currentIndex % recipes.length]
  const nextRecipe = recipes[(currentIndex + 1) % recipes.length]
  const nextNextRecipe = recipes[(currentIndex + 2) % recipes.length]

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction)
    
    if (direction === "right") {
      // Only add if not already liked
      if (!likedRecipes.includes(currentRecipe.id)) {
        setLikedRecipes(prev => [...prev, currentRecipe.id])
      }
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setSwipeDirection(null)
      setDragOffset(0)
    }, 300)
  }

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true)
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX
  }

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const diff = currentX - startX.current
    setDragOffset(diff)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (Math.abs(dragOffset) > 100) {
      handleSwipe(dragOffset > 0 ? "right" : "left")
    } else {
      setDragOffset(0)
    }
  }

  const handleUndo = () => {
    if (currentIndex > 0) {
      const prevRecipe = recipes[(currentIndex - 1) % recipes.length]
      setCurrentIndex(prev => prev - 1)
      setLikedRecipes(prev => prev.filter(id => id !== prevRecipe.id))
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-600"
      case "Medium": return "bg-yellow-500/20 text-yellow-600"
      case "Hard": return "bg-red-500/20 text-red-600"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-12 pb-4">
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
            <span className="text-white text-sm font-medium">
              {(currentIndex % recipes.length) + 1} / {recipes.length}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm flex items-center gap-1">
            <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
            <span className="text-primary-foreground text-sm font-medium">
              {likedRecipes.length}
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className={cn(
            "p-2 rounded-full backdrop-blur-sm transition-colors",
            showInfo ? "bg-primary" : "bg-white/10"
          )}
        >
          <Info className={cn("w-5 h-5", showInfo ? "text-primary-foreground" : "text-white")} />
        </button>
      </div>

      {/* Card Stack */}
      <div className="absolute inset-0 flex items-center justify-center px-2 pt-16 pb-24">
        <>
          {/* Background cards - always show for infinite loop effect */}
          <div className="absolute w-[94%] h-[88%] rounded-3xl bg-white/5 scale-[0.92] -translate-y-3 overflow-hidden">
            <Image
              src={nextNextRecipe.image}
              alt=""
              fill
              className="object-cover opacity-30"
            />
          </div>
          <div className="absolute w-[97%] h-[90%] rounded-3xl bg-white/10 scale-[0.96] -translate-y-1.5 overflow-hidden">
            <Image
              src={nextRecipe.image}
              alt=""
              fill
              className="object-cover opacity-50"
            />
          </div>
            
            {/* Current card */}
            <div
              ref={cardRef}
              className={cn(
                "relative w-full h-[92%] rounded-3xl overflow-hidden bg-card shadow-2xl cursor-grab active:cursor-grabbing transition-transform",
                swipeDirection === "left" && "animate-swipe-left",
                swipeDirection === "right" && "animate-swipe-right"
              )}
              style={{
                transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseMove={handleTouchMove}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
            >
              {/* Swipe indicators */}
              <div 
                className={cn(
                  "absolute top-8 left-4 z-20 px-4 py-2 rounded-lg border-4 border-green-500 rotate-[-20deg] transition-opacity",
                  dragOffset > 50 ? "opacity-100" : "opacity-0"
                )}
              >
                <span className="text-green-500 font-bold text-2xl">SAVE</span>
              </div>
              <div 
                className={cn(
                  "absolute top-8 right-4 z-20 px-4 py-2 rounded-lg border-4 border-red-500 rotate-[20deg] transition-opacity",
                  dragOffset < -50 ? "opacity-100" : "opacity-0"
                )}
              >
                <span className="text-red-500 font-bold text-2xl">SKIP</span>
              </div>

              {/* Recipe Image - TikTok style full height */}
              <div className="relative h-[65%] w-full">
                <Image
                  src={currentRecipe.image}
                  alt={currentRecipe.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Tags */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {currentRecipe.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-5 h-[35%] flex flex-col">
                <h2 className="text-2xl font-bold text-foreground leading-tight mb-3">
                  {currentRecipe.title}
                </h2>
                
                {/* Chef info */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden relative">
                    <Image
                      src={currentRecipe.chefAvatar}
                      alt={currentRecipe.chef}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-base text-muted-foreground">by {currentRecipe.chef}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-5 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-base font-semibold">{currentRecipe.rating}</span>
                    <span className="text-sm text-muted-foreground">({currentRecipe.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-base text-muted-foreground">{currentRecipe.time}</span>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    getDifficultyColor(currentRecipe.difficulty)
                  )}>
                    {currentRecipe.difficulty}
                  </span>
                </div>

                {/* Ingredients preview */}
                {showInfo && (
                  <div className="flex-1 overflow-auto">
                    <p className="text-sm text-muted-foreground mb-2">Ingredients:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentRecipe.ingredients.map((ing) => (
                        <span 
                          key={ing}
                          className="px-3 py-1 rounded-full bg-muted text-sm text-foreground"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
        </>
      </div>

      {/* Action buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
          <button 
            onClick={handleUndo}
            disabled={currentIndex === 0}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              currentIndex === 0 
                ? "bg-white/5 text-white/30" 
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => handleSwipe("left")}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/80 transition-colors group"
          >
            <X className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
          </button>
          
          <button 
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <Heart className="w-8 h-8 text-primary-foreground" />
          </button>
          
          <button 
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-blue-500/80 transition-colors group"
          >
            <Bookmark className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          
          <button 
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>

      <style jsx global>{`
        @keyframes swipe-left {
          to {
            transform: translateX(-150%) rotate(-30deg);
            opacity: 0;
          }
        }
        @keyframes swipe-right {
          to {
            transform: translateX(150%) rotate(30deg);
            opacity: 0;
          }
        }
        .animate-swipe-left {
          animation: swipe-left 0.3s ease-out forwards;
        }
        .animate-swipe-right {
          animation: swipe-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
