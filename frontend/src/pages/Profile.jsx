import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
// Icons replaced with emojis

import { useAuth } from '../hooks/useAuth'
import { usersAPI } from '../utils/api'
import { USER_ROLES, SUPPORTED_LANGUAGES, THEMES } from '../utils/constants'

const Profile = () => {
  const { t } = useTranslation()
  const { user, updateProfile, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  })

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phoneNumber || '',
        avatar: user.avatar || ''
      })
    }
  }, [user])
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'light',
    notifications: true,
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false
    }
  })

  // Update preferences when user changes
  useEffect(() => {
    if (user) {
      setPreferences({
        language: user.preferences?.language || 'en',
        theme: user.preferences?.theme || 'light',
        notifications: user.preferences?.notifications || true,
        accessibility: user.preferences?.accessibility || {
          fontSize: 'medium',
          highContrast: false,
          reducedMotion: false
        }
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const profileData = {
        name: formData.name,
        email: formData.email,
        profile: {
          phoneNumber: formData.phone || undefined
        }
      }
      const result = await updateProfile(profileData)
      if (result.success) {
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    try {
      setLoading(true)
      const response = await api.put('/users/preferences', preferences)
      updateUser(response.data)
    } catch (error) {
      console.error('Error updating preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      setLoading(true)
      const response = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      updateUser(response.data)
    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case 'student': return t('profile.roles.student')
      case 'teacher': return t('profile.roles.teacher')
      case 'admin': return t('profile.roles.admin')
      default: return role
    }
  }

  const getLevelColor = (level) => {
    if (level >= 10) return 'text-purple-600'
    if (level >= 5) return 'text-blue-600'
    return 'text-green-600'
  }

  const tabs = [
    { id: 'profile', label: t('profile.tabs.profile'), icon: '👤' },
    { id: 'preferences', label: t('profile.tabs.preferences'), icon: '⚙️' },
    { id: 'achievements', label: t('profile.tabs.achievements'), icon: '🏆' },
    { id: 'stats', label: t('profile.tabs.stats'), icon: '📈' }
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('profile.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('profile.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {/* Avatar Section */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <span>📷</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {getRoleLabel(user?.role)}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('profile.level')}</span>
                <span className={`font-bold ${getLevelColor(user?.level || 1)}`}>
                  {user?.level || 1}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('profile.xp')}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {user?.xp || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('profile.health')}</span>
                <span className="font-bold text-green-600">
                  {user?.health || 100}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('profile.personalInfo')}
                  </h3>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span className="mr-2">✏️</span>
                      {t('profile.edit')}
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <span className="mr-2">💾</span>
                        {t('common.save')}
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="mr-2">❌</span>
                        {t('common.cancel')}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.name')}
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user?.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.email')}
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user?.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.phone')}
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user?.profile?.phoneNumber || t('profile.notProvided')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.memberSince')}
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('profile.notAvailable')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('profile.preferences')}
                </h3>

                <div className="space-y-6">
                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.language')}
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.nativeName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.theme')}
                    </label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      {Object.values(THEMES).map(theme => (
                        <option key={theme} value={theme}>
                          {t(`profile.themes.${theme}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notifications */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.notifications}
                        onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                        className="mr-3"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('profile.enableNotifications')}
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('profile.achievements')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user?.achievements?.map((achievement, index) => (
                    <div key={index} className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold">{achievement.name}</h4>
                          <p className="text-sm opacity-90">{achievement.description}</p>
                        </div>
                        <span className="text-2xl">🏆</span>
                      </div>
                    </div>
                  ))}
                </div>

                {(!user?.achievements || user.achievements.length === 0) && (
                  <div className="text-center py-12">
                    <span className="text-6xl text-gray-400 mx-auto mb-4 block">🏆</span>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t('profile.noAchievements')}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('profile.startLearning')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {t('profile.statistics')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">{t('profile.lessonsCompleted')}</p>
                        <p className="text-3xl font-bold">{user?.stats?.lessonsCompleted || 0}</p>
                      </div>
                      <span className="text-2xl">🎯</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">{t('profile.tasksCompleted')}</p>
                        <p className="text-3xl font-bold">{user?.stats?.tasksCompleted || 0}</p>
                      </div>
                      <span className="text-2xl">📈</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">{t('profile.gamesPlayed')}</p>
                        <p className="text-3xl font-bold">{user?.stats?.gamesPlayed || 0}</p>
                      </div>
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 