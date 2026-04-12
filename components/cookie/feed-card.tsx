"use client"

import Image from "next/image"
import { Heart, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FeedPost {
  id: string
  title: string
  image: string
  author: {
    name: string
    avatar: string
  }
  likes: number
  category: string
  aspectRatio: "tall" | "medium" | "short"
}

interface FeedCardProps {
  post: FeedPost
  className?: string
}

const aspectRatioClasses = {
  tall: "aspect-[3/4]",
  medium: "aspect-[4/5]",
  short: "aspect-square",
}

export function FeedCard({ post, className }: FeedCardProps) {
  return (
    <article 
      className={cn(
        "group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300",
        className
      )}
    >
      {/* Image Container */}
      <div className={cn(
        "relative w-full overflow-hidden",
        aspectRatioClasses[post.aspectRatio]
      )}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
            {post.category}
          </span>
        </div>

        {/* Bookmark Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <Bookmark className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2 mb-2.5">
          {post.title}
        </h3>
        
        {/* Author & Engagement */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full overflow-hidden relative bg-muted">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium truncate max-w-[80px]">
              {post.author.name}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              {post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
