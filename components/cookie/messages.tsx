"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  X, ArrowLeft, Send, ImageIcon, Smile, Phone, Video,
  Search, MoreHorizontal, ChefHat, Star, Clock, CheckCheck,
  Check, Camera, Heart, Bookmark,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface Conversation {
  id: string
  user: {
    name: string
    username: string
    avatar: string
    online: boolean
  }
  lastMessage: {
    text: string
    time: string
    isMe: boolean
    read: boolean
  }
  unread: number
  type?: "recipe" | "review" | "normal"
}

interface Message {
  id: string
  text?: string
  image?: string
  recipe?: {
    title: string
    image: string
    time: string
    rating: number
  }
  isMe: boolean
  time: string
  read: boolean
  reactions?: string[]
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const conversations: Conversation[] = [
  {
    id: "1",
    user: {
      name: "Emma Liu",
      username: "emmaliu",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      online: true,
    },
    lastMessage: {
      text: "OMG you have to try this matcha latte recipe! 🍵",
      time: "2m",
      isMe: false,
      read: false,
    },
    unread: 3,
    type: "recipe",
  },
  {
    id: "2",
    user: {
      name: "James Park",
      username: "jamespark",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      online: true,
    },
    lastMessage: {
      text: "That ramen spot was absolutely incredible 🍜",
      time: "15m",
      isMe: true,
      read: true,
    },
    unread: 0,
    type: "review",
  },
  {
    id: "3",
    user: {
      name: "Sophia Laurent",
      username: "sophialaur",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      online: false,
    },
    lastMessage: {
      text: "Sent a photo 📸",
      time: "1h",
      isMe: false,
      read: true,
    },
    unread: 1,
  },
  {
    id: "4",
    user: {
      name: "Chef Mike",
      username: "chefmike_official",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
      online: false,
    },
    lastMessage: {
      text: "Shared a recipe: Homemade Pasta 🍝",
      time: "3h",
      isMe: false,
      read: true,
    },
    unread: 0,
    type: "recipe",
  },
  {
    id: "5",
    user: {
      name: "Yuki Tanaka",
      username: "yukitanaka",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      online: true,
    },
    lastMessage: {
      text: "Can't wait to make those croissants! 🥐",
      time: "5h",
      isMe: true,
      read: true,
    },
    unread: 0,
  },
  {
    id: "6",
    user: {
      name: "Marco Rossi",
      username: "marcorossi",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      online: false,
    },
    lastMessage: {
      text: "The secret is always fresh basil 🌿",
      time: "1d",
      isMe: false,
      read: true,
    },
    unread: 0,
  },
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "Hey! Did you try making that matcha latte recipe? 🍵",
      isMe: false,
      time: "10:28",
      read: true,
    },
    {
      id: "2",
      text: "Not yet! Share it with me?",
      isMe: true,
      time: "10:29",
      read: true,
    },
    {
      id: "3",
      text: "Here you go! It's literally 5 minutes 👇",
      recipe: {
        title: "5-Minute Matcha Latte",
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop",
        time: "5 min",
        rating: 4.8,
      },
      isMe: false,
      time: "10:30",
      read: true,
    },
    {
      id: "4",
      text: "This looks so good 😍 I'm making it tomorrow morning!",
      isMe: true,
      time: "10:32",
      read: true,
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop",
      isMe: false,
      time: "10:35",
      read: true,
      reactions: ["😍", "🔥"],
    },
    {
      id: "6",
      text: "My version from this morning 💛 Added a sprinkle of cinnamon on top!",
      isMe: false,
      time: "10:36",
      read: true,
    },
    {
      id: "7",
      text: "OMG you have to try this matcha latte recipe! 🍵",
      isMe: false,
      time: "10:58",
      read: false,
    },
  ],
  "2": [
    {
      id: "1",
      text: "Dude, have you been to Ichiran yet?",
      isMe: false,
      time: "Yesterday",
      read: true,
    },
    {
      id: "2",
      text: "Went last night!! The tonkotsu broth was insane 🍜",
      isMe: true,
      time: "Yesterday",
      read: true,
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
      isMe: true,
      time: "Yesterday",
      read: true,
    },
    {
      id: "4",
      text: "No way 😭 I'm so jealous",
      isMe: false,
      time: "Yesterday",
      read: true,
    },
    {
      id: "5",
      text: "That ramen spot was absolutely incredible 🍜",
      isMe: true,
      time: "15m",
      read: true,
    },
  ],
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActiveNow({ convos }: { convos: Conversation[] }) {
  const online = convos.filter((c) => c.user.online)
  return (
    <div className="px-4 py-3 border-b border-border/50">
      <p className="text-xs font-semibold text-muted-foreground mb-2.5">Active Now</p>
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
        {online.map((c) => (
          <button key={c.id} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary">
                <Image src={c.user.avatar} alt={c.user.name} width={48} height={48} className="object-cover" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[48px]">
              {c.user.name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ConversationItem({
  convo,
  onClick,
}: {
  convo: Conversation
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 active:bg-muted transition-colors"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-13 h-13 w-[52px] h-[52px] rounded-full overflow-hidden">
          <Image src={convo.user.avatar} alt={convo.user.name} width={52} height={52} className="object-cover" />
        </div>
        {convo.user.online && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-0.5">
          <span className={cn("text-sm font-semibold", convo.unread > 0 ? "text-foreground" : "text-foreground/80")}>
            {convo.user.name}
          </span>
          <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">{convo.lastMessage.time}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className={cn("text-xs truncate", convo.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
            {convo.lastMessage.isMe && (
              <span className="inline-flex mr-1">
                {convo.lastMessage.read ? (
                  <CheckCheck className="w-3 h-3 text-primary inline" />
                ) : (
                  <Check className="w-3 h-3 text-muted-foreground inline" />
                )}
              </span>
            )}
            {convo.lastMessage.text}
          </p>
          {convo.unread > 0 && (
            <span className="w-5 h-5 flex-shrink-0 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {convo.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function RecipeCard({ recipe }: { recipe: NonNullable<Message["recipe"]> }) {
  return (
    <div className="mt-2 rounded-2xl overflow-hidden border border-border/50 bg-card max-w-[220px]">
      <div className="relative w-full aspect-[4/3]">
        <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <Clock className="w-3 h-3 text-white/90" />
          <span className="text-white text-[10px] font-medium">{recipe.time}</span>
        </div>
      </div>
      <div className="px-3 py-2">
        <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">{recipe.title}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span className="text-[11px] text-muted-foreground font-medium">{recipe.rating}</span>
        </div>
      </div>
      <div className="px-3 pb-2 flex gap-2">
        <button className="flex-1 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">
          View Recipe
        </button>
        <button className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
          <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div className={cn("flex gap-2 mb-2", msg.isMe ? "flex-row-reverse" : "flex-row")}>
      <div className={cn("max-w-[72%] flex flex-col", msg.isMe ? "items-end" : "items-start")}>
        {/* Image message */}
        {msg.image && (
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden mb-1">
            <Image src={msg.image} alt="Shared photo" fill className="object-cover" />
            {msg.reactions && msg.reactions.length > 0 && (
              <div className="absolute bottom-1 right-1 flex gap-0.5 bg-black/50 rounded-full px-1.5 py-0.5">
                {msg.reactions.map((r, i) => (
                  <span key={i} className="text-xs">{r}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Text message */}
        {msg.text && (
          <div className={cn(
            "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
            msg.isMe
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm"
          )}>
            {msg.text}
          </div>
        )}

        {/* Recipe card */}
        {msg.recipe && <RecipeCard recipe={msg.recipe} />}

        {/* Time + read status */}
        <div className={cn("flex items-center gap-1 mt-0.5 px-1", msg.isMe ? "flex-row-reverse" : "flex-row")}>
          <span className="text-[10px] text-muted-foreground">{msg.time}</span>
          {msg.isMe && (
            msg.read
              ? <CheckCheck className="w-3 h-3 text-primary" />
              : <Check className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface MessagesProps {
  isOpen: boolean
  onClose: () => void
}

export function Messages({ isOpen, onClose }: MessagesProps) {
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [inputText, setInputText] = useState("")
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(mockMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selected, allMessages])

  if (!isOpen) return null

  const filtered = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0)

  const handleSend = () => {
    if (!inputText.trim() || !selected) return
    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isMe: true,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      read: false,
    }
    setAllMessages((prev) => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] ?? []), newMsg],
    }))
    setInputText("")
  }

  const currentMessages = selected ? (allMessages[selected.id] ?? []) : []

  // ── Chat View ──────────────────────────────────────────────────────────────
  if (selected) {
    return (
      <div className="fixed inset-0 z-[90] bg-background flex flex-col max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-3 py-3 border-b border-border/50 bg-background/95 backdrop-blur-md">
          <button
            onClick={() => setSelected(null)}
            className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <Image src={selected.user.avatar} alt={selected.user.name} width={36} height={36} className="object-cover" />
              </div>
              {selected.user.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{selected.user.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {selected.user.online ? "🟢 Active now" : `@${selected.user.username}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <Phone className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <Video className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {currentMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Start the conversation!</p>
              <p className="text-xs text-muted-foreground">Share a recipe, a review, or a food photo 🍽️</p>
            </div>
          )}
          {currentMessages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-border/50 bg-background/95 backdrop-blur-md">
          <div className="flex items-end gap-2">
            <button className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0">
              <Camera className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex-1 flex items-end bg-muted rounded-2xl px-3.5 py-2.5 gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Message..."
                rows={1}
                className="flex-1 bg-transparent text-sm outline-none resize-none placeholder:text-muted-foreground max-h-24 leading-relaxed"
                style={{ minHeight: "20px" }}
              />
              <button className="flex-shrink-0 p-0.5 hover:opacity-70 transition-opacity">
                <Smile className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                inputText.trim()
                  ? "bg-primary shadow-md shadow-primary/30 active:scale-95"
                  : "bg-muted"
              )}
            >
              <Send className={cn("w-4 h-4", inputText.trim() ? "text-primary-foreground" : "text-muted-foreground")} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Conversation List View ─────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[90] bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">Messages</h1>
          {totalUnread > 0 && (
            <p className="text-xs text-muted-foreground">{totalUnread} unread</p>
          )}
        </div>
        <button className="p-2 rounded-full hover:bg-muted transition-colors">
          <MoreHorizontal className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2.5 border-b border-border/50">
        <div className="flex items-center gap-2 bg-muted px-3.5 py-2 rounded-full">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Active now */}
        {!searchQuery && <ActiveNow convos={conversations} />}

        {/* Conversation list */}
        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-8">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">No results for "{searchQuery}"</p>
              <p className="text-xs text-muted-foreground">Try searching by name or username</p>
            </div>
          ) : (
            filtered.map((convo) => (
              <ConversationItem
                key={convo.id}
                convo={convo}
                onClick={() => setSelected(convo)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
