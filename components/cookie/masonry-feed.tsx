"use client"

import { FeedCard, type FeedPost } from "./feed-card"

const samplePosts: FeedPost[] = [
  {
    id: "1",
    title: "Perfect Sourdough Bread - A Complete Guide for Beginners",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    author: { name: "Sarah Baker", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
    likes: 2340,
    category: "Recipe",
    aspectRatio: "tall",
  },
  {
    id: "2",
    title: "Cozy Cafe Review: Hidden Gem in Downtown",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    author: { name: "Mike Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
    likes: 1823,
    category: "Review",
    aspectRatio: "medium",
  },
  {
    id: "3",
    title: "5-Minute Matcha Latte at Home",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80",
    author: { name: "Emma Liu", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
    likes: 4521,
    category: "Recipe",
    aspectRatio: "short",
  },
  {
    id: "4",
    title: "Weekend Brunch Spots You Need to Try This Spring",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    author: { name: "Alex Wong", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
    likes: 892,
    category: "Lifestyle",
    aspectRatio: "tall",
  },
  {
    id: "5",
    title: "The Art of Japanese Cheesecake",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    author: { name: "Yuki Tanaka", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" },
    likes: 3156,
    category: "Recipe",
    aspectRatio: "medium",
  },
  {
    id: "6",
    title: "Morning Routine for Productivity",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    author: { name: "Jordan Lee", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
    likes: 1567,
    category: "Lifestyle",
    aspectRatio: "short",
  },
  {
    id: "7",
    title: "Homemade Pasta from Scratch",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    author: { name: "Marco Rossi", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" },
    likes: 5234,
    category: "Recipe",
    aspectRatio: "tall",
  },
  {
    id: "8",
    title: "Best Plant-Based Restaurants in NYC",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    author: { name: "Olivia Green", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80" },
    likes: 2891,
    category: "Review",
    aspectRatio: "medium",
  },
  {
    id: "9",
    title: "Classic French Croissants Recipe",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
    author: { name: "Pierre Dubois", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80" },
    likes: 4123,
    category: "Recipe",
    aspectRatio: "short",
  },
  {
    id: "10",
    title: "Mindful Eating: A Journey to Better Health",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    author: { name: "Nina Patel", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" },
    likes: 1245,
    category: "Lifestyle",
    aspectRatio: "tall",
  },
]

export function MasonryFeed() {
  // Split posts into two columns for masonry effect
  const leftColumn = samplePosts.filter((_, i) => i % 2 === 0)
  const rightColumn = samplePosts.filter((_, i) => i % 2 === 1)

  return (
    <div className="px-3 py-4">
      <div className="flex gap-3">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-3">
          {leftColumn.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
        
        {/* Right Column - offset for staggered effect */}
        <div className="flex-1 flex flex-col gap-3 pt-8">
          {rightColumn.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
