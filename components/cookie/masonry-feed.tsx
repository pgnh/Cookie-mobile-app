"use client"

import { useState } from "react"
import Image from "next/image"
import { FeedCard, type FeedPost } from "./feed-card"
import { cn } from "@/lib/utils"
import { Comments } from "./comments"
import { UserProfile } from "./user-profile"
import {
  X, Heart, Share2, Bookmark, MessageCircle, Clock, ChefHat, Star, MapPin, Calendar, Eye, Send, MoreHorizontal
} from "lucide-react"

interface DetailedPost extends FeedPost {
  description?: string
  time?: string
  difficulty?: "Easy" | "Medium" | "Hard"
  rating?: number
  ingredients?: string[]
  instructions?: string[]
  restaurant?: string
  location?: string
  comment?: string
  tags?: string[]
  views?: number
  comments?: number
  createdAt?: string
  isLiked?: boolean
  isSaved?: boolean
}

const samplePosts: DetailedPost[] = [
  {
    id: "1",
    title: "Perfect Sourdough Bread - A Complete Guide for Beginners",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    author: { name: "Sarah Baker", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
    likes: 2340,
    category: "Recipe",
    aspectRatio: "tall",
    description: "Master the art of sourdough with this comprehensive guide. From feeding your starter to achieving that perfect crusty ear, I'll walk you through every step of the journey.",
    time: "24h",
    difficulty: "Hard",
    rating: 4.9,
    ingredients: ["500g bread flour", "100g active sourdough starter", "350g warm water", "10g sea salt"],
    instructions: ["Mix flour and water, autolyse for 1 hour", "Add starter and salt, fold every 30 min for 3 hours", "Bulk ferment overnight in fridge", "Shape and proof for 4 hours", "Bake at 450°F for 45 min"],
    tags: ["Baking", "Sourdough", "Artisan Bread", "Fermentation"],
    views: 15234,
    comments: 89,
    createdAt: "2 days ago",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    title: "Cozy Cafe Review: Hidden Gem in Downtown",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    author: { name: "Mike Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
    likes: 1823,
    category: "Review",
    aspectRatio: "medium",
    restaurant: "The Hidden Bean",
    location: "Downtown, Seattle",
    rating: 4.5,
    comment: "Absolutely loved the ambiance here! The lavender latte was perfectly balanced - not too sweet, with a subtle floral note. Their avocado toast with poached eggs is a must-try. The service was attentive without being intrusive. Will definitely be coming back!",
    tags: ["Cafe", "Coffee", "Brunch", "Seattle"],
    views: 8921,
    comments: 45,
    createdAt: "3 days ago",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "3",
    title: "5-Minute Matcha Latte at Home",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80",
    author: { name: "Emma Liu", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
    likes: 4521,
    category: "Recipe",
    aspectRatio: "short",
    description: "Skip the coffee shop and make this cafe-quality matcha latte at home! All you need is good quality matcha, hot water, your milk of choice, and a frother.",
    time: "5 min",
    difficulty: "Easy",
    rating: 4.8,
    ingredients: ["1 tsp ceremonial grade matcha", "2 oz hot water (175°F)", "6 oz oat milk", "1 tsp honey or maple syrup", "Ice (optional)"],
    instructions: ["Sift matcha into bowl to remove clumps", "Add hot water and whisk in W motion until frothy", "Heat and froth milk", "Pour matcha over ice, add sweetener, top with milk"],
    tags: ["Drinks", "Matcha", "Quick", "Vegetarian"],
    views: 28456,
    comments: 156,
    createdAt: "5 days ago",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "4",
    title: "Weekend Brunch Spots You Need to Try This Spring",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    author: { name: "Alex Wong", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
    likes: 892,
    category: "Lifestyle",
    aspectRatio: "tall",
    description: "Spring is here and it's the perfect time to explore new brunch spots! I've rounded up my top 5 favorite places that offer everything from classic eggs Benedict to innovative fusion dishes.",
    tags: ["Brunch", "Spring", "Food Guide", "Weekend"],
    views: 5234,
    comments: 23,
    createdAt: "1 week ago",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "5",
    title: "The Art of Japanese Cheesecake",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    author: { name: "Yuki Tanaka", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" },
    likes: 3156,
    category: "Recipe",
    aspectRatio: "medium",
    description: "Light, fluffy, and cloud-like! This Japanese cheesecake recipe has been passed down in my family for generations. The secret is folding the meringue just right.",
    time: "1.5h",
    difficulty: "Medium",
    rating: 4.7,
    ingredients: ["250g cream cheese", "50g butter", "100ml milk", "60g cake flour", "20g cornstarch", "6 eggs separated", "140g sugar", "1 tsp lemon juice"],
    instructions: ["Melt cream cheese, butter, milk together", "Whisk egg yolks into mixture", "Sift flour and cornstarch, fold in", "Beat egg whites with sugar to stiff peaks", "Fold meringue gently into batter", "Bake in water bath at 320°F for 70 min"],
    tags: ["Dessert", "Japanese", "Baking", "Cheesecake"],
    views: 18765,
    comments: 124,
    createdAt: "1 week ago",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "6",
    title: "Morning Routine for Productivity",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    author: { name: "Jordan Lee", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
    likes: 1567,
    category: "Lifestyle",
    aspectRatio: "short",
    description: "Start your day right with this science-backed morning routine. Includes meditation, journaling, and the perfect breakfast to fuel your brain.",
    tags: ["Wellness", "Productivity", "Morning Routine", "Self Care"],
    views: 9845,
    comments: 67,
    createdAt: "2 weeks ago",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "7",
    title: "Homemade Pasta from Scratch",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    author: { name: "Marco Rossi", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" },
    likes: 5234,
    category: "Recipe",
    aspectRatio: "tall",
    description: "Nothing beats fresh homemade pasta! With just 2 ingredients and some patience, you'll have silky smooth pasta that rivals any Italian trattoria.",
    time: "45 min",
    difficulty: "Medium",
    rating: 4.9,
    ingredients: ["400g 00 flour", "4 large eggs", "Pinch of salt", "Semolina for dusting"],
    instructions: ["Mound flour on counter, create well in center", "Crack eggs into well, whisk with fork", "Gradually incorporate flour from edges", "Knead for 10 min until smooth and elastic", "Rest dough wrapped for 30 min", "Roll and cut into desired shape"],
    tags: ["Italian", "Pasta", "Homemade", "Traditional"],
    views: 32156,
    comments: 234,
    createdAt: "2 weeks ago",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "8",
    title: "Best Plant-Based Restaurants in NYC",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    author: { name: "Olivia Green", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80" },
    likes: 2891,
    category: "Review",
    aspectRatio: "medium",
    restaurant: "Multiple Locations",
    location: "New York City",
    rating: 4.6,
    comment: "New York's plant-based scene has exploded! From fast-casual spots like By Chloe to fine dining at Eleven Madison Park's plant-based tasting menu, there's something for every budget and occasion. My personal favorite is Champs Diner in Brooklyn - their vegan milkshakes are unreal!",
    tags: ["Vegan", "NYC", "Restaurant Guide", "Plant Based"],
    views: 14567,
    comments: 89,
    createdAt: "3 weeks ago",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "9",
    title: "Classic French Croissants Recipe",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    author: { name: "Pierre Dubois", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80" },
    likes: 4123,
    category: "Recipe",
    aspectRatio: "short",
    description: "Buttery, flaky, and absolutely divine! Making croissants is a labor of love, but the results are worth every minute.",
    time: "3 days",
    difficulty: "Hard",
    rating: 4.8,
    ingredients: ["500g bread flour", "60g sugar", "10g salt", "15g instant yeast", "250ml cold milk", "250g cold butter (for lamination)"],
    instructions: ["Make dough, refrigerate overnight", "Prepare butter block", "Encase butter, fold and turn 3 times", "Rest 1 hour between each fold", "Shape croissants, proof 3 hours", "Egg wash and bake at 400°F for 20 min"],
    tags: ["French", "Pastry", "Breakfast", "Baking"],
    views: 25432,
    comments: 178,
    createdAt: "1 month ago",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "10",
    title: "Mindful Eating: A Journey to Better Health",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    author: { name: "Nina Patel", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" },
    likes: 1245,
    category: "Lifestyle",
    aspectRatio: "tall",
    description: "Mindful eating isn't about restriction - it's about truly experiencing and enjoying your food. Here's how I transformed my relationship with eating.",
    tags: ["Mindfulness", "Wellness", "Healthy Living", "Mental Health"],
    views: 7654,
    comments: 56,
    createdAt: "1 month ago",
    isLiked: false,
    isSaved: false,
  },
]

const getDifficultyColor = (difficulty: string) => {
  if (difficulty === "Easy") return "bg-green-100 text-green-700"
  if (difficulty === "Medium") return "bg-yellow-100 text-yellow-700"
  return "bg-red-100 text-red-700"
}

export function MasonryFeed() {
  const [posts, setPosts] = useState<DetailedPost[]>(samplePosts)
  const [selectedPost, setSelectedPost] = useState<DetailedPost | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "ingredients" | "instructions">("details")
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Split posts into two columns for masonry effect
  const leftColumn = posts.filter((_, i) => i % 2 === 0)
  const rightColumn = posts.filter((_, i) => i % 2 === 1)

  const handleLike = () => {
    if (!selectedPost) return
    setIsLiked(!isLiked)
    setPosts(prev => prev.map(p =>
      p.id === selectedPost.id
        ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    ))
  }

  const handleSave = () => setIsSaved(!isSaved)

  const handleCloseProfileFromExplore = () => {
    setIsProfileOpen(false)
    setIsCommentsOpen(false)
    setSelectedPost(null)
  }

  const formatLikes = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return n.toString()
  }

  return (
    <>
      <div className="px-2 sm:px-3 py-3 sm:py-4">
        <div className="flex gap-2 sm:gap-3">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-2 sm:gap-3 min-w-0">
            {leftColumn.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                onClick={() => {
                  setSelectedPost(post)
                  setIsLiked(post.isLiked || false)
                  setIsSaved(post.isSaved || false)
                  setActiveTab(post.category === "Recipe" ? "details" : "details")
                }}
              />
            ))}
          </div>

          {/* Right Column - offset for staggered effect */}
          <div className="flex-1 flex flex-col gap-2 sm:gap-3 pt-6 sm:pt-8 min-w-0">
            {rightColumn.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                onClick={() => {
                  setSelectedPost(post)
                  setIsLiked(post.isLiked || false)
                  setIsSaved(post.isSaved || false)
                  setActiveTab(post.category === "Recipe" ? "details" : "details")
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          POST DETAIL MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] bg-background overflow-y-auto animate-in slide-in-from-bottom duration-300">
          {/* Sticky Header */}
          <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border/50">
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <span className="font-semibold text-sm text-foreground">
              {selectedPost.category}
            </span>
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <MoreHorizontal className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Hero Image */}
          <div className="relative w-full aspect-[4/3]">
            <Image
              src={selectedPost.image}
              alt={selectedPost.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground">
                {selectedPost.category}
              </span>
            </div>

            {/* Floating Stats */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Eye className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-medium">{formatLikes(selectedPost.views || 0)}</span>
                </div>
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-medium">{selectedPost.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-4">
            {/* Title & Author */}
            <h1 className="text-xl font-bold text-foreground leading-tight mb-3">
              {selectedPost.title}
            </h1>

            {/* Author Row */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <Image
                    src={selectedPost.author.avatar}
                    alt={selectedPost.author.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-foreground">{selectedPost.author.name}</p>
                  <p className="text-xs text-muted-foreground">@{selectedPost.author.name.toLowerCase().replace(" ", "")}</p>
                </div>
              </button>
              <button className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                Follow
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between py-3 border-y border-border/50 mb-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={handleLike}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors",
                    isLiked ? "bg-red-50 text-red-500" : "hover:bg-muted text-foreground"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                  <span className="text-sm font-medium">{formatLikes(selectedPost.likes)}</span>
                </button>
                <button
                  onClick={() => setIsCommentsOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-muted transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-foreground" />
                  <span className="text-sm font-medium text-foreground">{selectedPost.comments}</span>
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSave}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isSaved ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                  )}
                >
                  <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
                </button>
                <button className="p-2 rounded-full hover:bg-muted transition-colors">
                  <Share2 className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            {/* Recipe-specific tabs */}
            {selectedPost.category === "Recipe" && (
              <div className="flex gap-1 mb-4 bg-muted p-1 rounded-xl">
                {["details", "ingredients", "instructions"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      "flex-1 py-2 px-2 rounded-lg text-xs font-medium capitalize transition-colors",
                      activeTab === tab
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}

            {/* Content based on category */}
            {selectedPost.category === "Recipe" ? (
              <>
                {activeTab === "details" && (
                  <div className="space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-muted/50 rounded-xl p-3 text-center">
                        <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-sm font-semibold text-foreground">{selectedPost.time}</p>
                        <p className="text-xs text-muted-foreground">Time</p>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-3 text-center">
                        <Star className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-sm font-semibold text-foreground">{selectedPost.rating}</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                      <div className={cn("rounded-xl p-3 text-center", getDifficultyColor(selectedPost.difficulty || "Medium"))}>
                        <ChefHat className="w-4 h-4 mx-auto mb-1" />
                        <p className="text-sm font-semibold">{selectedPost.difficulty}</p>
                        <p className="text-xs opacity-70">Level</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-foreground leading-relaxed">
                      {selectedPost.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags?.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "ingredients" && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-primary" />
                      Ingredients
                    </h3>
                    <div className="grid gap-2">
                      {selectedPost.ingredients?.map((ingredient, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-sm text-foreground">{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "instructions" && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Instructions</h3>
                    <div className="space-y-3">
                      {selectedPost.instructions?.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-sm text-foreground leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : selectedPost.category === "Review" ? (
              <div className="space-y-4">
                {/* Restaurant Info */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{selectedPost.restaurant}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs">{selectedPost.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < (selectedPost.rating || 0) ? "text-primary fill-primary" : "text-muted"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <MessageCircle className="w-5 h-5 text-yellow-600 mb-2" />
                  <p className="text-sm text-foreground leading-relaxed italic">
                    "{selectedPost.comment}"
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags?.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              /* Lifestyle */
              <div className="space-y-4">
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedPost.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags?.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Engagement Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
                    <p className="text-sm font-semibold text-foreground">{formatLikes(selectedPost.likes)}</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </div>
                  <div className="text-center">
                    <MessageCircle className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-sm font-semibold text-foreground">{selectedPost.comments}</p>
                    <p className="text-xs text-muted-foreground">Comments</p>
                  </div>
                  <div className="text-center">
                    <Share2 className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <p className="text-sm font-semibold text-foreground">Share</p>
                    <p className="text-xs text-muted-foreground">Spread</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer spacing */}
          <div className="h-6" />
        </div>
      )}

      {/* Comments Modal */}
      <Comments
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        postId={selectedPost?.id}
        postTitle={selectedPost?.title}
        postImage={selectedPost?.image}
        postAuthor={selectedPost?.author}
        initialComments={selectedPost?.comments}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={handleCloseProfileFromExplore}
        user={selectedPost ? {
          id: selectedPost.id,
          name: selectedPost.author.name,
          username: selectedPost.author.name.toLowerCase().replace(/\s+/g, ""),
          avatar: selectedPost.author.avatar,
          followers: 12500,
          following: 890,
          posts: 342
        } : undefined}
      />
    </>
  )
}
