"use client"

import { useState } from "react"
import Image from "next/image"
import { Comments } from "./comments"
import { UserProfile } from "./user-profile"
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  Star,
  MapPin,
  Verified,
  Flame,
  ImageIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  author: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  content: string
  images?: string[]
  dish?: {
    name: string
    restaurant?: string
    location?: string
    rating: number
  }
  timestamp: string
  likes: number
  comments: number
  reposts: number
  liked: boolean
  reposted: boolean
}

const sampleReviews: Review[] = [
  {
    id: "1",
    author: {
      name: "Foodie Sarah",
      username: "sarahfoodie",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      verified: true
    },
    content: "This ramen is absolutely INSANE. The broth has been simmered for 18 hours and you can taste every minute of it. The chashu melts in your mouth. 10/10 would wait 2 hours in line again.",
    images: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop"],
    dish: {
      name: "Tonkotsu Ramen",
      restaurant: "Ichiran Ramen",
      location: "Tokyo, Japan",
      rating: 5
    },
    timestamp: "2h",
    likes: 1243,
    comments: 89,
    reposts: 234,
    liked: false,
    reposted: false
  },
  {
    id: "2",
    author: {
      name: "Chef Mike",
      username: "chefmike_official",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      verified: true
    },
    content: "Made my grandmother's pasta recipe today. Some dishes just hit different when they carry generations of love. The secret? Fresh pasta, slow-cooked tomato sauce, and a whole lot of patience.",
    images: [
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&h=400&fit=crop"
    ],
    dish: {
      name: "Homemade Pasta",
      rating: 5
    },
    timestamp: "4h",
    likes: 3421,
    comments: 156,
    reposts: 567,
    liked: true,
    reposted: false
  },
  {
    id: "3",
    author: {
      name: "Tasting Tales",
      username: "tastingtales",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      verified: false
    },
    content: "Unpopular opinion: Street food > Fine dining. This $3 taco from a food truck just changed my life. Sometimes the best meals come from the most unexpected places.",
    images: ["https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop"],
    dish: {
      name: "Street Tacos",
      location: "Mexico City",
      rating: 5
    },
    timestamp: "6h",
    likes: 892,
    comments: 234,
    reposts: 123,
    liked: false,
    reposted: true
  },
  {
    id: "4",
    author: {
      name: "Dessert Queen",
      username: "dessertqueen",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      verified: true
    },
    content: "PSA: This croissant is flaky, buttery perfection. I've tried croissants in Paris, Vienna, and NYC - this one in a tiny bakery in Lisbon tops them all. The layers are UNREAL.",
    images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop"],
    dish: {
      name: "Butter Croissant",
      restaurant: "Pastelaria Versailles",
      location: "Lisbon, Portugal",
      rating: 5
    },
    timestamp: "8h",
    likes: 2156,
    comments: 98,
    reposts: 345,
    liked: false,
    reposted: false
  },
  {
    id: "5",
    author: {
      name: "Spice Hunter",
      username: "spicehunter",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      verified: false
    },
    content: "Tried the Carolina Reaper challenge today. My mouth is on fire but my soul is happy. Would I do it again? Absolutely. Do I regret it? Also yes.",
    dish: {
      name: "Carolina Reaper Wings",
      restaurant: "Hot Ones Challenge Bar",
      rating: 4
    },
    timestamp: "12h",
    likes: 567,
    comments: 189,
    reposts: 78,
    liked: false,
    reposted: false
  }
]

function ReviewCard({
  review,
  onLike,
  onRepost,
  onComment,
  onUserClick
}: {
  review: Review
  onLike: (id: string) => void
  onRepost: (id: string) => void
  onComment: (review: Review) => void
  onUserClick: (review: Review) => void
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  const handleUserClick = () => {
    onUserClick(review)
  }

  return (
    <article className="px-4 py-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <button
          onClick={handleUserClick}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden">
            <Image
              src={review.author.avatar}
              alt={review.author.name}
              fill
              className="object-cover"
            />
          </div>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1 min-w-0">
              <button
                onClick={handleUserClick}
                className="font-bold text-sm text-foreground truncate hover:underline"
              >
                {review.author.name}
              </button>
              {review.author.verified && (
                <Verified className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" />
              )}
              <span className="text-sm text-muted-foreground truncate">
                @{review.author.username}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground flex-shrink-0">
                {review.timestamp}
              </span>
            </div>
            <button className="p-1 hover:bg-muted rounded-full transition-colors flex-shrink-0">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Review text */}
          <p className="text-sm sm:text-[15px] text-foreground leading-relaxed mb-3 whitespace-pre-wrap">
            {review.content}
          </p>

          {/* Dish info card */}
          {review.dish && (
            <div className="bg-muted/50 rounded-2xl p-3 mb-3 border border-border/50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      {review.dish.name}
                    </span>
                    {review.dish.rating === 5 && (
                      <Flame className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  {review.dish.restaurant && (
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {review.dish.restaurant}
                    </p>
                  )}
                  {review.dish.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{review.dish.location}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {Array.from({ length: review.dish.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Images */}
          {review.images && review.images.length > 0 && (
            <div className={cn(
              "rounded-2xl overflow-hidden mb-3 border border-border/50",
              review.images.length === 1 ? "aspect-[4/3]" : "grid grid-cols-2 gap-0.5"
            )}>
              {review.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "relative overflow-hidden",
                    review.images!.length === 1 ? "w-full h-full" : "aspect-square"
                  )}
                >
                  <Image
                    src={img}
                    alt={`Review image ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between max-w-xs">
            <button
              onClick={() => onComment(review)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-blue-500 transition-colors group"
            >
              <div className="p-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs">{formatNumber(review.comments)}</span>
            </button>

            <button 
              onClick={() => onRepost(review.id)}
              className={cn(
                "flex items-center gap-1.5 transition-colors group",
                review.reposted ? "text-green-500" : "text-muted-foreground hover:text-green-500"
              )}
            >
              <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{formatNumber(review.reposts)}</span>
            </button>

            <button 
              onClick={() => onLike(review.id)}
              className={cn(
                "flex items-center gap-1.5 transition-colors group",
                review.liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              )}
            >
              <div className="p-1.5 rounded-full group-hover:bg-red-500/10 transition-colors">
                <Heart className={cn("w-4 h-4", review.liked && "fill-current")} />
              </div>
              <span className="text-xs">{formatNumber(review.likes)}</span>
            </button>

            <button className="flex items-center text-muted-foreground hover:text-primary transition-colors group">
              <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                <Share className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ReviewsFeed() {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews)
  const [isComposing, setIsComposing] = useState(false)
  const [newReview, setNewReview] = useState("")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Review | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLike = (id: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === id) {
        return {
          ...review,
          liked: !review.liked,
          likes: review.liked ? review.likes - 1 : review.likes + 1
        }
      }
      return review
    }))
  }

  const handleRepost = (id: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === id) {
        return {
          ...review,
          reposted: !review.reposted,
          reposts: review.reposted ? review.reposts - 1 : review.reposts + 1
        }
      }
      return review
    }))
  }

  const handlePost = () => {
    if (!newReview.trim()) return

    const newReviewObj: Review = {
      id: Date.now().toString(),
      author: {
        name: "You",
        username: "cookieuser",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        verified: false
      },
      content: newReview,
      timestamp: "now",
      likes: 0,
      comments: 0,
      reposts: 0,
      liked: false,
      reposted: false
    }

    setReviews(prev => [newReviewObj, ...prev])
    setNewReview("")
    setIsComposing(false)
  }

  const handleComment = (review: Review) => {
    setSelectedReview(review)
    setIsCommentsOpen(true)
  }

  const handleUserClick = (review: Review) => {
    setSelectedUser(review)
    setIsProfileOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Compose area */}
      <div className="px-4 py-3 border-b border-border/50 bg-background sticky top-16 z-40">
        {isComposing ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                  alt="Your avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Share your food experience..."
                className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground min-h-[80px]"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-between">
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <ImageIcon className="w-5 h-5 text-primary" />
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setIsComposing(false)
                    setNewReview("")
                  }}
                  className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePost}
                  disabled={!newReview.trim()}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
                    newReview.trim()
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsComposing(true)}
            className="w-full flex items-center gap-3 text-left"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                alt="Your avatar"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              Share your food experience...
            </span>
          </button>
        )}
      </div>

      {/* Reviews list */}
      <div className="bg-background">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onLike={handleLike}
            onRepost={handleRepost}
            onComment={handleComment}
            onUserClick={handleUserClick}
          />
        ))}
      </div>

      {/* Comments Modal */}
      <Comments
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        postId={selectedReview?.id}
        postTitle={selectedReview?.content?.slice(0, 100) + "..."}
        postImage={selectedReview?.images?.[0]}
        postAuthor={selectedReview?.author ? { name: selectedReview.author.name, avatar: selectedReview.author.avatar } : undefined}
        initialComments={selectedReview?.comments}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedUser ? {
          id: selectedUser.id,
          name: selectedUser.author.name,
          username: selectedUser.author.username,
          avatar: selectedUser.author.avatar,
          followers: 12500,
          following: 890,
          posts: 342,
          isVerified: selectedUser.author.verified
        } : undefined}
      />
    </div>
  )
}
