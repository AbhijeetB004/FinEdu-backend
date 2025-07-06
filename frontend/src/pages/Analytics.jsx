import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
// Icons replaced with emojis
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Analytics = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [analytics, setAnalytics] = useState({
    overview: {},
    progress: {},
    activities: {},
    achievements: {}
  })

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/analytics?timeRange=${timeRange}`)
      setAnalytics(response.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    if (percentage >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatPercentage = (num) => {
    return `${num.toFixed(1)}%`
  }

  // Chart data
  const progressData = {
    labels: analytics.progress?.labels || [],
    datasets: [
      {
        label: t('analytics.lessons'),
        data: analytics.progress?.lessons || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: t('analytics.tasks'),
        data: analytics.progress?.tasks || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: t('analytics.games'),
        data: analytics.progress?.games || [],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const activityData = {
    labels: analytics.activities?.labels || [],
    datasets: [
      {
        label: t('analytics.dailyActivity'),
        data: analytics.activities?.data || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      },
    ],
  }

  const categoryData = {
    labels: analytics.achievements?.categories?.labels || [],
    datasets: [
      {
        data: analytics.achievements?.categories?.data || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('analytics.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('analytics.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="week">{t('analytics.thisWeek')}</option>
              <option value="month">{t('analytics.thisMonth')}</option>
              <option value="quarter">{t('analytics.thisQuarter')}</option>
              <option value="year">{t('analytics.thisYear')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.totalLessons')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(analytics.overview?.totalLessons || 0)}
              </p>
              <div className="flex items-center mt-2">
                {getTrendIcon(analytics.overview?.lessonsTrend || 0)}
                <span className={`ml-1 text-sm ${getProgressColor(analytics.overview?.lessonsTrend || 0)}`}>
                  {formatPercentage(Math.abs(analytics.overview?.lessonsTrend || 0))}
                </span>
              </div>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.completedTasks')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(analytics.overview?.completedTasks || 0)}
              </p>
              <div className="flex items-center mt-2">
                {getTrendIcon(analytics.overview?.tasksTrend || 0)}
                <span className={`ml-1 text-sm ${getProgressColor(analytics.overview?.tasksTrend || 0)}`}>
                  {formatPercentage(Math.abs(analytics.overview?.tasksTrend || 0))}
                </span>
              </div>
            </div>
            <CheckSquare className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.gamesPlayed')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(analytics.overview?.gamesPlayed || 0)}
              </p>
              <div className="flex items-center mt-2">
                {getTrendIcon(analytics.overview?.gamesTrend || 0)}
                <span className={`ml-1 text-sm ${getProgressColor(analytics.overview?.gamesTrend || 0)}`}>
                  {formatPercentage(Math.abs(analytics.overview?.gamesTrend || 0))}
                </span>
              </div>
            </div>
            <Zap className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.achievements')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(analytics.overview?.achievements || 0)}
              </p>
              <div className="flex items-center mt-2">
                {getTrendIcon(analytics.overview?.achievementsTrend || 0)}
                <span className={`ml-1 text-sm ${getProgressColor(analytics.overview?.achievementsTrend || 0)}`}>
                  {formatPercentage(Math.abs(analytics.overview?.achievementsTrend || 0))}
                </span>
              </div>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.progressOverTime')}
          </h3>
          <div className="h-64">
            <Line data={progressData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.dailyActivity')}
          </h3>
          <div className="h-64">
            <Bar data={activityData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.categoryDistribution')}
          </h3>
          <div className="h-64">
            <Doughnut data={categoryData} options={doughnutOptions} />
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.recentAchievements')}
          </h3>
          <div className="space-y-3">
            {analytics.achievements?.recent?.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {achievement.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(achievement.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {(!analytics.achievements?.recent || analytics.achievements.recent.length === 0) && (
              <p className="text-gray-500 text-center py-4">
                {t('analytics.noRecentAchievements')}
              </p>
            )}
          </div>
        </motion.div>

        {/* Learning Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('analytics.learningGoals')}
          </h3>
          <div className="space-y-4">
            {analytics.goals?.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {goal.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {goal.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {(!analytics.goals || analytics.goals.length === 0) && (
              <p className="text-gray-500 text-center py-4">
                {t('analytics.noGoalsSet')}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics 