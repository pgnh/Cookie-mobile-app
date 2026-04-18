// @ts-nocheck
"use client"

import { useState } from "react"
import Image from "next/image"
import { UserProfile } from "./user-profile"
import { X, Bell, Heart, MessageCircle, UserPlus, ChefHat, CheckCheck, Clock, Trash2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { createBrowserClient } from "@/lib/supabase"
import { useEffect } from "react"
import { formatDistanceToNow } from "date-fns"

interface NotificationsProps {
  isOpen: boolean
  onClose: () => void
}

type NotificationType = "like" | "comment" | "follow" | "recipe" | "mention"
type FilterType = "all" | "likes" | "comments" | "follows"

interface Notification {
  id: string
  type: NotificationType
  user: {
    name: string
    avatar: string
    username: string
  }
  content: string
  target?: string
  timestamp: string
  read: boolean
  image?: string
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    user: {
      name: "Sarah Miller",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      username: "sarahm"
    },
    content: "liked your recipe",
    target: "Fluffy Japanese Souffle Pancakes",
    timestamp: "2m ago",
    read: false,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop"
  },
  {
    id: "2",
    type: "comment",
    user: {
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      username: "mikechen"
    },
    content: "commented on your review",
    target: "\"The pasta was absolutely amazing! 🍝\"",
    timestamp: "15m ago",
    read: false
  },
  {
    id: "3",
    type: "follow",
    user: {
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      username: "emmaw"
    },
    content: "started following you",
    timestamp: "1h ago",
    read: false
  },
  {
    id: "4",
    type: "recipe",
    user: {
      name: "Chef Marco",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      username: "chefmarco"
    },
    content: "shared a new recipe",
    target: "Creamy Tuscan Garlic Chicken",
    timestamp: "3h ago",
    read: true,
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200&h=200&fit=crop"
  },
  {
    id: "5",
    type: "mention",
    user: {
      name: "Jessica Park",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      username: "jesspark"
    },
    content: "mentioned you in a comment",
    target: "\"@alexthompson you should try this! \"",
    timestamp: "5h ago",
    read: true
  },
  {
    id: "6",
    type: "like",
    user: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      username: "davidk"
    },
    content: "liked your photo",
    timestamp: "1d ago",
    read: true,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop"
  },
  {
    id: "7",
    type: "follow",
    user: {
      name: "Sophie Laurent",
      avatar: "https://images.unsplash.com/photo-1489424731084-64d2c1f5f8f9?w=100&h=100&fit=crop",
      username: "sophiel"
    },
    content: "started following you",
    timestamp: "2d ago",
    read: true
  }
]

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "like":
      return <Heart className="w-4 h-4 text-red-500 fill-red-500" />
    case "comment":
      return <MessageCircle className="w-4 h-4 text-blue-500" />
    case "follow":
      return <UserPlus className="w-4 h-4 text-green-500" />
    case "recipe":
      return <ChefHat className="w-4 h-4 text-primary" />
    case "mention":
      return <MessageCircle className="w-4 h-4 text-purple-500" />
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />
  }
}

const getNotificationBg = (type: NotificationType) => {
  switch (type) {
    case "like":
      return "bg-red-50"
    case "comment":
      return "bg-blue-50"
    case "follow":
      return "bg-green-50"
    case "recipe":
      return "bg-yellow-50"
    case "mention":
      return "bg-purple-50"
    default:
      return "bg-muted"
  }
}

export function Notifications({ isOpen, onClose }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [selectedUser, setSelectedUser] = useState<Notification["user"] | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from<any, any>('')
        .select(`
          *,
          actor:actor_id(id, full_name, username, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setNotifications(data.map((n: any) => ({
        id: n.id,
        type: n.type,
        user: {
          name: n.actor.full_name,
          username: n.actor.username,
          avatar: n.actor.avatar_url
        },
        content: getNotificationText(n.type),
        timestamp: formatDistanceToNow(new Date(n.created_at), { addSuffix: true }),
        read: n.is_read
      })))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationText = (type: string) => {
    switch (type) {
      case 'like': return 'liked your content'
      case 'comment': return 'commented on your post'
      case 'follow': return 'started following you'
      case 'mention': return 'mentioned you'
      case 'recipe_share': return 'shared a recipe with you'
      default: return 'sent you a notification'
    }
  }

  if (!isOpen) return null

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "all") return true
    if (activeFilter === "likes") return n.type === "like"
    if (activeFilter === "comments") return n.type === "comment" || n.type === "mention"
    if (activeFilter === "follows") return n.type === "follow"
    return true
  })

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filters: { label: string; value: FilterType; count?: number }[] = [
    { label: "All", value: "all" },
    { label: "Likes", value: "likes" },
    { label: "Comments", value: "comments" },
    { label: "Follows", value: "follows" }
  ]

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-md border-b border-border/50">
        <button
          onClick={onClose}
          className="flex items-center gap-1 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-foreground" />
          <h2 className="font-semibold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllAsRead}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            title="Mark all as read"
          >
            <CheckCheck className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">No notifications</p>
            <p className="text-muted-foreground text-sm text-center">
              When someone likes, comments, or follows you, you'll see it here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "flex items-start gap-3 px-4 py-4 transition-colors cursor-pointer",
                  notification.read ? "bg-background" : "bg-primary/5",
                  "hover:bg-muted/50"
                )}
              >
                {/* Avatar with Icon */}
                <button
                  onClick={() => {
                    setSelectedUser(notification.user)
                    setIsProfileOpen(true)
                  }}
                  className="relative flex-shrink-0 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={notification.user.avatar}
                      alt={notification.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
                    getNotificationBg(notification.type)
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <button
                      onClick={() => {
                        setSelectedUser(notification.user)
                        setIsProfileOpen(true)
                      }}
                      className="font-bold hover:underline"
                    >
                      {notification.user.name}
                    </button>{" "}
                    <span className="text-muted-foreground">@{notification.user.username}</span>{" "}
                    <span>{notification.content}</span>
                    {notification.target && (
                      <span className="font-medium text-primary"> {notification.target}</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>

                {/* Image (if any) */}
                {notification.image && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={notification.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Actions */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(notification.id)
                  }}
                  className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 left-0 right-0 px-4 py-3 bg-background border-t border-border/50 pb-safe">
        <button className="w-full py-3 rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">
          View Notification Settings
        </button>
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
          followers: 8900,
          following: 650,
          posts: 234
        } : undefined}
      />
    </div>
  )
}
