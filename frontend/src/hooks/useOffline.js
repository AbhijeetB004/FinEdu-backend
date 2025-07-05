import { useState, useEffect } from 'react'
import { checkNetworkStatus } from '../utils/api'

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      setIsSlowConnection(false)
    }

    const handleOffline = () => {
      setIsOffline(true)
      setIsSlowConnection(false)
    }

    // Check connection speed
    const checkConnectionSpeed = async () => {
      if (navigator.onLine) {
        const startTime = Date.now()
        try {
          await checkNetworkStatus()
          const endTime = Date.now()
          const responseTime = endTime - startTime
          
          // Consider connection slow if response time > 3 seconds
          setIsSlowConnection(responseTime > 3000)
        } catch (error) {
          setIsSlowConnection(true)
        }
      }
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check connection speed periodically
    const speedCheckInterval = setInterval(checkConnectionSpeed, 30000) // Every 30 seconds

    // Initial speed check
    checkConnectionSpeed()

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(speedCheckInterval)
    }
  }, [])

  // Additional network information if available
  const getNetworkInfo = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      }
    }
    return null
  }

  return {
    isOffline,
    isOnline: !isOffline,
    isSlowConnection,
    networkInfo: getNetworkInfo(),
  }
}

export default useOffline