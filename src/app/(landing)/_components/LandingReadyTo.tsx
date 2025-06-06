"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"



export default function LandingReadyTo() {
  const textOptions = [
    "Ready to start accepting orders for dine-in, takeaway and delivery?",
    "Ready to fully automate your in-location order flow?",
    "Ready to see your orders in real-time?",
    "Ready to start growing your food business?",
    "Ready to start serving your customers better?",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % textOptions.length)
    }, 3000) // Change text every 3 seconds

    return () => clearInterval(interval)
  }, [textOptions.length])

  return (

    <p className="text-base font-light text-gray-500 sm:text-xl lg:text-lg xl:text-xl max-w-2xl text-left leading-relaxed">

      <span className="inline-block relative min-h-[1.5em] align-top">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="block"
          >
            {textOptions[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>

  )
}
