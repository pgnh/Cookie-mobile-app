// @ts-nocheck
"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  X, ArrowLeft, Send, ImageIcon, Smile, Phone, Video,
  Search, MoreHorizontal, ChefHat, Star, Clock, CheckCheck,
  Check, Camera, Heart, Bookmark, Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createBrowserClient } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

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

function ConversationItem({ convo, onClick }: { convo: Conversation, onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 active:bg-muted transition-colors">
      <div className="relative flex-shrink-0">
        <div className="w-13 h-13 w-[52px] h-[52px] rounded-full overflow-hidden">
          <Image src={convo.user.avatar} alt={convo.user.name} width={52} height={52} className="object-cover" />
        </div>
        {convo.user.online && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>
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
                {convo.lastMessage.read ? <CheckCheck className="w-3 h-3 text-primary inline" /> : <Check className="w-3 h-3 text-muted-foreground inline" />}
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
        {msg.image && (
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden mb-1">
            <Image src={msg.image} alt="Shared photo" fill className="object-cover" />
            {msg.reactions && msg.reactions.length > 0 && (
              <div className="absolute bottom-1 right-1 flex gap-0.5 bg-black/50 rounded-full px-1.5 py-0.5">
                {msg.reactions.map((r, i) => <span key={i} className="text-xs">{r}</span>)}
              </div>
            )}
          </div>
        )}
        {msg.text && (
          <div className={cn("px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed", msg.isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm")}>
            {msg.text}
          </div>
        )}
        {msg.recipe && <RecipeCard recipe={msg.recipe} />}
        <div className={cn("flex items-center gap-1 mt-0.5 px-1", msg.isMe ? "flex-row-reverse" : "flex-row")}>
          <span className="text-[10px] text-muted-foreground">{msg.time}</span>
          {msg.isMe && (msg.read ? <CheckCheck className="w-3 h-3 text-primary" /> : <Check className="w-3 h-3 text-muted-foreground" />)}
        </div>
      </div>
    </div>
  )
}

export function Messages({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [inputText, setInputText] = useState("")
  const [currentMessages, setCurrentMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const supabase = createBrowserClient()

  useEffect(() => {
    if (isOpen) fetchConversations()
  }, [isOpen])

  useEffect(() => {
    if (selected) {
      fetchMessages(selected.id)
      markAsRead(selected.id)
      const channel = supabase.channel(`chat:${selected.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: any) => {
          if (payload.new.sender_id === selected.id) {
            const newMsg = formatMessage(payload.new, false)
            setCurrentMessages(prev => [...prev, newMsg])
            markAsRead(selected.id)
          }
        })
        .subscribe()
      return () => { supabase.removeChannel(channel) }
    }
  }, [selected])

  useEffect(() => {
    const channel = supabase.channel('online-users')
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const onlineIds = Object.values(state).flat().map((p: any) => p.user_id)
      setConversations(prev => prev.map(c => ({
        ...c, user: { ...c.user, online: onlineIds.includes(c.id) }
      })))
    }).subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) await channel.track({ user_id: user.id, online_at: new Date().toISOString() })
      }
    })
    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }, [currentMessages, selected])

  const formatMessage = (m: any, isMe: boolean): Message => ({
    id: m.id,
    text: m.content,
    image: m.media_url,
    recipe: m.metadata?.type === 'recipe' ? m.metadata.recipe : undefined,
    isMe: isMe,
    time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: m.is_read
  })

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase
        .from<any, any>('')
        .select(`*, sender:sender_id(id, full_name, username, avatar_url, last_seen_at), receiver:receiver_id(id, full_name, username, avatar_url, last_seen_at)`)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
      if (error) throw error
      const uniqueConvos = new Map()
      data.forEach(m => {
        const otherUser = m.sender_id === user.id ? m.receiver : m.sender
        if (!uniqueConvos.has(otherUser.id)) {
          uniqueConvos.set(otherUser.id, {
            id: otherUser.id,
            user: {
              name: otherUser.full_name,
              username: otherUser.username,
              avatar: otherUser.avatar_url,
              online: false
            },
            lastMessage: {
              text: m.content || (m.media_url ? "Sent a photo 📸" : "Shared a recipe"),
              time: formatDistanceToNow(new Date(m.created_at)),
              isMe: m.sender_id === user.id,
              read: m.is_read
            },
            unread: 0
          })
        }
      })
      setConversations(Array.from(uniqueConvos.values()))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (otherUserId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase
        .from<any, any>('')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selected?.id}),and(sender_id.eq.${selected?.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })
      if (error) throw error
      setCurrentMessages(data.map(m => formatMessage(m, m.sender_id === user.id)))
    } catch (e) { console.error(e) }
  }

  const handleSend = async () => {
    if (!inputText.trim() || !selected) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const tempId = Date.now().toString()
    const newMsg: Message = { id: tempId, text: inputText.trim(), isMe: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false }
    setCurrentMessages(prev => [...prev, newMsg])
    setInputText("")

    await supabase.from<any, any>('').insert({ sender_id: user.id, receiver_id: selected.id, content: newMsg.text })
  }

  const markAsRead = async (otherId: string) => {
     const { data: { user } } = await supabase.auth.getUser()
     if (!user) return
     await supabase.from<any, any>('').update({ is_read: true }).match({ receiver_id: user.id, sender_id: otherId, is_read: false })
  }

  const shareRecipe = async (recipe: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !selected) return
    const { error } = await supabase.from<any, any>('').insert({
        sender_id: user.id, receiver_id: selected.id,
        metadata: { type: 'recipe', recipe: { title: recipe.title, image: recipe.image_url, time: `${recipe.prep_time_minutes}m`, rating: recipe.average_rating || 0 } }
      })
    if (!error) fetchMessages(selected.id)
  }

  if (!isOpen) return null

  if (selected) {
    return (
      <div className="fixed inset-0 z-[90] bg-background flex flex-col max-w-md mx-auto">
        <div className="flex items-center gap-3 px-3 py-3 border-b border-border/50 bg-background/95 backdrop-blur-md">
          <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <Image src={selected.user.avatar} alt={selected.user.name} width={36} height={36} className="object-cover" />
              </div>
              {selected.user.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{selected.user.name}</p>
              <p className="text-[11px] text-muted-foreground">{selected.user.online ? "🟢 Active now" : `@${selected.user.username}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="p-2 rounded-full hover:bg-muted transition-colors"><Phone className="w-5 h-5 text-foreground" /></button>
            <button className="p-2 rounded-full hover:bg-muted transition-colors"><Video className="w-5 h-5 text-foreground" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {currentMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"><ChefHat className="w-8 h-8 text-primary" /></div>
              <p className="text-sm font-semibold text-foreground">Start the conversation!</p>
              <p className="text-xs text-muted-foreground">Share a recipe, a review, or a food photo 🍽️</p>
            </div>
          )}
          {currentMessages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
          <div ref={messagesEndRef} />
        </div>
        <div className="px-3 py-3 border-t border-border/50 bg-background/95 backdrop-blur-md">
          <div className="flex items-end gap-2">
            <button 
              onClick={() => shareRecipe({ title: "Spicy Ramen", image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", prep_time_minutes: 15, average_rating: 4.8 })}
              className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
            >
              <ChefHat className="w-5 h-5 text-primary" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"><Camera className="w-5 h-5 text-muted-foreground" /></button>
            <div className="flex-1 flex items-end bg-muted rounded-2xl px-3.5 py-2.5 gap-2">
              <textarea
                value={inputText} onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Message..." rows={1} className="flex-1 bg-transparent text-sm outline-none resize-none placeholder:text-muted-foreground max-h-24 leading-relaxed" style={{ minHeight: "20px" }}
              />
              <button className="flex-shrink-0 p-0.5 hover:opacity-70 transition-opacity"><Smile className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <button onClick={handleSend} disabled={!inputText.trim()} className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all", inputText.trim() ? "bg-primary shadow-md shadow-primary/30 active:scale-95" : "bg-muted")}>
              <Send className={cn("w-4 h-4", inputText.trim() ? "text-primary-foreground" : "text-muted-foreground")} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totalUnread = conversations.reduce((acc, c) => acc + c.unread, 0)
  const filtered = conversations.filter(c => c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.user.username.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="fixed inset-0 z-[90] bg-background flex flex-col max-w-md mx-auto">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"><X className="w-5 h-5 text-foreground" /></button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">Messages</h1>
          {totalUnread > 0 && <p className="text-xs text-primary font-medium">{totalUnread} unread</p>}
        </div>
        <button className="p-2 rounded-full hover:bg-muted transition-colors"><MoreHorizontal className="w-5 h-5 text-foreground" /></button>
      </div>
      <div className="px-4 py-2.5 border-b border-border/50">
        <div className="flex items-center gap-2 bg-muted px-3.5 py-2 rounded-full">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input type="text" placeholder="Search messages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : (
          <>
            {!searchQuery && <ActiveNow convos={conversations} />}
            <div>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-8">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center"><Search className="w-7 h-7 text-muted-foreground" /></div>
                  <p className="text-sm font-semibold text-foreground">No results for "{searchQuery}"</p>
                  <p className="text-xs text-muted-foreground">Try searching by name or username</p>
                </div>
              ) : (
                filtered.map((convo) => <ConversationItem key={convo.id} convo={convo} onClick={() => setSelected(convo)} />)
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
