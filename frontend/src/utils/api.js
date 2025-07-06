import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL, STORAGE_KEYS, ERROR_MESSAGES } from './constants'
import { getStoredData, removeStoredData } from './storage'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for slow connections
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getStoredData(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response, request } = error

    // Network error (no response)
    if (!response) {
      if (!navigator.onLine) {
        toast.error('You are offline. Please check your connection.')
      } else {
        toast.error(ERROR_MESSAGES.NETWORK_ERROR)
      }
      return Promise.reject(error)
    }

    // Handle different status codes
    switch (response.status) {
      case 401:
        // Unauthorized - clear auth data and redirect to login
        removeStoredData(STORAGE_KEYS.AUTH_TOKEN)
        removeStoredData(STORAGE_KEYS.USER_DATA)
        window.location.href = '/login'
        toast.error('Session expired. Please login again.')
        break

      case 403:
        toast.error('You are not authorized to perform this action.')
        break

      case 404:
        toast.error('The requested resource was not found.')
        break

      case 422:
        // Validation errors
        const validationErrors = response.data?.errors || response.data?.message
        if (Array.isArray(validationErrors)) {
          validationErrors.forEach(error => toast.error(error))
        } else if (typeof validationErrors === 'string') {
          toast.error(validationErrors)
        } else {
          toast.error(ERROR_MESSAGES.VALIDATION_ERROR)
        }
        break

      case 429:
        toast.error('Too many requests. Please try again later.')
        break

      case 500:
      case 502:
      case 503:
      case 504:
        toast.error('Server error. Please try again later.')
        break

      default:
        const errorMessage = response.data?.message || ERROR_MESSAGES.GENERIC_ERROR
        toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  uploadAvatar: (formData) => api.post('/auth/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

export const lessonsAPI = {
  getAll: (params) => api.get('/lessons', { params }),
  getById: (id) => api.get(`/lessons/${id}`),
  create: (data) => api.post('/lessons', data),
  update: (id, data) => api.put(`/lessons/${id}`, data),
  delete: (id) => api.delete(`/lessons/${id}`),
  complete: (id, data) => api.post(`/lessons/${id}/complete`, data),
}

export const tasksAPI = {
  getUserTasks: (params) => api.get('/tasks', { params }),
  getAssignedTasks: (params) => api.get('/tasks/assigned', { params }),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  complete: (id, data) => api.post(`/tasks/${id}/complete`, data),
}

export const gamesAPI = {
  startSession: (data) => api.post('/games/session', data),
  updateSession: (id, data) => api.put(`/games/session/${id}`, data),
  completeSession: (id, data) => api.post(`/games/session/${id}/complete`, data),
  getLeaderboard: (gameType, params) => api.get(`/games/leaderboard/${gameType}`, { params }),
  getStats: () => api.get('/games/stats'),
}

export const chatbotAPI = {
  ask: (data) => api.post('/chatbot/ask', data),
  getHistory: (params) => api.get('/chatbot/history', { params }),
}

export const analyticsAPI = {
  getStudentProgress: (id) => api.get(`/analytics/student/${id}`),
  getClassOverview: (params) => api.get('/analytics/class-overview', { params }),
  exportReport: (params) => api.get('/analytics/export-report', { params }),
}

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStudents: (params) => api.get('/users/students', { params }),
  getTeachers: (params) => api.get('/users/teachers', { params }),
  updateProfile: (data) => api.put('/users/profile', data),
}

// Utility functions for handling API responses
export const handleApiError = (error, customMessage) => {
  console.error('API Error:', error)
  
  if (customMessage) {
    toast.error(customMessage)
  }
  
  return {
    success: false,
    error: error.response?.data?.message || ERROR_MESSAGES.GENERIC_ERROR,
    status: error.response?.status
  }
}

export const handleApiSuccess = (response, successMessage) => {
  if (successMessage) {
    toast.success(successMessage)
  }
  
  return {
    success: true,
    data: response.data,
    status: response.status
  }
}

// Network status checker
export const checkNetworkStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'HEAD',
      cache: 'no-cache'
    })
    return response.ok
  } catch (error) {
    return false
  }
}

// Retry mechanism for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
}

// Batch requests for better performance
export const batchRequests = async (requests) => {
  try {
    const responses = await Promise.allSettled(requests)
    return responses.map((response, index) => ({
      index,
      success: response.status === 'fulfilled',
      data: response.status === 'fulfilled' ? response.value.data : null,
      error: response.status === 'rejected' ? response.reason : null
    }))
  } catch (error) {
    console.error('Batch request error:', error)
    throw error
  }
}

// Upload progress handler
export const uploadWithProgress = (url, formData, onProgress) => {
  return api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      if (onProgress) {
        onProgress(percentCompleted)
      }
    }
  })
}

export default api