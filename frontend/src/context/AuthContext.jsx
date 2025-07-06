import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../utils/api'
import { setAuthToken, getAuthToken, removeAuthToken, setUserData, getUserData, removeUserData } from '../utils/storage'
import toast from 'react-hot-toast'

// Initial state
const initialState = {
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
}

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        loading: false,
      }
    
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('AuthContext: Initializing auth state...')
      try {
        const token = getAuthToken()
        const userData = getUserData()
        
        console.log('AuthContext: Token found:', !!token, 'User data found:', !!userData)

        if (token && userData) {
          // Verify token is still valid
          try {
            console.log('AuthContext: Verifying token with backend...')
            const response = await authAPI.getProfile()
            console.log('AuthContext: Token verified, user:', response.data.user)
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: response.data.user,
                token,
              },
            })
          } catch (error) {
            console.log('AuthContext: Token verification failed:', error.message)
            // Token is invalid, clear storage
            removeAuthToken()
            removeUserData()
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
          }
        } else {
          console.log('AuthContext: No token or user data found, setting loading to false')
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
        }
      } catch (error) {
        console.error('AuthContext: Auth initialization error:', error)
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      
      const response = await authAPI.login(credentials)
      const { user, token } = response.data

      // Store in localStorage
      setAuthToken(token)
      setUserData(user)

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      })

      toast.success('Welcome back!')
      return { success: true, user, token }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR })
      const errorMessage = error.response?.data?.message || 'Login failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      
      const response = await authAPI.register(userData)
      const { user, token } = response.data

      // Store in localStorage
      setAuthToken(token)
      setUserData(user)

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      })

      toast.success('Account created successfully!')
      return { success: true, user, token }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR })
      const errorMessage = error.response?.data?.message || 'Registration failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error)
    } finally {
      // Clear storage
      removeAuthToken()
      removeUserData()

      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      toast.success('Logged out successfully')
    }
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData)
      const updatedUser = response.data.user

      // Update storage
      setUserData(updatedUser)

      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: updatedUser,
      })

      toast.success('Profile updated successfully!')
      return { success: true, user: updatedUser }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Upload avatar
  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await authAPI.uploadAvatar(formData)
      const avatarUrl = response.data.avatar

      // Update user data with new avatar
      const updatedUser = { ...state.user, avatar: avatarUrl }
      setUserData(updatedUser)

      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: { avatar: avatarUrl },
      })

      toast.success('Avatar updated successfully!')
      return { success: true, avatarUrl }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Avatar upload failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role)
  }

  // Get user's full name or email
  const getUserDisplayName = () => {
    return state.user?.name || state.user?.email || 'User'
  }

  // Get user's avatar URL
  const getUserAvatarUrl = () => {
    return state.user?.avatarUrl || null
  }

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    
    // Utilities
    hasRole,
    hasAnyRole,
    getUserDisplayName,
    getUserAvatarUrl,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext