// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
}

// Lesson Categories
export const LESSON_CATEGORIES = {
  BANKING: 'Banking',
  BUDGETING: 'Budgeting',
  INVESTING: 'Investing',
  FINANCING: 'Financing'
}

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
}

// Task Types
export const TASK_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  CUSTOM: 'custom'
}

// Game Types
export const GAME_TYPES = {
  BUDGET_QUIZ: 'budget_quiz',
  CREDIT_SIMULATION: 'credit_simulation',
  STOCK_MARKET: 'stock_market'
}

// Achievement Types
export const ACHIEVEMENT_TYPES = {
  FIRST_LESSON: 'first_lesson',
  STREAK_7: 'streak_7',
  STREAK_30: 'streak_30',
  LEVEL_5: 'level_5',
  LEVEL_10: 'level_10',
  PERFECT_SCORE: 'perfect_score',
  EARLY_BIRD: 'early_bird',
  NIGHT_OWL: 'night_owl'
}

// XP Rewards
export const XP_REWARDS = {
  LESSON_COMPLETION: 10,
  TASK_COMPLETION: 15,
  GAME_COMPLETION: 20,
  PERFECT_SCORE: 5,
  STREAK_BONUS: 2,
  DAILY_LOGIN: 1
}

// Health Values
export const HEALTH_VALUES = {
  MAX_HEALTH: 100,
  MISSED_TASK_PENALTY: 5,
  MISSED_DAILY_PENALTY: 10,
  INACTIVE_DAY_PENALTY: 2
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'finedu_auth_token',
  USER_DATA: 'finedu_user_data',
  LANGUAGE: 'finedu_language',
  THEME: 'finedu_theme',
  OFFLINE_DATA: 'finedu_offline_data',
  GAME_PROGRESS: 'finedu_game_progress'
}

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
]

// Navigation Items
export const NAVIGATION_ITEMS = [
  {
    name: 'dashboard',
    path: '/dashboard',
    icon: 'home',
    roles: ['student', 'teacher', 'admin']
  },
  {
    name: 'lessons',
    path: '/lessons',
    icon: 'book',
    roles: ['student', 'teacher', 'admin']
  },
  {
    name: 'tasks',
    path: '/tasks',
    icon: 'clipboard',
    roles: ['student', 'teacher', 'admin']
  },
  {
    name: 'games',
    path: '/games',
    icon: 'gamepad',
    roles: ['student', 'teacher', 'admin']
  },
  {
    name: 'chat',
    path: '/chat',
    icon: 'chat',
    roles: ['student', 'teacher', 'admin']
  }
]

// Breakpoints
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  OFFLINE_ERROR: 'You are offline. Some features may not be available.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  LESSON_COMPLETED: 'Lesson completed! Great job!',
  TASK_COMPLETED: 'Task completed! You earned XP!',
  GAME_COMPLETED: 'Game completed! Check your achievements!'
}

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf']
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50
}

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000 // 24 hours
}

// Network Status
export const NETWORK_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  SLOW: 'slow'
}

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

// Font Sizes (for accessibility)
export const FONT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
}

// Color Schemes (for accessibility)
export const COLOR_SCHEMES = {
  NORMAL: 'normal',
  HIGH_CONTRAST: 'high-contrast',
  COLORBLIND_FRIENDLY: 'colorblind-friendly'
}

// Game Difficulty Levels
export const GAME_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
}

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
}

// Avatar Customization Options
export const AVATAR_OPTIONS = {
  SKIN_TONES: ['#F5DEB3', '#DEB887', '#D2B48C', '#BC9A6A', '#8B4513', '#654321'],
  HAIR_COLORS: ['#000000', '#8B4513', '#DAA520', '#FF6347', '#4B0082'],
  CLOTHING_COLORS: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
}

// Regional Banking Terms (for localization)
export const BANKING_TERMS = {
  en: {
    account: 'Account',
    balance: 'Balance',
    transaction: 'Transaction',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    loan: 'Loan',
    interest: 'Interest',
    savings: 'Savings'
  },
  hi: {
    account: 'खाता',
    balance: 'शेष राशि',
    transaction: 'लेन-देन',
    deposit: 'जमा',
    withdrawal: 'निकासी',
    loan: 'ऋण',
    interest: 'ब्याज',
    savings: 'बचत'
  },
  kn: {
    account: 'ಖಾತೆ',
    balance: 'ಬಾಕಿ',
    transaction: 'ವ್ಯವಹಾರ',
    deposit: 'ಠೇವಣಿ',
    withdrawal: 'ಹಿಂಪಡೆಯುವಿಕೆ',
    loan: 'ಸಾಲ',
    interest: 'ಬಡ್ಡಿ',
    savings: 'ಉಳಿತಾಯ'
  }
}

export default {
  API_BASE_URL,
  USER_ROLES,
  LESSON_CATEGORIES,
  DIFFICULTY_LEVELS,
  TASK_TYPES,
  GAME_TYPES,
  ACHIEVEMENT_TYPES,
  XP_REWARDS,
  HEALTH_VALUES,
  STORAGE_KEYS,
  SUPPORTED_LANGUAGES,
  NAVIGATION_ITEMS,
  BREAKPOINTS,
  ANIMATION_DURATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  UPLOAD_LIMITS,
  PAGINATION,
  CACHE_DURATION,
  NETWORK_STATUS,
  THEMES,
  FONT_SIZES,
  COLOR_SCHEMES,
  GAME_DIFFICULTY,
  NOTIFICATION_TYPES,
  AVATAR_OPTIONS,
  BANKING_TERMS
}