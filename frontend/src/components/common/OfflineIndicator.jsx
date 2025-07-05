import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi, AlertCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useOffline } from '../../hooks/useOffline'

const OfflineIndicator = () => {
  const { t } = useTranslation()
  const { isOffline, isSlowConnection } = useOffline()
  const [showIndicator, setShowIndicator] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)

  useEffect(() => {
    if (isOffline || isSlowConnection) {
      setShowIndicator(true)
    } else {
      // Show reconnected message briefly
      if (showIndicator) {
        setIsReconnecting(true)
        setTimeout(() => {
          setShowIndicator(false)
          setIsReconnecting(false)
        }, 2000)
      }
    }
  }, [isOffline, isSlowConnection, showIndicator])

  const getIndicatorContent = () => {
    if (isReconnecting) {
      return {
        icon: <Wifi className="w-4 h-4" />,
        text: t('offline.reconnected'),
        bgColor: 'bg-success-500',
        textColor: 'text-white'
      }
    } else if (isOffline) {
      return {
        icon: <WifiOff className="w-4 h-4" />,
        text: t('offline.title'),
        bgColor: 'bg-danger-500',
        textColor: 'text-white'
      }
    } else if (isSlowConnection) {
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        text: t('offline.slowConnection'),
        bgColor: 'bg-warning-500',
        textColor: 'text-white'
      }
    }
    return null
  }

  const content = getIndicatorContent()

  if (!content) return null

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`
            fixed top-0 left-0 right-0 z-50 
            ${content.bgColor} ${content.textColor}
            px-4 py-2 text-center text-sm font-medium
            shadow-lg
          `}
        >
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
            {content.icon}
            <span>{content.text}</span>
            
            {isOffline && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 transition-colors"
              >
                {t('common.retry')}
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Offline Content Placeholder
export const OfflineContent = ({ children, fallback }) => {
  const { isOffline } = useOffline()
  const { t } = useTranslation()

  if (isOffline) {
    return (
      fallback || (
        <div className="text-center py-8">
          <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('offline.title')}
          </h3>
          <p className="text-gray-600">
            {t('offline.notAvailableOffline')}
          </p>
        </div>
      )
    )
  }

  return children
}

// Offline Badge for cached content
export const OfflineBadge = ({ isAvailableOffline = false }) => {
  const { t } = useTranslation()

  if (!isAvailableOffline) return null

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-100 text-success-800 text-xs font-medium rounded-full">
      <WifiOff className="w-3 h-3" />
      {t('offline.availableOffline')}
    </span>
  )
}

export default OfflineIndicator