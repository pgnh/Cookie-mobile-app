// @ts-nocheck
"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { UserProfile } from "./user-profile"
import { X, Heart, Star, Clock, Bookmark, RotateCcw, Share2, Info, ChevronLeft, ChefHat, Users, Flame, CheckCircle2, Play, ArrowUpRight } from "lucide-react"
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
    servings: 2,
    calories: 320,
    description: "These cloud-like pancakes are a breakfast dream come true. Light, airy, and melt-in-your-mouth delicious with a hint of vanilla.",
    ingredients: [
      "3 large eggs, separated",
      "2 tbsp whole milk",
      "3 tbsp all-purpose flour",
      "2 tbsp granulated sugar",
      "1/2 tsp pure vanilla extract",
      "1/4 tsp cream of tartar",
      "Butter for cooking",
      "Maple syrup for serving"
    ],
    instructions: [
      "Separate egg whites and yolks into two clean, dry bowls. Chill whites for 5 minutes.",
      "Whisk yolks with milk, flour, and vanilla until smooth and lump-free.",
      "Beat whites with cream of tartar until foamy, then gradually add sugar.",
      "Continue beating until stiff, glossy peaks form - about 5-7 minutes.",
      "Gently fold 1/3 of meringue into yolk mixture to lighten, then fold in rest.",
      "Heat non-stick pan on low, add butter, and spoon in tall mounds of batter.",
      "Cover and cook 4 minutes until set, flip gently and cook 3 more minutes.",
      "Serve immediately with warm maple syrup and fresh berries."
    ]
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
    servings: 4,
    calories: 485,
    description: "Juicy chicken breasts in a rich, creamy garlic sauce with spinach and sun-dried tomatoes. A restaurant-quality dinner ready in 35 minutes!",
    ingredients: [
      "4 boneless chicken breasts",
      "1 tsp garlic powder, salt & pepper",
      "2 tbsp olive oil",
      "4 cloves garlic, minced",
      "1 cup heavy cream",
      "1/2 cup freshly grated parmesan",
      "2 cups fresh baby spinach",
      "1/2 cup sun-dried tomatoes",
      "Fresh basil for garnish"
    ],
    instructions: [
      "Season chicken breasts generously with salt, pepper, and garlic powder.",
      "Heat olive oil in large skillet over medium-high heat.",
      "Sear chicken 5-6 minutes per side until golden and cooked through. Set aside.",
      "In same pan, sauté minced garlic for 30 seconds until fragrant.",
      "Add cream, parmesan, and sun-dried tomatoes. Simmer 3 minutes.",
      "Stir in spinach until just wilted, about 1 minute.",
      "Return chicken to pan, spoon sauce over. Simmer 2-3 minutes.",
      "Garnish with fresh basil and serve with pasta or crusty bread."
    ]
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
    servings: 2,
    calories: 380,
    description: "A vibrant, nutritious bowl packed with fresh salmon, creamy avocado, and colorful vegetables over seasoned sushi rice.",
    ingredients: [
      "1 cup sushi rice, cooked and cooled",
      "200g sashimi-grade salmon, cubed",
      "1 ripe avocado, thinly sliced",
      "1/2 cup shelled edamame",
      "1/4 English cucumber, sliced",
      "1/4 cup pickled ginger",
      "2 tbsp sesame seeds, toasted",
      "Poke sauce: 3 tbsp soy, 1 tbsp sesame oil, 1 tsp rice vinegar"
    ],
    instructions: [
      "Cook sushi rice according to package, season with rice vinegar and let cool.",
      "Whisk together poke sauce ingredients in a small bowl.",
      "Gently toss salmon cubes with half the poke sauce, marinate 10 minutes.",
      "Prepare all vegetables: slice avocado, cucumber, and prep edamame.",
      "Divide rice between two bowls as the base.",
      "Artfully arrange salmon and vegetables in sections over rice.",
      "Top with sesame seeds and pickled ginger.",
      "Drizzle remaining sauce over bowl just before serving."
    ]
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
    servings: 4,
    calories: 420,
    description: "Decadent individual chocolate cakes with a molten, gooey center that flows like lava when you cut into them.",
    ingredients: [
      "100g high-quality dark chocolate (70%)",
      "100g unsalted butter, plus more for greasing",
      "2 whole eggs + 2 egg yolks",
      "1/2 cup granulated sugar",
      "2 tbsp all-purpose flour",
      "Cocoa powder for dusting",
      "Vanilla ice cream for serving"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C). Generously butter and flour 4 ramekins.",
      "Melt chocolate and butter together in a bowl over simmering water.",
      "Whisk eggs, yolks, and sugar until pale, thick, and tripled in volume.",
      "Fold melted chocolate into egg mixture gently until no streaks remain.",
      "Sift in flour and fold until just combined - don't overmix!",
      "Divide batter evenly between prepared ramekins.",
      "Bake 12-14 minutes. Edges should be firm, center still jiggly.",
      "Invert onto plates, dust with cocoa, serve immediately with ice cream."
    ]
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
    servings: 3,
    calories: 520,
    description: "Ultra-crispy Korean fried chicken coated in a sweet, spicy, and sticky gochujang glaze. Absolutely addictive!",
    ingredients: [
      "500g chicken wings, pat dry",
      "1/2 cup potato starch or cornstarch",
      "Vegetable oil for deep frying",
      "3 tbsp gochujang (Korean chili paste)",
      "2 tbsp soy sauce",
      "2 tbsp honey or brown sugar",
      "3 cloves garlic, minced",
      "1 tsp fresh ginger, grated",
      "Sesame seeds and green onions for garnish"
    ],
    instructions: [
      "Pat chicken completely dry with paper towels - this is crucial for crispiness!",
      "Toss chicken in potato starch until evenly coated, shake off excess.",
      "Heat oil to 350°F (175°C). Fry chicken 10 minutes until light golden.",
      "Remove and let drain on wire rack for 5 minutes.",
      "Increase oil to 375°F (190°C). Double-fry chicken 3-4 minutes until deep golden.",
      "Whisk gochujang, soy sauce, honey, garlic, and ginger in a bowl.",
      "Toss hot wings in the sauce until evenly coated and glossy.",
      "Sprinkle generously with sesame seeds and sliced green onions. Serve hot!"
    ]
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
  const [showDetail, setShowDetail] = useState(false)
  const [savedSteps, setSavedSteps] = useState<number[]>([])
  const [isProfileOpen, setIsProfileOpen] = useState(false)
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

  const toggleStep = (stepIndex: number) => {
    setSavedSteps(prev =>
      prev.includes(stepIndex)
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    )
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

            {/* Recipe Image - Click to open detail */}
            <div
              className="relative h-[65%] w-full cursor-pointer"
              onClick={() => setShowDetail(true)}
            >
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

              {/* Info button - Open full detail */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDetail(true)
                }}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
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
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/20 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={currentRecipe.chefAvatar}
                    alt={currentRecipe.chef}
                    fill
                    className="object-cover"
                  />
                </button>
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

      {/* ═══════════════════════════════════════════════════════════════
          RECIPE DETAIL MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {showDetail && (
        <div className="fixed inset-0 z-[60] bg-background overflow-y-auto animate-in slide-in-from-bottom duration-300">
          {/* ── Sticky Header ── */}
          <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border/50">
            <button
              onClick={() => setShowDetail(false)}
              className="flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">Back</span>
            </button>
            <h2 className="font-semibold text-foreground">Recipe Details</h2>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-full hover:bg-muted transition-colors">
                <Share2 className="w-5 h-5 text-foreground" />
              </button>
              <button className="p-2 rounded-full hover:bg-muted transition-colors">
                <Bookmark className={cn(
                  "w-5 h-5",
                  likedRecipes.includes(currentRecipe.id) ? "text-primary fill-primary" : "text-foreground"
                )} />
              </button>
            </div>
          </div>

          {/* ── Hero Image ── */}
          <div className="relative w-full aspect-[4/3]">
            <Image
              src={currentRecipe.image}
              alt={currentRecipe.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Floating Tags */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {currentRecipe.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl font-bold text-white leading-tight">{currentRecipe.title}</h1>
            </div>
          </div>

          {/* ── Chef Section ── */}
          <div className="px-4 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 hover:opacity-80 transition-opacity"
              >
                <Image src={currentRecipe.chefAvatar} alt={currentRecipe.chef} fill className="object-cover" />
              </button>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex-1 text-left hover:opacity-80 transition-opacity"
              >
                <p className="font-bold text-foreground">{currentRecipe.chef}</p>
                <p className="text-xs text-muted-foreground">Recipe Creator</p>
              </button>
              <button className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Follow
              </button>
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-4 gap-2 bg-muted/50 rounded-2xl p-3">
              <div className="flex flex-col items-center gap-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-bold text-sm text-foreground">{currentRecipe.rating}</span>
                <span className="text-[10px] text-muted-foreground">{currentRecipe.reviews}</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-l border-border">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-bold text-sm text-foreground">{currentRecipe.time}</span>
                <span className="text-[10px] text-muted-foreground">Time</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-l border-border">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-sm text-foreground">{currentRecipe.calories}</span>
                <span className="text-[10px] text-muted-foreground">kcal</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-l border-border">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-bold text-sm text-foreground">{currentRecipe.servings}</span>
                <span className="text-[10px] text-muted-foreground">Servings</span>
              </div>
            </div>
          </div>

          {/* ── Difficulty Badge ── */}
          <div className="px-4 pb-4">
            <span className={cn(
              "inline-flex px-3 py-1.5 rounded-full text-sm font-semibold",
              getDifficultyColor(currentRecipe.difficulty)
            )}>
              {currentRecipe.difficulty} Difficulty
            </span>
          </div>

          {/* ── Description ── */}
          <div className="px-4 pb-4">
            <p className="text-sm text-foreground leading-relaxed">{currentRecipe.description}</p>
          </div>

          {/* ── Ingredients Section ── */}
          <div className="px-4 py-4 bg-muted/30 border-y border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Ingredients</h3>
              </div>
              <span className="text-xs text-muted-foreground">{currentRecipe.ingredients.length} items</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {currentRecipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-card border border-border/50">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-primary font-semibold">{i + 1}</span>
                  </div>
                  <span className="text-sm text-foreground">{ing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Instructions Section ── */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground">Instructions</h3>
              <span className="text-xs text-muted-foreground">{currentRecipe.instructions.length} steps</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(savedSteps.length / currentRecipe.instructions.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 text-center">
                {savedSteps.length === currentRecipe.instructions.length
                  ? "🎉 All steps completed!"
                  : `${savedSteps.length} of ${currentRecipe.instructions.length} steps completed`}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {currentRecipe.instructions.map((step, i) => (
                <button
                  key={i}
                  onClick={() => toggleStep(i)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all border",
                    savedSteps.includes(i)
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card border-border/50 hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                    savedSteps.includes(i) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {savedSteps.includes(i) ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{i + 1}</span>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm leading-relaxed flex-1 pt-1",
                    savedSteps.includes(i) ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Start Cooking Button ── */}
          <div className="sticky bottom-0 left-0 right-0 px-4 py-3 bg-background border-t border-border/50 pb-safe">
            <button className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
              <Play className="w-5 h-5 fill-current" />
              Start Cooking Mode
            </button>
          </div>
        </div>
      )}

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={{
          id: currentRecipe.id.toString(),
          name: currentRecipe.chef,
          username: currentRecipe.chef.toLowerCase().replace(/\s+/g, ""),
          avatar: currentRecipe.chefAvatar,
          followers: 25600,
          following: 450,
          posts: 523,
          isVerified: true
        }}
      />
    </div>
  )
}
