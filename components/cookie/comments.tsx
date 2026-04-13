"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { UserProfile } from "./user-profile"
import {
  X, Heart, MessageCircle, Send, MoreHorizontal, ArrowLeft,
  Bookmark, Share2, Flag, Trash2, CornerDownRight
} from "lucide-react"

interface CommentsProps {
  isOpen: boolean
  onClose: () => void
  postId?: string
  postTitle?: string
  postImage?: string
  postAuthor?: {
    name: string
    avatar: string
  }
  initialComments?: number
}

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
    username: string
  }
  content: string
  timestamp: string
  likes: number
  replies?: Comment[]
  isLiked?: boolean
  isReply?: boolean
}

// Mock comments data generator
const generateMockComments = (postId: string): Comment[] => [
  {
    id: "c1",
    user: {
      name: "Jessica Park",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
      username: "jesspark"
    },
    content: "This looks absolutely amazing! I can't wait to try this recipe this weekend. Thanks for sharing! 🍰",
    timestamp: "2h ago",
    likes: 24,
    isLiked: false,
    replies: [
      {
        id: "c1r1",
        user: {
          name: "Yuki Tanaka",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
          username: "yukitanaka"
        },
        content: "Let me know how it turns out! I'd love to see your creation 💕",
        timestamp: "1h ago",
        likes: 8,
        isLiked: false,
        isReply: true
      }
    ]
  },
  {
    id: "c2",
    user: {
      name: "Marco Rossi",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
      username: "marcorossi"
    },
    content: "The secret to the perfect fluffy texture is definitely in the meringue folding technique. Great tips! 👨‍🍳",
    timestamp: "5h ago",
    likes: 45,
    isLiked: true,
    replies: []
  },
  {
    id: "c3",
    user: {
      name: "Sarah Baker",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      username: "sarahbakes"
    },
    content: "Can I substitute the cream cheese with mascarpone? Would that work?",
    timestamp: "1d ago",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: "c3r1",
        user: {
          name: "Yuki Tanaka",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
          username: "yukitanaka"
        },
        content: "Yes! Mascarpone will give it an even richer flavor. Just use the same amount 😊",
        timestamp: "20h ago",
        likes: 6,
        isLiked: false,
        isReply: true
      },
      {
        id: "c3r2",
        user: {
          name: "Emma Liu",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
          username: "emmaliu"
        },
        content: "I tried with mascarpone last week and it was incredible!",
        timestamp: "18h ago",
        likes: 4,
        isLiked: false,
        isReply: true
      }
    ]
  },
  {
    id: "c4",
    user: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
      username: "davidkim"
    },
    content: "Beautiful presentation! This would be perfect for afternoon tea ☕️🍰",
    timestamp: "2d ago",
    likes: 32,
    isLiked: false,
    replies: []
  },
  {
    id: "c5",
    user: {
      name: "Olivia Green",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80",
      username: "oliviagreen"
    },
    content: "Saved this for later! The step-by-step photos really help 📸",
    timestamp: "3d ago",
    likes: 18,
    isLiked: true,
    replies: []
  }
]

export function Comments({
  isOpen,
  onClose,
  postId = "1",
  postTitle = "The Art of Japanese Cheesecake",
  postImage = "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
  postAuthor = { name: "Yuki Tanaka", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" },
  initialComments = 124
}: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(() => generateMockComments(postId))
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
  const [showOptions, setShowOptions] = useState<string | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{ name: string; avatar: string; username: string } | null>(null)

  if (!isOpen) return null

  const handleUserClick = (user: { name: string; avatar: string; username: string }) => {
    setSelectedUser(user)
    setIsProfileOpen(true)
  }

  const handleLike = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: likedComments.has(commentId) ? comment.likes - 1 : comment.likes + 1 }
      }
      // Check replies
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === commentId
              ? { ...reply, likes: likedComments.has(commentId) ? reply.likes - 1 : reply.likes + 1 }
              : reply
          )
        }
      }
      return comment
    }))
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `new-${Date.now()}`,
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
        username: "you"
      },
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
      replies: []
    }

    setComments(prev => [comment, ...prev])
    setNewComment("")
  }

  const handleSubmitReply = (parentId: string) => {
    if (!replyText.trim()) return

    const reply: Comment = {
      id: `reply-${Date.now()}`,
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
        username: "you"
      },
      content: replyText,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
      isReply: true
    }

    setComments(prev => prev.map(comment =>
      comment.id === parentId
        ? { ...comment, replies: [...(comment.replies || []), reply] }
        : comment
    ))

    setReplyText("")
    setReplyingTo(null)
  }

  const totalComments = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border/50">
        <button
          onClick={onClose}
          className="flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-foreground" />
          <h2 className="font-semibold text-foreground">Comments</h2>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
            {totalComments}
          </span>
        </div>
        <button className="p-2 rounded-full hover:bg-muted transition-colors">
          <Share2 className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Post Preview Card */}
      <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex gap-3">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={postImage}
              alt={postTitle}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
              {postTitle}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full overflow-hidden">
                <Image
                  src={postAuthor.avatar}
                  alt={postAuthor.name}
                  width={20}
                  height={20}
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-muted-foreground">{postAuthor.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleUserClick(comment.user)}
                  className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUserClick(comment.user)}
                        className="font-semibold text-sm text-foreground hover:underline"
                      >
                        {comment.user.name}
                      </button>
                      <span className="text-xs text-muted-foreground">@{comment.user.username}</span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowOptions(showOptions === comment.id ? null : comment.id)}
                        className="p-1 rounded-full hover:bg-muted transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                      {showOptions === comment.id && (
                        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[120px] z-10">
                          <button className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted flex items-center gap-2">
                            <Flag className="w-3.5 h-3.5" />
                            Report
                          </button>
                          <button className="w-full px-3 py-2 text-left text-xs text-destructive hover:bg-destructive/10 flex items-center gap-2">
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-foreground mt-1 leading-relaxed">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={cn(
                        "flex items-center gap-1 text-xs transition-colors",
                        likedComments.has(comment.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                      )}
                    >
                      <Heart className={cn("w-3.5 h-3.5", likedComments.has(comment.id) && "fill-current")} />
                      <span>{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* Reply Input */}
              {replyingTo === comment.id && (
                <div className="flex gap-3 ml-12">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                      alt="You"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.user.name}...`}
                      className="flex-1 px-3 py-2 text-sm bg-muted rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleSubmitReply(comment.id)}
                    />
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyText.trim()}
                      className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-3 ml-12">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <button
                        onClick={() => handleUserClick(reply.user)}
                        className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
                      >
                        <Image
                          src={reply.user.avatar}
                          alt={reply.user.name}
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUserClick(reply.user)}
                            className="font-semibold text-sm text-foreground hover:underline"
                          >
                            {reply.user.name}
                          </button>
                          <span className="text-xs text-muted-foreground">@{reply.user.username}</span>
                        </div>
                        <p className="text-sm text-foreground mt-0.5 leading-relaxed">
                          {reply.content}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                          <button
                            onClick={() => handleLike(reply.id)}
                            className={cn(
                              "flex items-center gap-1 text-xs transition-colors",
                              likedComments.has(reply.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                            )}
                          >
                            <Heart className={cn("w-3 h-3", likedComments.has(reply.id) && "fill-current")} />
                            <span>{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Spacing for input */}
        <div className="h-20" />
      </div>

      {/* Comment Input - Fixed Bottom */}
      <div className="sticky bottom-0 left-0 right-0 px-4 py-3 bg-background border-t border-border/50 pb-safe">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
              alt="You"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-full px-3 py-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
            />
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className={cn(
                "p-1.5 rounded-full transition-colors",
                newComment.trim() ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedUser ? {
          id: selectedUser.username,
          name: selectedUser.name,
          username: selectedUser.username,
          avatar: selectedUser.avatar,
          followers: 3400,
          following: 520,
          posts: 128
        } : undefined}
      />
    </div>
  )
}
