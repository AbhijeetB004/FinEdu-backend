import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  Gamepad2, 
  MessageCircle, 
  User,
  Menu,
  X,
  BarChart3,
  Settings,
  LogOut
} from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { useGame } from '../../hooks/useGameification'

const Navigation = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { user, logout, hasRole } = useAuth()
  const { getAvatarStats } = useGame()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const avatarStats = getAvatarStats()

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: t('navigation.dashboard'),
        path: '/dashboard',
        icon: Home,
        roles: ['student', 'teacher', 'admin']
      },
      {
        name: t('navigation.lessons'),
        path: '/lessons',
        icon: BookOpen,
        roles: ['student', 'teacher', 'admin']
      },
      {
        name: t('navigation.tasks'),
        path: '/tasks',
        icon: CheckSquare,
        roles: ['student', 'teacher', 'admin']
      },
      {
        name: t('navigation.games'),
        path: '/games',
        icon: Gamepad2,
        roles: ['student', 'teacher', 'admin']
      },
      {
        name: t('navigation.chat'),
        path: '/chat',
        icon: MessageCircle,
        roles: ['student', 'teacher', 'admin']
      }
    ]

    // Add analytics for teachers and admins
    if (hasRole('teacher') || hasRole('admin')) {
      baseItems.push({
        name: t('navigation.analytics'),
        path: '/analytics',
        icon: BarChart3,
        roles: ['teacher', 'admin']
      })
    }

    return baseItems.filter(item => item.roles.includes(user?.role))
  }

  const navigationItems = getNavigationItems()

  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = async () => {
    await logout()
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold gradient-text">FinEdu</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = isActiveRoute(item.path)
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      flex items-center space-x-2
                      ${isActive 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-100 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Avatar Stats */}
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-medium">{avatarStats.level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-red-500">❤️</span>
                  <span className="font-medium">{avatarStats.health}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-orange-500">🔥</span>
                  <span className="font-medium">{avatarStats.streak}</span>
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      <span>{t('navigation.profile')}</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      <span>{t('navigation.settings')}</span>
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('navigation.logout')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
          <div className="flex items-center justify-between px-4 h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold gradient-text">FinEdu</span>
            </Link>

            {/* Avatar Stats */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-yellow-500">⭐{avatarStats.level}</span>
              <span className="text-red-500">❤️{avatarStats.health}%</span>
              <span className="text-orange-500">🔥{avatarStats.streak}</span>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={closeMobileMenu}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-medium">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user?.name}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      const isActive = isActiveRoute(item.path)
                      
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={closeMobileMenu}
                          className={`
                            flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors
                            ${isActive 
                              ? 'text-primary-600 bg-primary-50' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Additional Links */}
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <User className="w-5 h-5" />
                      <span>{t('navigation.profile')}</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={closeMobileMenu}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <Settings className="w-5 h-5" />
                      <span>{t('navigation.settings')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{t('navigation.logout')}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="flex items-center justify-around py-2">
            {navigationItems.slice(0, 5).map((item) => {
              const Icon = item.icon
              const isActive = isActiveRoute(item.path)
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'text-primary-600' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.name}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeBottomTab"
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-16 md:h-16" />
    </>
  )
}

export default Navigation