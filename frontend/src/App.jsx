import React, { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { clearCorruptedData } from './utils/storage'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { GameProvider } from './context/GameContext'

// Components
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner'
import OfflineIndicator from './components/common/OfflineIndicator'
import Navigation from './components/common/Navigation'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Lessons from './pages/Lessons'
import Tasks from './pages/Tasks'
import Games from './pages/Games'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Analytics from './pages/Analytics'

// Hooks
import { useAuth } from './hooks/useAuth'
import { useOffline } from './hooks/useOffline'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  console.log('ProtectedRoute - user:', user, 'loading:', loading)
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  console.log('PublicRoute - user:', user, 'loading:', loading)
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 20,
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
}

function App() {
  const { i18n } = useTranslation()
  const isOffline = useOffline()

  console.log('App component rendering - i18n:', i18n.language, 'isOffline:', isOffline)

  useEffect(() => {
    console.log('App useEffect - setting document properties')
    
    // Clear any corrupted localStorage data
    clearCorruptedData()
    
    // Set document direction based on language
    const direction = i18n.dir()
    document.documentElement.dir = direction
    document.documentElement.lang = i18n.language
    
    // Test API connection
    const testAPI = async () => {
      try {
        console.log('Testing API connection...')
        const response = await fetch('http://localhost:5000/health')
        console.log('API test response:', response.status)
      } catch (error) {
        console.error('API test failed:', error.message)
      }
    }
    
    testAPI()
  }, [i18n.language])

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <GameProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              {/* Offline Indicator */}
              {isOffline && <OfflineIndicator />}
              
              {/* Main App Content */}
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public Routes */}
                  <Route 
                    path="/" 
                    element={
                      <PublicRoute>
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Home />
                        </motion.div>
                      </PublicRoute>
                    } 
                  />
                  <Route 
                    path="/login" 
                    element={
                      <PublicRoute>
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Login />
                        </motion.div>
                      </PublicRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <PublicRoute>
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Register />
                        </motion.div>
                      </PublicRoute>
                    } 
                  />

                  {/* Protected Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <div className="pb-20 md:pb-0">
                          <Navigation />
                          <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                          >
                            <Dashboard />
                          </motion.div>
                        </div>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/lessons/*" 
                    element={
                      <ProtectedRoute>
                        <div className="pb-20 md:pb-0">
                          <Navigation />
                          <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                          >
                            <Lessons />
                          </motion.div>
                        </div>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/tasks" 
                    element={
                      <ProtectedRoute>
                        <div className="pb-20 md:pb-0">
                          <Navigation />
                          <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                          >
                            <Tasks />
                          </motion.div>
                        </div>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/games/*" 
                    element={
                      <ProtectedRoute>
                        <div className="pb-20 md:pb-0">
                          <Navigation />
                          <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                          >
                            <Games />
                          </motion.div>
                        </div>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <div className="pb-20 md:pb-0">
                          <Navigation />
                          <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                          >
                            <Profile />
                          </motion.div>
                        </div>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chat" 
                    element={
                      <ProtectedRoute>
                        <div className="pb-20 md:pb-0">
                          <Navigation />
                          <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                          >
                            <Chat />
                          </motion.div>
                        </div>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <ProtectedRoute>
                        <div className="pb-20 md:pb-0">
                          <Navigation />
                          <motion.div
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                          >
                            <Analytics />
                          </motion.div>
                        </div>
                      </ProtectedRoute>
                    } 
                  />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </div>
          </GameProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App