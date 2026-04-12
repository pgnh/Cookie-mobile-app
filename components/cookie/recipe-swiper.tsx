"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, Heart, Star, Clock, Bookmark, RotateCcw, Share2, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecipeSwiperProps {
  isOpen: boolean
  onClose: () => void
}

const recipes = [
  {
    id: 1,
    title: "Fluffy Japanese Souffle Pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=1000&fit=crop",
    chef: "Yuki Tanaka",
    chefAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 4.9,
    reviews: 2847,
    time: "45 min",
    difficulty: "Medium",
    tags: ["Breakfast", "Japanese", "Sweet"],
    ingredients: ["Eggs", "Flour", "Milk", "Sugar", "Vanilla"]
  },
  {
    id: 2,
    title: "Creamy Tuscan Garlic Chicken",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&h=1000&fit=crop",
    chef: "Marco Rossi",
    chefAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 4.8,
    reviews: 1923,
    time: "35 min",
    difficulty: "Easy",
    tags: ["Dinner", "Italian", "Creamy"],
    ingredients: ["Chicken", "Garlic", "Spinach", "Cream", "Parmesan"]
  },
  {
    id: 3,
    title: "Rainbow Poke Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=1000&fit=crop",
    chef: "Kenji Nakamura",
    chefAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 4.7,
    reviews: 1456,
    time: "25 min",
    difficulty: "Easy",
    tags: ["Healthy", "Hawaiian", "Fresh"],
    ingredients: ["Salmon", "Rice", "Avocado", "Edamame", "Sesame"]
  },
  {
    id: 4,
    title: "Double Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=1000&fit=crop",
    chef: "Sophie Laurent",
    chefAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.9,
    reviews: 3201,
    time: "30 min",
    difficulty: "Hard",
    tags: ["Dessert", "Chocolate", "French"],
    ingredients: ["Dark Chocolate", "Butter", "Eggs", "Sugar", "Flour"]
  },
  {
    id: 5,
    title: "Spicy Korean Fried Chicken",
    image: "https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=800&h=1000&fit=crop",
    chef: "Min-Jun Park",
    chefAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 4.8,
    reviews: 2156,
    time: "50 min",
    difficulty: "Medium",
    tags: ["Korean", "Spicy", "Crispy"],
    ingredients: ["Chicken Wings", "Gochujang", "Soy Sauce", "Garlic", "Ginger"]
  }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy": return "bg-green-100 text-green-700"
    case "Medium": return "bg-yellow-100 text-yellow-700"
    case "Hard": return "bg-red-100 text-red-700"
    default: return "bg-muted text-muted-foreground"
  }
}

export function RecipeSwiper({ isOpen, onClose }: RecipeSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [likedRecipes, setLikedRecipes] = useState<number[]>([])
  const [showInfo, setShowInfo] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const isDragging = useRef(false)

  if (!isOpen) return null

  const currentRecipe = recipes[currentIndex % recipes.length]
  const nextRecipe = recipes[(currentIndex + 1) % recipes.length]
  const nextNextRecipe = recipes[(currentIndex + 2) % recipes.length]

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction)
    
    if (direction === "right") {
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

  const handleDragStart = (clientX: number) => {
    isDragging.current = true
    startX.current = clientX
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current) return
    const diff = clientX - startX.current
    setDragOffset(diff)
  }

  const handleDragEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false
    
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

  const rotation = dragOffset * 0.1
  const opacity = Math.max(0, 1 - Math.abs(dragOffset) / 300)

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">
            {(currentIndex % recipes.length) + 1} / {recipes.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm">
            <span className="text-primary-foreground text-sm font-semibold">
              {likedRecipes.length} saved
            </span>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="absolute inset-0 flex items-center justify-center px-2 pt-16 pb-24">
        <>
          {/* Background cards */}
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
              transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
              opacity: swipeDirection ? 1 : opacity
            }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            {/* Swipe indicators */}
            <div 
              className="absolute top-8 left-6 z-20 px-4 py-2 rounded-lg border-4 border-red-500 rotate-[-20deg] transition-opacity"
              style={{ opacity: Math.max(0, -dragOffset / 100) }}
            >
              <span className="text-red-500 text-2xl font-black">NOPE</span>
            </div>
            <div 
              className="absolute top-8 right-6 z-20 px-4 py-2 rounded-lg border-4 border-green-500 rotate-[20deg] transition-opacity"
              style={{ opacity: Math.max(0, dragOffset / 100) }}
            >
              <span className="text-green-500 text-2xl font-black">SAVE</span>
            </div>

            {/* Recipe Image */}
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

              {/* Info button */}
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Info className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Recipe Info */}
            <div className="p-5 h-[35%] flex flex-col">
              <h2 className="text-2xl font-bold text-foreground leading-tight mb-3">
                {currentRecipe.title}
              </h2>

              {/* Chef info */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
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
