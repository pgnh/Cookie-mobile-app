"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, Heart, Star, Clock, ChefHat, Bookmark, RotateCcw, Share2, Info } from "lucide-react"
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

  const currentRecipe = recipes[currentIndex]
  const hasMoreRecipes = currentIndex < recipes.length

  const handleSwipe = (direction: "left" | "right") => {
    if (!hasMoreRecipes) return
    
    setSwipeDirection(direction)
    
    if (direction === "right") {
      setLikedRecipes(prev => [...prev, currentRecipe.id])
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
      setCurrentIndex(prev => prev - 1)
      setLikedRecipes(prev => prev.filter(id => id !== recipes[currentIndex - 1].id))
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
              {currentIndex + 1} / {recipes.length}
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
      <div className="absolute inset-0 flex items-center justify-center px-4 pt-20 pb-32">
        {hasMoreRecipes ? (
          <>
            {/* Background cards */}
            {currentIndex + 2 < recipes.length && (
              <div className="absolute w-[85%] h-[70%] rounded-3xl bg-white/5 scale-90 -translate-y-4" />
            )}
            {currentIndex + 1 < recipes.length && (
              <div className="absolute w-[90%] h-[72%] rounded-3xl bg-white/10 scale-95 -translate-y-2" />
            )}
            
            {/* Current card */}
            <div
              ref={cardRef}
              className={cn(
                "relative w-full max-w-sm h-[75%] rounded-3xl overflow-hidden bg-card shadow-2xl cursor-grab active:cursor-grabbing transition-transform",
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

              {/* Recipe Image */}
              <div className="relative h-[55%] w-full">
                <Image
                  src={currentRecipe.image}
                  alt={currentRecipe.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Tags */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {currentRecipe.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-4 h-[45%] flex flex-col">
                <h2 className="text-xl font-bold text-foreground leading-tight mb-2">
                  {currentRecipe.title}
                </h2>
                
                {/* Chef info */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full overflow-hidden relative">
                    <Image
                      src={currentRecipe.chefAvatar}
                      alt={currentRecipe.chef}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">by {currentRecipe.chef}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{currentRecipe.rating}</span>
                    <span className="text-xs text-muted-foreground">({currentRecipe.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{currentRecipe.time}</span>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    getDifficultyColor(currentRecipe.difficulty)
                  )}>
                    {currentRecipe.difficulty}
                  </span>
                </div>

                {/* Ingredients preview */}
                {showInfo && (
                  <div className="flex-1 overflow-auto">
                    <p className="text-xs text-muted-foreground mb-1">Ingredients:</p>
                    <div className="flex flex-wrap gap-1">
                      {currentRecipe.ingredients.map((ing) => (
                        <span 
                          key={ing}
                          className="px-2 py-0.5 rounded-full bg-muted text-xs text-foreground"
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
        ) : (
          /* No more recipes */
          <div className="text-center px-8">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">All caught up!</h2>
            <p className="text-white/60 mb-6">
              You&apos;ve seen all recipes. Check back later for more delicious inspiration!
            </p>
            <p className="text-primary font-medium">
              {likedRecipes.length} recipes saved
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {hasMoreRecipes && (
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4">
          <button 
            onClick={handleUndo}
            disabled={currentIndex === 0}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              currentIndex === 0 
                ? "bg-white/5 text-white/30" 
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => handleSwipe("left")}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/80 transition-colors group"
          >
            <X className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
          </button>
          
          <button 
            onClick={() => handleSwipe("right")}
            className="w-20 h-20 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <Heart className="w-10 h-10 text-primary-foreground" />
          </button>
          
          <button 
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-blue-500/80 transition-colors group"
          >
            <Bookmark className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
          </button>
          
          <button 
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

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
