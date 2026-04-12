"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { X, SwitchCamera, Zap, ZapOff, Camera, Check, RotateCcw, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface CameraCaptureProps {
  isOpen: boolean
  onClose: () => void
}

export function CameraCapture({ isOpen, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [caption, setCaption] = useState("")

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      
      // Stop existing stream first
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
      setCaption("")
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

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get the image as data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
    setCapturedImage(imageDataUrl)
    
    // Stop the camera after capturing
    stopCamera()
    
    setTimeout(() => setIsCapturing(false), 300)
  }, [stopCamera])

  const retakePhoto = () => {
    setCapturedImage(null)
    setCaption("")
    startCamera()
  }

  const sendPhoto = () => {
    // Here you would typically upload the image
    console.log("Sending photo with caption:", caption)
    onClose()
    setCapturedImage(null)
    setCaption("")
  }

  const handleClose = () => {
    stopCamera()
    setCapturedImage(null)
    setCaption("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <div className="relative w-full h-full max-w-md mx-auto flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/60 to-transparent">
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-3">
            {!capturedImage && (
              <>
                <button
                  onClick={() => setFlashEnabled(!flashEnabled)}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                  {flashEnabled ? (
                    <Zap className="w-5 h-5 text-primary" />
                  ) : (
                    <ZapOff className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  onClick={switchCamera}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                  <SwitchCamera className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Camera View or Captured Image */}
        <div className="flex-1 relative overflow-hidden">
          {cameraError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center px-8">
                <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-white text-sm">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            <div className="absolute inset-0">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
              
              {/* Caption Input */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-md rounded-2xl text-white placeholder:text-white/60 text-sm outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Viewfinder Frame */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-8 border-2 border-white/30 rounded-3xl" />
                
                {/* Corner accents */}
                <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-3xl" />
                <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-3xl" />
                <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-3xl" />
                <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-3xl" />
              </div>

              {/* Capture Animation Overlay */}
              {isCapturing && (
                <div className="absolute inset-0 bg-white animate-pulse" />
              )}
            </>
          )}
        </div>

        {/* Hidden Canvas for Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 pb-10 pt-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          {capturedImage ? (
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={retakePhoto}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                  <RotateCcw className="w-6 h-6 text-white" />
                </div>
                <span className="text-white/80 text-xs">Retake</span>
              </button>
              
              <button
                onClick={sendPhoto}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                  <Send className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-white text-xs font-medium">Send</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-8">
              {/* Capture Button */}
              <button
                onClick={capturePhoto}
                disabled={!!cameraError}
                className={cn(
                  "relative w-20 h-20 rounded-full flex items-center justify-center transition-all",
                  "hover:scale-105 active:scale-95",
                  cameraError && "opacity-50 cursor-not-allowed"
                )}
              >
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-white" />
                {/* Inner circle */}
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <Camera className="w-7 h-7 text-black" />
                </div>
              </button>
            </div>
          )}
          
          {/* Hint Text */}
          {!capturedImage && !cameraError && (
            <p className="text-center text-white/60 text-xs mt-4">
              Tap to capture your delicious moment
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
