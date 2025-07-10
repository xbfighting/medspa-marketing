'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterTextProps {
  text: string
  delay?: number
  speed?: number
  className?: string
  onComplete?: () => void
  startAnimation?: boolean
}

export function TypewriterText({
  text,
  delay = 0,
  speed = 50,
  className = '',
  onComplete,
  startAnimation = true
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (!startAnimation) {
      setDisplayText(text)
      setIsComplete(true)
      return
    }

    setDisplayText('')
    setIsComplete(false)

    const timer = setTimeout(() => {
      let currentIndex = 0
      
      const typeWriter = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1))
          currentIndex++
          setTimeout(typeWriter, speed)
        } else {
          setIsComplete(true)
          if (onComplete) onComplete()
        }
      }

      typeWriter()
    }, delay)

    return () => clearTimeout(timer)
  }, [text, delay, speed, onComplete, startAnimation])

  // Cursor blink effect
  useEffect(() => {
    if (!isComplete) return

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    // Hide cursor after 3 seconds of completion
    const hideTimer = setTimeout(() => {
      setShowCursor(false)
      clearInterval(cursorInterval)
    }, 3000)

    return () => {
      clearInterval(cursorInterval)
      clearTimeout(hideTimer)
    }
  }, [isComplete])

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span>{displayText}</span>
      {(!isComplete || showCursor) && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-current ml-1"
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0.1 }}
        />
      )}
    </motion.div>
  )
}

interface TypewriterSequenceProps {
  texts: string[]
  delay?: number
  speed?: number
  className?: string
  onComplete?: () => void
  startAnimation?: boolean
}

export function TypewriterSequence({
  texts,
  delay = 0,
  speed = 50,
  className = '',
  onComplete,
  startAnimation = true
}: TypewriterSequenceProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isSequenceComplete, setIsSequenceComplete] = useState(false)

  const handleTextComplete = () => {
    if (currentTextIndex < texts.length - 1) {
      setTimeout(() => {
        setCurrentTextIndex(prev => prev + 1)
      }, 500) // Pause between texts
    } else {
      setIsSequenceComplete(true)
      if (onComplete) onComplete()
    }
  }

  if (!startAnimation) {
    return (
      <div className={className}>
        {texts.map((text, index) => (
          <div key={index} className="mb-2">
            {text}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      {texts.map((text, index) => (
        <div key={index} className="mb-2">
          {index < currentTextIndex ? (
            <span>{text}</span>
          ) : index === currentTextIndex ? (
            <TypewriterText
              text={text}
              delay={index === 0 ? delay : 0}
              speed={speed}
              onComplete={handleTextComplete}
              startAnimation={true}
            />
          ) : null}
        </div>
      ))}
    </div>
  )
}