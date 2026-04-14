"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      // Call onComplete after exit animation
      setTimeout(onComplete, 600)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#FFEE00" }}
        >
          {/* Animated Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for Lemon8-like smoothness
            }}
            className="flex flex-col items-center"
          >
            {/* Cookie Icon - Animated Cookie Shape */}
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-24 h-24 mb-6"
            >
              {/* Cookie Circle */}
              <div className="absolute inset-0 rounded-full bg-black" />
              {/* Cookie Dots (Chocolate chips) */}
              <div className="absolute top-4 left-5 w-4 h-4 rounded-full bg-[#FFEE00]" />
              <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-[#FFEE00]" />
              <div className="absolute bottom-5 left-7 w-3.5 h-3.5 rounded-full bg-[#FFEE00]" />
              <div className="absolute bottom-7 right-5 w-2.5 h-2.5 rounded-full bg-[#FFEE00]" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#FFEE00]" />
            </motion.div>

            {/* Cookie Text */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="text-5xl font-bold text-black tracking-tight"
              style={{ fontFamily: "var(--font-sans), DM Sans, sans-serif" }}
            >
              Cookie
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="mt-3 text-sm text-black/60 font-medium tracking-wide"
            >
              Lifestyle & Recipes
            </motion.p>
          </motion.div>

          {/* Animated Loading Bar at Bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ 
              duration: 2.5, 
              ease: "linear"
            }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 origin-left"
          >
            <motion.div
              animate={{ 
                backgroundColor: ["rgba(0,0,0,0.2)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.2)"]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-full w-full"
            />
          </motion.div>

          {/* Version Tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="absolute bottom-8 text-xs text-black/40 font-medium"
          >
            v1.0.0
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
