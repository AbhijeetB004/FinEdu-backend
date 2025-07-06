import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
// Icons replaced with emojis
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useGame } from '../hooks/useGameification'
import { tasksAPI } from '../utils/api'

const Dashboard = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { getAvatarStats } = useGame()
  
  const avatarStats = getAvatarStats()
  const [todaysTasks, setTodaysTasks] = React.useState([])
  const [loadingTasks, setLoadingTasks] = React.useState(true)

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true)
        const response = await tasksAPI.getUserTasks()
        // Filter for incomplete tasks and take the first 3
        const tasks = Array.isArray(response.data.tasks)
          ? response.data.tasks.filter(task => !task.completed).slice(0, 3)
          : []
        setTodaysTasks(tasks)
      } catch (error) {
        setTodaysTasks([])
      } finally {
        setLoadingTasks(false)
      }
    }
    fetchTasks()
  }, [])

  const recentLessons = [
    {
      id: 1,
      title: 'Introduction to Savings',
      progress: 75,
      category: 'Banking',
      thumbnail: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Understanding Interest Rates',
      progress: 45,
      category: 'Banking',
      thumbnail: 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Budget Planning Basics',
      progress: 90,
      category: 'Budgeting',
      thumbnail: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ]

  const achievements = [
    { id: 1, name: 'First Lesson', icon: '🎓', unlocked: true },
    { id: 2, name: '7 Day Streak', icon: '🔥', unlocked: true },
    { id: 3, name: 'Perfect Score', icon: '⭐', unlocked: false },
    { id: 4, name: 'Level 5', icon: '🏆', unlocked: false }
  ]

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume your last lesson',
      icon: '📚',
      color: 'bg-blue-500',
      link: '/lessons'
    },
    {
      title: 'View Tasks',
      description: 'Check your assignments',
      icon: '✅',
      color: 'bg-green-500',
      link: '/tasks'
    },
    {
      title: 'Play Games',
      description: 'Learn through games',
      icon: '⚡',
      color: 'bg-purple-500',
      link: '/games'
    },
    {
      title: 'Ask AI Assistant',
      description: 'Get help with questions',
      icon: '💬',
      color: 'bg-orange-500',
      link: '/chat'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants} className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('dashboard.welcome', { name: user?.name || 'Student' })}
            </h1>
            <p className="text-gray-600">
              Ready to continue your financial learning journey?
            </p>
          </motion.div>

          {/* Avatar Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="stat-value">{avatarStats.level}</div>
              <div className="stat-label text-yellow-100">{t('dashboard.level')}</div>
            </div>
            
            <div className="stat-card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="stat-value">{avatarStats.xp}</div>
              <div className="stat-label text-blue-100">{t('dashboard.xp')}</div>
            </div>
            
            <div className="stat-card bg-gradient-to-br from-red-400 to-red-600 text-white">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl">❤️</span>
              </div>
              <div className="stat-value">{avatarStats.health}%</div>
              <div className="stat-label text-red-100">{t('dashboard.health')}</div>
            </div>
            
            <div className="stat-card bg-gradient-to-br from-orange-400 to-orange-600 text-white">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="stat-value">{avatarStats.streak}</div>
              <div className="stat-label text-orange-100">{t('dashboard.streak')}</div>
            </div>
          </motion.div>

          {/* XP Progress Bar */}
          <motion.div variants={itemVariants} className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Level Progress</h3>
                <span className="text-sm text-gray-600">
                  {avatarStats.xp} / {avatarStats.xpForNextLevel} XP
                </span>
              </div>
              <div className="progress-bar h-3">
                <motion.div
                  className="progress-fill h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${avatarStats.xpProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {avatarStats.xpForNextLevel - avatarStats.xp} XP to next level
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Today's Goals */}
              <motion.div variants={itemVariants} className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <span className="mr-2 text-primary-600">🎯</span>
                      {t('dashboard.todaysGoals')}
                    </h2>
                    <Link to="/tasks" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View All
                    </Link>
                  </div>
                  
                  <div className="space-y-3">
                    {loadingTasks ? (
                      <div className="text-center text-gray-500">Loading...</div>
                    ) : todaysTasks.length === 0 ? (
                      <div className="text-center text-gray-500">No tasks for today!</div>
                    ) : (
                      todaysTasks.map((task) => (
                        <div
                          key={task._id}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            task.completed
                              ? 'border-green-200 bg-green-50'
                              : 'border-gray-200 bg-white hover:border-primary-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                task.completed
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300'
                              }`}>
                                {task.completed && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-white text-sm"
                                  >
                                    ✓
                                  </motion.div>
                                )}
                              </div>
                              <div>
                                <h3 className={`font-medium ${
                                  task.completed ? 'text-green-700 line-through' : 'text-gray-900'
                                }`}>
                                  {task.title}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <span className="mr-1">⏰</span>
                                    {task.estimatedDuration ? `${task.estimatedDuration} min` : ''}
                                  </span>
                                  <span className="flex items-center">
                                    <span className="mr-1">⚡</span>
                                    {task.xpReward ? `${task.xpReward} XP` : ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {!task.completed && (
                              <Link to="/tasks" className="btn btn-primary btn-sm">
                                Start
                              </Link>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Continue Learning */}
              <motion.div variants={itemVariants} className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <span className="mr-2 text-primary-600">📚</span>
                      {t('dashboard.continuelearning')}
                    </h2>
                    <Link to="/lessons" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View All
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentLessons.map((lesson) => (
                      <div key={lesson.id} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={lesson.thumbnail}
                            alt={lesson.title}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                            <span className="text-white text-2xl">▶</span>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="progress-bar h-1">
                              <div
                                className="progress-fill h-full"
                                style={{ width: `${lesson.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-600">{lesson.category}</p>
                          <p className="text-sm text-primary-600">{lesson.progress}% complete</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants} className="card">
                <div className="card-body">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {t('dashboard.quickActions')}
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                      <Link
                        key={index}
                        to={action.link}
                        className="group p-4 rounded-lg border border-gray-200 hover:border-primary-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                          <span className="text-white text-lg">{action.icon}</span>
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm mb-1">
                          {action.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {action.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Achievements */}
              <motion.div variants={itemVariants} className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <span className="mr-2 text-primary-600">🏆</span>
                      {t('dashboard.achievements')}
                    </h3>
                    <Link to="/profile" className="text-primary-600 hover:text-primary-700 text-sm">
                      View All
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-3 rounded-lg text-center transition-all duration-200 ${
                          achievement.unlocked
                            ? 'bg-primary-50 border border-primary-200'
                            : 'bg-gray-50 border border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="text-2xl mb-1">{achievement.icon}</div>
                        <p className={`text-xs font-medium ${
                          achievement.unlocked ? 'text-primary-700' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Weekly Progress */}
              <motion.div variants={itemVariants} className="card">
                <div className="card-body">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2 text-primary-600">📈</span>
                    Weekly Progress
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Lessons Completed</span>
                        <span className="font-medium">8/10</span>
                      </div>
                      <div className="progress-bar h-2">
                        <div className="progress-fill h-full" style={{ width: '80%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Tasks Completed</span>
                        <span className="font-medium">5/7</span>
                      </div>
                      <div className="progress-bar h-2">
                        <div className="progress-fill h-full" style={{ width: '71%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Games Played</span>
                        <span className="font-medium">3/5</span>
                      </div>
                      <div className="progress-bar h-2">
                        <div className="progress-fill h-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Calendar Widget */}
              <motion.div variants={itemVariants} className="card">
                <div className="card-body">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2 text-primary-600">📅</span>
                    This Week
                  </h3>
                  
                  <div className="space-y-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{day}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          index < 4
                            ? 'bg-green-100 text-green-600'
                            : index === 4
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {index < 4 ? '✓' : index === 4 ? '•' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard