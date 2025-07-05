import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const LoadingSpinner = ({ 
  size = 'medium', 
  text = null, 
  fullScreen = false,
  color = 'primary' 
}) => {
  const { t } = useTranslation()

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  }

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Main Spinner */}
      <div className="relative">
        <motion.div
          className={`
            ${sizeClasses[size]} 
            border-4 border-gray-200 rounded-full
          `}
          variants={pulseVariants}
          animate="animate"
        />
        <motion.div
          className={`
            absolute inset-0
            ${sizeClasses[size]} 
            border-4 border-transparent rounded-full
            ${colorClasses[color]}
            border-t-current
          `}
          variants={spinnerVariants}
          animate="animate"
        />
      </div>

      {/* Loading Text */}
      {(text || text === null) && (
        <motion.p
          className="text-sm text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text || t('common.loading')}
        </motion.p>
      )}

      {/* Loading Dots Animation */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-primary-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
        <Spinner />
      </div>
    )
  }

  return <Spinner />
}

// Skeleton Loading Component
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  avatar = false,
  card = false 
}) => {
  if (card) {
    return (
      <div className={`card ${className}`}>
        <div className="card-body">
          {avatar && (
            <div className="flex items-center space-x-3 mb-4">
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="skeleton h-4 w-24 mb-2" />
                <div className="skeleton h-3 w-16" />
              </div>
            </div>
          )}
          <div className="skeleton h-6 w-3/4 mb-3" />
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`skeleton h-4 mb-2 ${
                index === lines - 1 ? 'w-1/2' : 'w-full'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`animate-pulse ${className}`}>
      {avatar && (
        <div className="flex items-center space-x-3 mb-4">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="flex-1">
            <div className="skeleton h-4 w-24 mb-2" />
            <div className="skeleton h-3 w-16" />
          </div>
        </div>
      )}
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`skeleton h-4 mb-2 ${
            index === lines - 1 ? 'w-1/2' : 'w-full'
          }`}
        />
      ))}
    </div>
  )
}

// Page Loading Component
export const PageLoader = ({ message }) => {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <motion.p
          className="mt-4 text-lg text-gray-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {message || t('common.loading')}
        </motion.p>
      </div>
    </div>
  )
}

// Button Loading State
export const ButtonLoader = ({ size = 'small' }) => {
  return (
    <motion.div
      className={`
        ${sizeClasses[size]} 
        border-2 border-white border-t-transparent rounded-full
      `}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
}

const sizeClasses = {
  small: 'w-4 h-4',
  medium: 'w-6 h-6',
  large: 'w-8 h-8'
}

export default LoadingSpinner