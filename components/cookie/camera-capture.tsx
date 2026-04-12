"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { X, SwitchCamera, Zap, ZapOff, Camera, RotateCcw, Send, Heart, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CameraCaptureProps {
  isOpen: boolean
  onClose: () => void
}

// Mock friends data for Locket-style friend selection
const friends = [
  { id: "1", name: "Emma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: "2", name: "James", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { id: "3", name: "Sophia", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
  { id: "4", name: "Liam", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  { id: "5", name: "Olivia", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
]

export function CameraCapture({ isOpen, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [showReaction, setShowReaction] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1920 },
        },
        audio: false,
      })

      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Camera error:", error)
      setCameraError("Unable to access camera. Please grant camera permission.")
    }
  }, [facingMode, stream])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera()
    } else if (!isOpen) {
      stopCamera()
      setCapturedImage(null)
      setSelectedFriends([])
    }
    
    return () => {
      stopCamera()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera()
    }
  }, [facingMode])

  const switchCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user")
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
    setCapturedImage(imageDataUrl)
    stopCamera()
    
    setTimeout(() => setIsCapturing(false), 300)
  }, [stopCamera])

  const retakePhoto = () => {
    setCapturedImage(null)
    setSelectedFriends([])
    startCamera()
  }

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    )
  }

  const selectAllFriends = () => {
    if (selectedFriends.length === friends.length) {
      setSelectedFriends([])
    } else {
      setSelectedFriends(friends.map(f => f.id))
    }
  }

  const sendPhoto = () => {
    setShowReaction(true)
    setTimeout(() => {
      setShowReaction(false)
      onClose()
      setCapturedImage(null)
      setSelectedFriends([])
    }, 1500)
  }

  const handleClose = () => {
    stopCamera()
    setCapturedImage(null)
    setSelectedFriends([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <div className="relative w-full h-full max-w-md mx-auto flex flex-col">
        
        {/* Locket-style Header - Minimal */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {!capturedImage && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFlashEnabled(!flashEnabled)}
                className={cn(
                  "w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all",
                  flashEnabled ? "bg-primary" : "bg-black/30"
                )}
              >
                {flashEnabled ? (
                  <Zap className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <ZapOff className="w-5 h-5 text-white/70" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Main Camera/Image Area - Locket Style */}
        <div className="flex-1 flex items-center justify-center px-3 pt-16 pb-4">
          <div className="relative w-full aspect-[3/4] max-h-[65vh] rounded-[40px] overflow-hidden bg-neutral-900">
            
            {cameraError ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-white/50" />
                  </div>
                  <p className="text-white/70 text-sm mb-4">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : capturedImage ? (
              <>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
                
                {/* Sent reaction animation */}
                {showReaction && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-in fade-in duration-300">
                    <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-300">
                      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                        <Heart className="w-10 h-10 text-primary-foreground fill-primary-foreground" />
                      </div>
                      <span className="text-white font-semibold text-lg">Sent!</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Capture flash effect */}
                {isCapturing && (
                  <div className="absolute inset-0 bg-white animate-pulse" />
                )}
              </>
            )}
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Bottom Section - Locket Style */}
        <div className="px-4 pb-8">
          {capturedImage ? (
            <>
              {/* Friend Selection - Locket Style */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-sm">Send to</span>
                  <button 
                    onClick={selectAllFriends}
                    className="text-primary text-sm font-medium"
                  >
                    {selectedFriends.length === friends.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {/* All Friends Button */}
                  <button
                    onClick={selectAllFriends}
                    className={cn(
                      "flex-shrink-0 flex flex-col items-center gap-1.5"
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                      selectedFriends.length === friends.length 
                        ? "bg-primary ring-2 ring-primary ring-offset-2 ring-offset-black" 
                        : "bg-white/10"
                    )}>
                      <Users className={cn(
                        "w-6 h-6",
                        selectedFriends.length === friends.length ? "text-primary-foreground" : "text-white/70"
                      )} />
                    </div>
                    <span className="text-white/70 text-[10px]">All</span>
                  </button>
                  
                  {/* Individual Friends */}
                  {friends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => toggleFriend(friend.id)}
                      className="flex-shrink-0 flex flex-col items-center gap-1.5"
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-full overflow-hidden relative transition-all",
                        selectedFriends.includes(friend.id) && "ring-2 ring-primary ring-offset-2 ring-offset-black"
                      )}>
                        <Image
                          src={friend.avatar}
                          alt={friend.name}
                          fill
                          className="object-cover"
                        />
                        {selectedFriends.includes(friend.id) && (
                          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-white/70 text-[10px]">{friend.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={retakePhoto}
                  className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-6 h-6 text-white" />
                </button>
                
                <button
                  onClick={sendPhoto}
                  disabled={selectedFriends.length === 0}
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center active:scale-95 transition-all",
                    selectedFriends.length > 0 
                      ? "bg-primary shadow-lg shadow-primary/40" 
                      : "bg-white/20"
                  )}
                >
                  <Send className={cn(
                    "w-7 h-7",
                    selectedFriends.length > 0 ? "text-primary-foreground" : "text-white/50"
                  )} />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Camera Controls - Locket Style */}
              <div className="flex items-center justify-center gap-8">
                {/* Switch Camera - Left */}
                <button
                  onClick={switchCamera}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <SwitchCamera className="w-5 h-5 text-white" />
                </button>
                
                {/* Capture Button - Center - Locket Style */}
                <button
                  onClick={capturePhoto}
                  disabled={!!cameraError}
                  className={cn(
                    "relative w-[76px] h-[76px] rounded-full flex items-center justify-center",
                    "active:scale-95 transition-transform",
                    cameraError && "opacity-50"
                  )}
                >
                  {/* Outer ring with gradient */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white to-white/80" />
                  {/* Gap ring */}
                  <div className="absolute inset-[3px] rounded-full bg-black" />
                  {/* Inner white button */}
                  <div className="absolute inset-[6px] rounded-full bg-white" />
                </button>
                
                {/* Placeholder for symmetry - Right */}
                <div className="w-12 h-12" />
              </div>
              
              {/* Hint text */}
              <p className="text-center text-white/40 text-xs mt-5">
                Share your food moment
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
