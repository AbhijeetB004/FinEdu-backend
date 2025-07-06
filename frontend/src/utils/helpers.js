import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns'
import { BANKING_TERMS } from './constants'

// Date formatting utilities
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString)
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(dateObj)) {
    return 'Today'
  } else if (isYesterday(dateObj)) {
    return 'Yesterday'
  } else {
    return formatDistanceToNow(dateObj, { addSuffix: true })
  }
}

// Number formatting utilities
export const formatNumber = (number, locale = 'en-IN') => {
  if (typeof number !== 'number') return '0'
  return new Intl.NumberFormat(locale).format(number)
}

export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  if (typeof amount !== 'number') return '₹0'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '0%'
  return `${(value * 100).toFixed(decimals)}%`
}

// String utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return strongPasswordRegex.test(password)
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : -1
    }
    return aVal > bVal ? 1 : -1
  })
}

export const uniqueBy = (array, key) => {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

// Object utilities
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

export const pick = (obj, keys) => {
  const result = {}
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

// Color utilities
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export const getContrastColor = (hexColor) => {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return '#000000'
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

// Gamification utilities
export const calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1
}

export const calculateXPForNextLevel = (currentLevel) => {
  return currentLevel * 100
}

export const calculateXPProgress = (xp, level) => {
  const xpForCurrentLevel = (level - 1) * 100
  const xpInCurrentLevel = xp - xpForCurrentLevel
  return Math.min(100, (xpInCurrentLevel / 100) * 100)
}

export const getHealthColor = (health) => {
  if (health >= 80) return 'text-success-600'
  if (health >= 50) return 'text-warning-600'
  if (health >= 20) return 'text-orange-600'
  return 'text-danger-600'
}

export const getHealthBarColor = (health) => {
  if (health >= 80) return 'bg-success-500'
  if (health >= 50) return 'bg-warning-500'
  if (health >= 20) return 'bg-orange-500'
  return 'bg-danger-500'
}

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const extension = getFileExtension(filename).toLowerCase()
  return imageExtensions.includes(extension)
}

export const isVideoFile = (filename) => {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov']
  const extension = getFileExtension(filename).toLowerCase()
  return videoExtensions.includes(extension)
}

// URL utilities
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value.toString())
    }
  })
  
  return searchParams.toString()
}

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  
  params.forEach((value, key) => {
    result[key] = value
  })
  
  return result
}

// Device utilities
export const isMobile = () => {
  return window.innerWidth < 768
}

export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export const isDesktop = () => {
  return window.innerWidth >= 1024
}

export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Performance utilities
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Accessibility utilities
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export const announceToScreenReader = (message) => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.setAttribute('class', 'sr-only')
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Localization utilities
export const getBankingTerm = (term, language = 'en') => {
  return BANKING_TERMS[language]?.[term] || BANKING_TERMS.en[term] || term
}

export const formatIndianNumber = (number) => {
  if (typeof number !== 'number') return '0'
  
  // Indian number system (lakhs, crores)
  if (number >= 10000000) {
    return `${(number / 10000000).toFixed(1)} Cr`
  } else if (number >= 100000) {
    return `${(number / 100000).toFixed(1)} L`
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1)} K`
  }
  
  return number.toString()
}

// Error handling utilities
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.response?.data?.message) return error.response.data.message
  return 'An unexpected error occurred'
}

export const logError = (error, context = '') => {
  console.error(`Error ${context}:`, error)
  
  // In production, you might want to send this to an error tracking service
  if (import.meta.env.PROD) {
    // Example: Sentry.captureException(error, { extra: { context } })
  }
}

// Animation utilities
export const easeInOut = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export const lerp = (start, end, factor) => {
  return start + (end - start) * factor
}

// Random utilities
export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

export default {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatCurrency,
  formatPercentage,
  truncateText,
  capitalizeFirst,
  slugify,
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  groupBy,
  sortBy,
  uniqueBy,
  deepClone,
  omit,
  pick,
  hexToRgb,
  getContrastColor,
  calculateLevel,
  calculateXPForNextLevel,
  calculateXPProgress,
  getHealthColor,
  getHealthBarColor,
  formatFileSize,
  getFileExtension,
  isImageFile,
  isVideoFile,
  buildQueryString,
  parseQueryString,
  isMobile,
  isTablet,
  isDesktop,
  isTouchDevice,
  debounce,
  throttle,
  generateId,
  announceToScreenReader,
  getBankingTerm,
  formatIndianNumber,
  getErrorMessage,
  logError,
  easeInOut,
  lerp,
  randomBetween,
  shuffleArray,
  getRandomElement
}