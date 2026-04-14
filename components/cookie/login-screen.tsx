"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Chrome, Apple, Phone, ArrowRight, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoginScreenProps {
  onLogin: (method: "google" | "apple" | "phone") => void
  onSkip?: () => void
}

export function LoginScreen({ onLogin, onSkip }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleLogin = async (method: "google" | "apple" | "phone") => {
    setIsLoading(method)
    // Simulate loading for smooth UX
    await new Promise(resolve => setTimeout(resolve, 500))
    onLogin(method)
    setIsLoading(null)
  }

  const loginButtons = [
    {
      id: "google" as const,
      label: "Continue with Google",
      icon: Chrome,
      bgColor: "bg-white",
      textColor: "text-gray-700",
      border: "border border-gray-300",
      shadow: "shadow-sm"
    },
    {
      id: "apple" as const,
      label: "Continue with Apple",
      icon: Apple,
      bgColor: "bg-black",
      textColor: "text-white",
      border: "border border-black",
      shadow: ""
    },
    {
      id: "phone" as const,
      label: "Continue with Phone",
      icon: Phone,
      bgColor: "bg-[#FFEE00]",
      textColor: "text-black",
      border: "",
      shadow: "shadow-sm"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9998] bg-white flex flex-col"
    >
      {/* Top Section - Logo Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="mb-8"
        >
          {/* Cookie Icon */}
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-[#FFEE00]" />
            {/* Cookie Dots */}
            <div className="absolute top-3 left-4 w-4 h-4 rounded-full bg-black" />
            <div className="absolute top-5 right-5 w-3 h-3 rounded-full bg-black" />
            <div className="absolute bottom-4 left-5 w-3.5 h-3.5 rounded-full bg-black" />
            <div className="absolute bottom-6 right-4 w-2.5 h-2.5 rounded-full bg-black" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black" />
          </div>
          
          {/* App Name */}
          <h1 className="text-3xl font-bold text-black text-center tracking-tight">
            Cookie
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Lifestyle & Recipes
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-gray-600 text-base mb-8 px-4"
        >
          Discover and share amazing recipes with food lovers worldwide
        </motion.p>
      </div>

      {/* Bottom Section - Login Buttons */}
      <div className="px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-3"
        >
          {/* Login Buttons */}
          {loginButtons.map((button, index) => (
            <motion.button
              key={button.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              onClick={() => handleLogin(button.id)}
              disabled={isLoading !== null}
              className={cn(
                "w-full py-3.5 px-4 rounded-full flex items-center justify-center gap-3",
                "font-semibold text-sm transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                button.bgColor,
                button.textColor,
                button.border,
                button.shadow
              )}
            >
              {isLoading === button.id ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <button.icon className="w-5 h-5" />
                  <span>{button.label}</span>
                </>
              )}
            </motion.button>
          ))}

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Skip / Explore as Guest */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            onClick={onSkip}
            className="w-full py-3 px-4 rounded-full flex items-center justify-center gap-2 text-gray-600 font-medium text-sm hover:bg-gray-100 transition-colors"
          >
            <span>Explore as Guest</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Terms Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="text-center text-xs text-gray-400 mt-6 px-4 leading-relaxed"
        >
          By continuing, you agree to our{" "}
          <a href="#" className="text-black underline hover:no-underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-black underline hover:no-underline">Privacy Policy</a>
        </motion.p>
      </div>
    </motion.div>
  )
}
