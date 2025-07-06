import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
// Icons replaced with emojis

import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'
import { LESSON_CATEGORIES, DIFFICULTY_LEVELS } from '../utils/constants'

// Lesson List Component
const LessonList = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      const response = await api.get('/lessons')
      setLessons(response.data)
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Banking': return '🏦'
      case 'Budgeting': return '💰'
      case 'Investing': return '📈'
      case 'Financing': return '🏠'
      default: return '📚'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('lessons.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('lessons.subtitle')}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={t('lessons.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div className="flex-1 min-w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">{t('lessons.allCategories')}</option>
              {Object.values(LESSON_CATEGORIES).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex-1 min-w-48">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">{t('lessons.allDifficulties')}</option>
              {Object.values(DIFFICULTY_LEVELS).map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {t(`lessons.difficulty.${difficulty}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <motion.div
            key={lesson._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/lessons/${lesson._id}`)}
          >
            {/* Lesson Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
              <span className="text-6xl">{getCategoryIcon(lesson.category)}</span>
              {lesson.completed && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              )}
            </div>

            {/* Lesson Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                  {t(`lessons.difficulty.${lesson.difficulty}`)}
                </span>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm">{lesson.rating || 4.5}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {lesson.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {lesson.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{lesson.duration} min</span>
                </div>
                
                <div className="flex items-center">
                  {lesson.completed ? (
                    <span className="text-green-600 text-sm font-medium">
                      {t('lessons.completed')}
                    </span>
                  ) : (
                    <Play className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('lessons.noLessonsFound')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('lessons.tryAdjustingFilters')}
          </p>
        </div>
      )}
    </div>
  )
}

// Lesson Detail Component
const LessonDetail = () => {
  const { t } = useTranslation()
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/lessons/${lessonId}`)
      setLesson(response.data)
    } catch (error) {
      console.error('Error fetching lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteLesson = async () => {
    try {
      await api.post(`/lessons/${lessonId}/complete`)
      // Update lesson completion status
      setLesson(prev => ({ ...prev, completed: true }))
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('lessons.lessonNotFound')}
          </h2>
          <button
            onClick={() => navigate('/lessons')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('common.backToLessons')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/lessons')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        {t('common.back')}
      </button>

      {/* Lesson Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {lesson.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {lesson.description}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{lesson.duration} min</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                <span>{lesson.rating || 4.5}</span>
              </div>
            </div>
          </div>
          
          {lesson.completed && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-6 w-6 mr-2" />
              <span className="font-medium">{t('lessons.completed')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="prose dark:prose-invert max-w-none">
          {lesson.content && (
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          )}
        </div>

        {/* Lesson Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/lessons')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              {t('common.back')}
            </button>
            
            {!lesson.completed && (
              <button
                onClick={handleCompleteLesson}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('lessons.markAsComplete')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Lessons Component
const Lessons = () => {
  return (
    <Routes>
      <Route path="/" element={<LessonList />} />
      <Route path="/:lessonId" element={<LessonDetail />} />
    </Routes>
  )
}

export default Lessons 