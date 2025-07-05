import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { setGameProgress, getGameProgress, getAllGameProgress } from '../utils/storage'
import { calculateLevel, calculateXPForNextLevel, calculateXPProgress } from '../utils/helpers'
import { XP_REWARDS, HEALTH_VALUES, ACHIEVEMENT_TYPES } from '../utils/constants'
import toast from 'react-hot-toast'

// Initial state
const initialState = {
  avatar: {
    level: 1,
    xp: 0,
    health: 100,
    streak: 0,
    maxStreak: 0,
    totalLessonsCompleted: 0,
    totalTasksCompleted: 0,
    totalGamesPlayed: 0,
    achievements: [],
    inventory: [],
    lastActivityDate: new Date().toISOString(),
  },
  gameSession: null,
  leaderboard: [],
  achievements: [],
  loading: false,
}

// Action types
const GAME_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  UPDATE_AVATAR: 'UPDATE_AVATAR',
  ADD_XP: 'ADD_XP',
  UPDATE_HEALTH: 'UPDATE_HEALTH',
  UPDATE_STREAK: 'UPDATE_STREAK',
  ADD_ACHIEVEMENT: 'ADD_ACHIEVEMENT',
  ADD_INVENTORY_ITEM: 'ADD_INVENTORY_ITEM',
  REMOVE_INVENTORY_ITEM: 'REMOVE_INVENTORY_ITEM',
  START_GAME_SESSION: 'START_GAME_SESSION',
  UPDATE_GAME_SESSION: 'UPDATE_GAME_SESSION',
  END_GAME_SESSION: 'END_GAME_SESSION',
  UPDATE_LEADERBOARD: 'UPDATE_LEADERBOARD',
  RESET_AVATAR: 'RESET_AVATAR',
}

// Reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case GAME_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    
    case GAME_ACTIONS.UPDATE_AVATAR:
      return {
        ...state,
        avatar: { ...state.avatar, ...action.payload },
      }
    
    case GAME_ACTIONS.ADD_XP: {
      const newXP = state.avatar.xp + action.payload
      const newLevel = calculateLevel(newXP)
      const leveledUp = newLevel > state.avatar.level
      
      return {
        ...state,
        avatar: {
          ...state.avatar,
          xp: newXP,
          level: newLevel,
          lastActivityDate: new Date().toISOString(),
        },
        leveledUp,
      }
    }
    
    case GAME_ACTIONS.UPDATE_HEALTH:
      return {
        ...state,
        avatar: {
          ...state.avatar,
          health: Math.max(0, Math.min(100, state.avatar.health + action.payload)),
        },
      }
    
    case GAME_ACTIONS.UPDATE_STREAK: {
      const newStreak = action.payload
      const newMaxStreak = Math.max(state.avatar.maxStreak, newStreak)
      
      return {
        ...state,
        avatar: {
          ...state.avatar,
          streak: newStreak,
          maxStreak: newMaxStreak,
          lastActivityDate: new Date().toISOString(),
        },
      }
    }
    
    case GAME_ACTIONS.ADD_ACHIEVEMENT: {
      const achievement = action.payload
      if (state.avatar.achievements.includes(achievement)) {
        return state
      }
      
      return {
        ...state,
        avatar: {
          ...state.avatar,
          achievements: [...state.avatar.achievements, achievement],
        },
      }
    }
    
    case GAME_ACTIONS.ADD_INVENTORY_ITEM: {
      const { item, quantity = 1 } = action.payload
      const existingItem = state.avatar.inventory.find(inv => inv.item === item)
      
      let newInventory
      if (existingItem) {
        newInventory = state.avatar.inventory.map(inv =>
          inv.item === item
            ? { ...inv, quantity: inv.quantity + quantity }
            : inv
        )
      } else {
        newInventory = [
          ...state.avatar.inventory,
          { item, quantity, acquiredAt: new Date().toISOString() }
        ]
      }
      
      return {
        ...state,
        avatar: {
          ...state.avatar,
          inventory: newInventory,
        },
      }
    }
    
    case GAME_ACTIONS.REMOVE_INVENTORY_ITEM: {
      const { item, quantity = 1 } = action.payload
      const newInventory = state.avatar.inventory
        .map(inv => {
          if (inv.item === item) {
            const newQuantity = inv.quantity - quantity
            return newQuantity > 0 ? { ...inv, quantity: newQuantity } : null
          }
          return inv
        })
        .filter(Boolean)
      
      return {
        ...state,
        avatar: {
          ...state.avatar,
          inventory: newInventory,
        },
      }
    }
    
    case GAME_ACTIONS.START_GAME_SESSION:
      return {
        ...state,
        gameSession: {
          ...action.payload,
          startTime: Date.now(),
        },
      }
    
    case GAME_ACTIONS.UPDATE_GAME_SESSION:
      return {
        ...state,
        gameSession: {
          ...state.gameSession,
          ...action.payload,
        },
      }
    
    case GAME_ACTIONS.END_GAME_SESSION:
      return {
        ...state,
        gameSession: null,
        avatar: {
          ...state.avatar,
          totalGamesPlayed: state.avatar.totalGamesPlayed + 1,
        },
      }
    
    case GAME_ACTIONS.UPDATE_LEADERBOARD:
      return {
        ...state,
        leaderboard: action.payload,
      }
    
    case GAME_ACTIONS.RESET_AVATAR:
      return {
        ...state,
        avatar: initialState.avatar,
      }
    
    default:
      return state
  }
}

// Create context
const GameContext = createContext()

// Provider component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Load game progress from storage on mount
  useEffect(() => {
    const savedProgress = getAllGameProgress()
    if (savedProgress.avatar) {
      dispatch({
        type: GAME_ACTIONS.UPDATE_AVATAR,
        payload: savedProgress.avatar,
      })
    }
  }, [])

  // Save game progress to storage whenever avatar changes
  useEffect(() => {
    setGameProgress('avatar', state.avatar)
  }, [state.avatar])

  // Add XP and handle level ups
  const addXP = (amount, source = 'general') => {
    const oldLevel = state.avatar.level
    
    dispatch({
      type: GAME_ACTIONS.ADD_XP,
      payload: amount,
    })

    const newLevel = calculateLevel(state.avatar.xp + amount)
    
    // Check for level up
    if (newLevel > oldLevel) {
      toast.success(`🎉 Level Up! You're now level ${newLevel}!`, {
        duration: 5000,
      })
      
      // Add level up achievements
      if (newLevel === 5) {
        addAchievement(ACHIEVEMENT_TYPES.LEVEL_5)
      } else if (newLevel === 10) {
        addAchievement(ACHIEVEMENT_TYPES.LEVEL_10)
      }
      
      // Restore some health on level up
      updateHealth(10)
    }

    // Show XP gained notification
    toast.success(`+${amount} XP earned!`, {
      icon: '⭐',
      duration: 2000,
    })
  }

  // Update health
  const updateHealth = (amount) => {
    dispatch({
      type: GAME_ACTIONS.UPDATE_HEALTH,
      payload: amount,
    })

    if (amount < 0) {
      toast.error(`-${Math.abs(amount)} Health`, {
        icon: '💔',
        duration: 2000,
      })
    } else if (amount > 0) {
      toast.success(`+${amount} Health`, {
        icon: '❤️',
        duration: 2000,
      })
    }
  }

  // Update streak
  const updateStreak = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const lastActivity = new Date(state.avatar.lastActivityDate)
    lastActivity.setHours(0, 0, 0, 0)
    
    const diffTime = today - lastActivity
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    let newStreak = state.avatar.streak
    
    if (diffDays === 1) {
      // Consecutive day
      newStreak += 1
      toast.success(`🔥 ${newStreak} day streak!`, {
        duration: 3000,
      })
      
      // Add streak achievements
      if (newStreak === 7) {
        addAchievement(ACHIEVEMENT_TYPES.STREAK_7)
      } else if (newStreak === 30) {
        addAchievement(ACHIEVEMENT_TYPES.STREAK_30)
      }
      
      // Streak bonus XP
      addXP(XP_REWARDS.STREAK_BONUS, 'streak')
    } else if (diffDays > 1) {
      // Streak broken
      if (state.avatar.streak > 0) {
        toast.error('Streak broken! Start a new one today.', {
          icon: '💔',
          duration: 3000,
        })
      }
      newStreak = 1
    } else if (diffDays === 0) {
      // Same day, no change
      return
    }
    
    dispatch({
      type: GAME_ACTIONS.UPDATE_STREAK,
      payload: newStreak,
    })
  }

  // Add achievement
  const addAchievement = (achievement) => {
    if (state.avatar.achievements.includes(achievement)) {
      return false
    }
    
    dispatch({
      type: GAME_ACTIONS.ADD_ACHIEVEMENT,
      payload: achievement,
    })

    toast.success(`🏆 Achievement Unlocked: ${achievement.replace('_', ' ').toUpperCase()}!`, {
      duration: 5000,
    })

    // Achievement bonus XP
    addXP(XP_REWARDS.PERFECT_SCORE, 'achievement')
    
    return true
  }

  // Add item to inventory
  const addInventoryItem = (item, quantity = 1) => {
    dispatch({
      type: GAME_ACTIONS.ADD_INVENTORY_ITEM,
      payload: { item, quantity },
    })

    toast.success(`+${quantity} ${item} added to inventory!`, {
      icon: '🎁',
      duration: 2000,
    })
  }

  // Remove item from inventory
  const removeInventoryItem = (item, quantity = 1) => {
    const existingItem = state.avatar.inventory.find(inv => inv.item === item)
    
    if (!existingItem || existingItem.quantity < quantity) {
      toast.error(`Not enough ${item} in inventory!`)
      return false
    }
    
    dispatch({
      type: GAME_ACTIONS.REMOVE_INVENTORY_ITEM,
      payload: { item, quantity },
    })

    return true
  }

  // Complete lesson
  const completeLesson = (lessonData) => {
    const { score = 0, xpReward = XP_REWARDS.LESSON_COMPLETION } = lessonData
    
    // Add XP
    addXP(xpReward, 'lesson')
    
    // Update lesson count
    dispatch({
      type: GAME_ACTIONS.UPDATE_AVATAR,
      payload: {
        totalLessonsCompleted: state.avatar.totalLessonsCompleted + 1,
      },
    })
    
    // Check for achievements
    if (state.avatar.totalLessonsCompleted === 0) {
      addAchievement(ACHIEVEMENT_TYPES.FIRST_LESSON)
    }
    
    if (score === 100) {
      addAchievement(ACHIEVEMENT_TYPES.PERFECT_SCORE)
    }
    
    // Update streak
    updateStreak()
  }

  // Complete task
  const completeTask = (taskData) => {
    const { xpReward = XP_REWARDS.TASK_COMPLETION } = taskData
    
    // Add XP
    addXP(xpReward, 'task')
    
    // Update task count
    dispatch({
      type: GAME_ACTIONS.UPDATE_AVATAR,
      payload: {
        totalTasksCompleted: state.avatar.totalTasksCompleted + 1,
      },
    })
    
    // Update streak
    updateStreak()
  }

  // Start game session
  const startGameSession = (gameData) => {
    dispatch({
      type: GAME_ACTIONS.START_GAME_SESSION,
      payload: gameData,
    })
  }

  // Update game session
  const updateGameSession = (sessionData) => {
    dispatch({
      type: GAME_ACTIONS.UPDATE_GAME_SESSION,
      payload: sessionData,
    })
  }

  // Complete game
  const completeGame = (gameData) => {
    const { score = 0, xpReward = XP_REWARDS.GAME_COMPLETION } = gameData
    
    // Add XP
    addXP(xpReward, 'game')
    
    // End session
    dispatch({
      type: GAME_ACTIONS.END_GAME_SESSION,
    })
    
    // Check for achievements
    if (score === 100) {
      addAchievement(ACHIEVEMENT_TYPES.PERFECT_SCORE)
    }
    
    // Update streak
    updateStreak()
  }

  // Use health potion
  const useHealthPotion = () => {
    const hasPotion = state.avatar.inventory.find(item => item.item === 'Health Potion')
    
    if (!hasPotion || hasPotion.quantity < 1) {
      toast.error('No health potions available!')
      return false
    }
    
    removeInventoryItem('Health Potion', 1)
    updateHealth(25)
    
    return true
  }

  // Get avatar stats
  const getAvatarStats = () => {
    const { level, xp, health, streak, maxStreak } = state.avatar
    
    return {
      level,
      xp,
      health,
      streak,
      maxStreak,
      xpForNextLevel: calculateXPForNextLevel(level),
      xpProgress: calculateXPProgress(xp, level),
      healthPercentage: health,
      totalLessonsCompleted: state.avatar.totalLessonsCompleted,
      totalTasksCompleted: state.avatar.totalTasksCompleted,
      totalGamesPlayed: state.avatar.totalGamesPlayed,
      achievements: state.avatar.achievements,
      inventory: state.avatar.inventory,
    }
  }

  // Reset avatar (for testing or new user)
  const resetAvatar = () => {
    dispatch({
      type: GAME_ACTIONS.RESET_AVATAR,
    })
    
    toast.success('Avatar reset successfully!')
  }

  // Context value
  const value = {
    // State
    avatar: state.avatar,
    gameSession: state.gameSession,
    leaderboard: state.leaderboard,
    loading: state.loading,
    
    // Actions
    addXP,
    updateHealth,
    updateStreak,
    addAchievement,
    addInventoryItem,
    removeInventoryItem,
    completeLesson,
    completeTask,
    startGameSession,
    updateGameSession,
    completeGame,
    useHealthPotion,
    resetAvatar,
    
    // Utilities
    getAvatarStats,
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

// Custom hook to use game context
export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export default GameContext