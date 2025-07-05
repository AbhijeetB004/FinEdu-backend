import { STORAGE_KEYS } from './constants'

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

// Fallback storage for when localStorage is not available
const fallbackStorage = new Map()

// Generic storage functions
export const setStoredData = (key, data) => {
  try {
    const serializedData = JSON.stringify(data)
    
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, serializedData)
    } else {
      fallbackStorage.set(key, serializedData)
    }
    
    return true
  } catch (error) {
    console.error('Error storing data:', error)
    return false
  }
}

export const getStoredData = (key, defaultValue = null) => {
  try {
    let serializedData
    
    if (isLocalStorageAvailable()) {
      serializedData = localStorage.getItem(key)
    } else {
      serializedData = fallbackStorage.get(key)
    }
    
    if (serializedData === null || serializedData === undefined) {
      return defaultValue
    }
    
    return JSON.parse(serializedData)
  } catch (error) {
    console.error('Error retrieving data:', error)
    return defaultValue
  }
}

export const removeStoredData = (key) => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(key)
    } else {
      fallbackStorage.delete(key)
    }
    
    return true
  } catch (error) {
    console.error('Error removing data:', error)
    return false
  }
}

export const clearAllStoredData = () => {
  try {
    if (isLocalStorageAvailable()) {
      // Only clear FinEdu related data
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } else {
      fallbackStorage.clear()
    }
    
    return true
  } catch (error) {
    console.error('Error clearing data:', error)
    return false
  }
}

// Specific storage functions for common data types
export const setAuthToken = (token) => {
  return setStoredData(STORAGE_KEYS.AUTH_TOKEN, token)
}

export const getAuthToken = () => {
  return getStoredData(STORAGE_KEYS.AUTH_TOKEN)
}

export const removeAuthToken = () => {
  return removeStoredData(STORAGE_KEYS.AUTH_TOKEN)
}

export const setUserData = (userData) => {
  return setStoredData(STORAGE_KEYS.USER_DATA, userData)
}

export const getUserData = () => {
  return getStoredData(STORAGE_KEYS.USER_DATA)
}

export const removeUserData = () => {
  return removeStoredData(STORAGE_KEYS.USER_DATA)
}

export const setLanguage = (language) => {
  return setStoredData(STORAGE_KEYS.LANGUAGE, language)
}

export const getLanguage = () => {
  return getStoredData(STORAGE_KEYS.LANGUAGE, 'en')
}

export const setTheme = (theme) => {
  return setStoredData(STORAGE_KEYS.THEME, theme)
}

export const getTheme = () => {
  return getStoredData(STORAGE_KEYS.THEME, 'light')
}

// Offline data management
export const setOfflineData = (key, data) => {
  const offlineData = getStoredData(STORAGE_KEYS.OFFLINE_DATA, {})
  offlineData[key] = {
    data,
    timestamp: Date.now(),
    synced: false
  }
  return setStoredData(STORAGE_KEYS.OFFLINE_DATA, offlineData)
}

export const getOfflineData = (key) => {
  const offlineData = getStoredData(STORAGE_KEYS.OFFLINE_DATA, {})
  return offlineData[key]?.data || null
}

export const getAllOfflineData = () => {
  return getStoredData(STORAGE_KEYS.OFFLINE_DATA, {})
}

export const markOfflineDataAsSynced = (key) => {
  const offlineData = getStoredData(STORAGE_KEYS.OFFLINE_DATA, {})
  if (offlineData[key]) {
    offlineData[key].synced = true
    return setStoredData(STORAGE_KEYS.OFFLINE_DATA, offlineData)
  }
  return false
}

export const removeOfflineData = (key) => {
  const offlineData = getStoredData(STORAGE_KEYS.OFFLINE_DATA, {})
  delete offlineData[key]
  return setStoredData(STORAGE_KEYS.OFFLINE_DATA, offlineData)
}

export const getUnsyncedOfflineData = () => {
  const offlineData = getStoredData(STORAGE_KEYS.OFFLINE_DATA, {})
  const unsynced = {}
  
  Object.entries(offlineData).forEach(([key, value]) => {
    if (!value.synced) {
      unsynced[key] = value
    }
  })
  
  return unsynced
}

// Game progress storage
export const setGameProgress = (gameType, progress) => {
  const gameData = getStoredData(STORAGE_KEYS.GAME_PROGRESS, {})
  gameData[gameType] = {
    ...progress,
    lastUpdated: Date.now()
  }
  return setStoredData(STORAGE_KEYS.GAME_PROGRESS, gameData)
}

export const getGameProgress = (gameType) => {
  const gameData = getStoredData(STORAGE_KEYS.GAME_PROGRESS, {})
  return gameData[gameType] || null
}

export const getAllGameProgress = () => {
  return getStoredData(STORAGE_KEYS.GAME_PROGRESS, {})
}

// Cache management with expiration
export const setCachedData = (key, data, expirationMs = 5 * 60 * 1000) => {
  const cacheData = {
    data,
    timestamp: Date.now(),
    expiration: Date.now() + expirationMs
  }
  return setStoredData(`cache_${key}`, cacheData)
}

export const getCachedData = (key) => {
  const cacheData = getStoredData(`cache_${key}`)
  
  if (!cacheData) {
    return null
  }
  
  // Check if cache has expired
  if (Date.now() > cacheData.expiration) {
    removeStoredData(`cache_${key}`)
    return null
  }
  
  return cacheData.data
}

export const clearExpiredCache = () => {
  if (!isLocalStorageAvailable()) return
  
  const keys = Object.keys(localStorage)
  const cacheKeys = keys.filter(key => key.startsWith('cache_'))
  
  cacheKeys.forEach(key => {
    const cacheData = getStoredData(key)
    if (cacheData && Date.now() > cacheData.expiration) {
      removeStoredData(key)
    }
  })
}

// Storage quota management
export const getStorageQuota = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate()
      return {
        quota: estimate.quota,
        usage: estimate.usage,
        available: estimate.quota - estimate.usage,
        usagePercentage: (estimate.usage / estimate.quota) * 100
      }
    } catch (error) {
      console.error('Error getting storage quota:', error)
    }
  }
  return null
}

export const isStorageQuotaExceeded = async (threshold = 0.8) => {
  const quota = await getStorageQuota()
  if (!quota) return false
  
  return quota.usagePercentage > (threshold * 100)
}

// Data compression for large objects
export const compressData = (data) => {
  try {
    // Simple compression by removing whitespace from JSON
    return JSON.stringify(data).replace(/\s+/g, '')
  } catch (error) {
    console.error('Error compressing data:', error)
    return JSON.stringify(data)
  }
}

export const decompressData = (compressedData) => {
  try {
    return JSON.parse(compressedData)
  } catch (error) {
    console.error('Error decompressing data:', error)
    return null
  }
}

// Backup and restore functionality
export const createBackup = () => {
  const backup = {}
  
  Object.values(STORAGE_KEYS).forEach(key => {
    const data = getStoredData(key)
    if (data !== null) {
      backup[key] = data
    }
  })
  
  return {
    version: '1.0',
    timestamp: Date.now(),
    data: backup
  }
}

export const restoreFromBackup = (backup) => {
  try {
    if (!backup.data || typeof backup.data !== 'object') {
      throw new Error('Invalid backup format')
    }
    
    // Clear existing data
    clearAllStoredData()
    
    // Restore data
    Object.entries(backup.data).forEach(([key, value]) => {
      setStoredData(key, value)
    })
    
    return true
  } catch (error) {
    console.error('Error restoring backup:', error)
    return false
  }
}

// Storage event listener for cross-tab synchronization
export const addStorageListener = (callback) => {
  if (!isLocalStorageAvailable()) return () => {}
  
  const handleStorageChange = (event) => {
    if (Object.values(STORAGE_KEYS).includes(event.key)) {
      callback({
        key: event.key,
        oldValue: event.oldValue ? JSON.parse(event.oldValue) : null,
        newValue: event.newValue ? JSON.parse(event.newValue) : null
      })
    }
  }
  
  window.addEventListener('storage', handleStorageChange)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange)
  }
}

// Initialize storage cleanup on app start
export const initializeStorage = () => {
  // Clear expired cache
  clearExpiredCache()
  
  // Set up periodic cache cleanup
  setInterval(clearExpiredCache, 10 * 60 * 1000) // Every 10 minutes
  
  // Check storage quota
  getStorageQuota().then(quota => {
    if (quota && quota.usagePercentage > 80) {
      console.warn('Storage quota is running low:', quota)
    }
  })
}

export default {
  setStoredData,
  getStoredData,
  removeStoredData,
  clearAllStoredData,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setUserData,
  getUserData,
  removeUserData,
  setLanguage,
  getLanguage,
  setTheme,
  getTheme,
  setOfflineData,
  getOfflineData,
  getAllOfflineData,
  markOfflineDataAsSynced,
  removeOfflineData,
  getUnsyncedOfflineData,
  setGameProgress,
  getGameProgress,
  getAllGameProgress,
  setCachedData,
  getCachedData,
  clearExpiredCache,
  getStorageQuota,
  isStorageQuotaExceeded,
  compressData,
  decompressData,
  createBackup,
  restoreFromBackup,
  addStorageListener,
  initializeStorage
}