import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
// Icons replaced with emojis

import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'
import { TASK_TYPES } from '../utils/constants'

const Tasks = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showCompleted, setShowCompleted] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showEditTask, setShowEditTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'daily',
    dueDate: '',
    priority: 'medium'
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await api.get('/tasks')
      console.log('Tasks API response:', response.data)
      
      // Ensure tasks is always an array
      const tasksData = Array.isArray(response.data) ? response.data : 
                       Array.isArray(response.data.tasks) ? response.data.tasks : 
                       Array.isArray(response.data.data) ? response.data.data : []
      
      console.log('Processed tasks data:', tasksData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      // Provide mock data for testing when API fails
      const mockTasks = [
        {
          _id: '1',
          title: 'Complete Financial Basics Lesson',
          description: 'Learn about basic financial concepts',
          type: 'daily',
          priority: 'high',
          completed: false,
          dueDate: new Date().toISOString(),
          xp: 10,
          assignedBy: user?._id
        },
        {
          _id: '2',
          title: 'Create a Budget Plan',
          description: 'Practice creating a personal budget',
          type: 'weekly',
          priority: 'medium',
          completed: true,
          dueDate: new Date().toISOString(),
          xp: 15,
          assignedBy: user?._id
        },
        {
          _id: '3',
          title: 'Take Investment Quiz',
          description: 'Test your knowledge about investments',
          type: 'custom',
          priority: 'low',
          completed: false,
          dueDate: new Date().toISOString(),
          xp: 20,
          assignedBy: user?._id
        }
      ]
      setTasks(mockTasks)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/tasks', newTask)
      setTasks(prev => [...prev, response.data])
      setNewTask({
        title: '',
        description: '',
        type: 'daily',
        dueDate: '',
        priority: 'medium'
      })
      setShowAddTask(false)
      alert('Task created successfully!')
    } catch (error) {
      console.error('Error adding task:', error)
      if (error.response?.status === 422) {
        alert('Please check your input and try again.')
      } else {
        alert('Failed to create task. Please try again.')
      }
    }
  }

  const handleToggleTask = async (taskId, completed) => {
    try {
      const response = await api.post(`/tasks/${taskId}/complete`, { completed: !completed })
      setTasks(prev => prev.map(task => 
        task._id === taskId ? { ...task, completed: response.data.completed } : task
      ))
    } catch (error) {
      console.error('Error updating task:', error)
      // Show user-friendly error message
      if (error.response?.status === 403) {
        alert('You are not authorized to modify this task.')
      } else {
        alert('Failed to update task. Please try again.')
      }
    }
  }

  const handleEditTask = (task) => {
    setEditingTask({
      _id: task._id,
      title: task.title,
      description: task.description,
      type: task.type,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      priority: task.priority
    })
    setShowEditTask(true)
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    try {
      const response = await api.put(`/tasks/${editingTask._id}`, editingTask)
      setTasks(prev => prev.map(task => 
        task._id === editingTask._id ? response.data.task : task
      ))
      setShowEditTask(false)
      setEditingTask(null)
      alert('Task updated successfully!')
    } catch (error) {
      console.error('Error updating task:', error)
      if (error.response?.status === 403) {
        alert('You are not authorized to edit this task.')
      } else {
        alert('Failed to update task. Please try again.')
      }
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }
    
    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks(prev => prev.filter(task => task._id !== taskId))
      alert('Task deleted successfully!')
    } catch (error) {
      console.error('Error deleting task:', error)
      if (error.response?.status === 403) {
        alert('You are not authorized to delete this task.')
      } else {
        alert('Failed to delete task. Please try again.')
      }
    }
  }

  const handleSubmitTask = async (taskId) => {
    try {
      const response = await api.post(`/tasks/${taskId}/complete`, { completed: true })
      setTasks(prev => prev.map(task =>
        task._id === taskId ? { ...task, completed: response.data.completed } : task
      ))
      alert('Task submitted successfully!')
    } catch (error) {
      alert('Failed to submit task.')
    }
  }

  // Ensure tasks is always an array before filtering
  const tasksArray = Array.isArray(tasks) ? tasks : []
  
  const filteredTasks = tasksArray.filter(task => {
    // Safety checks for task properties
    const title = task.title || ''
    const description = task.description || ''
    const type = task.type || ''
    const completed = task.completed || false
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || type === selectedType
    const matchesCompletion = showCompleted ? true : !completed
    
    return matchesSearch && matchesType && matchesCompletion
  })

  const getPriorityColor = (priority) => {
    switch (priority || 'medium') {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'daily': return <span>⏰</span>
      case 'weekly': return <span>📅</span>
      case 'custom': return <span>🎯</span>
      default: return <span>✅</span>
    }
  }

  const completedTasks = tasksArray.filter(task => task.completed || false).length
  const totalTasks = tasksArray.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

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
              {t('tasks.pageTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('tasks.subtitle')}
            </p>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">➕</span>
            {t('tasks.addTask')}
          </button>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('tasks.completed')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⬜</span>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('tasks.pending')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTasks - completedTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📈</span>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('tasks.completionRate')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder={t('tasks.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">{t('tasks.allTypes')}</option>
              {Object.values(TASK_TYPES).map(type => (
                <option key={type} value={type}>
                  {t(`tasks.types.${type}`)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">{t('tasks.showCompleted')}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-200 ${
              task.completed ? 'opacity-75' : 'hover:shadow-lg'
            }`}
          >
            <div className="flex items-start space-x-4">
              <button
                onClick={() => handleToggleTask(task._id, task.completed)}
                className="mt-1"
              >
                {task.completed ? (
                  <span className="text-green-600 text-lg">✅</span>
                ) : (
                  <span className="text-gray-400 hover:text-blue-600 text-lg">⬜</span>
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${
                      task.completed 
                        ? 'text-gray-500 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`mt-1 ${
                        task.completed 
                          ? 'text-gray-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority || 'medium')}`}>
                      {t(`tasks.priorities.${task.priority || 'medium'}`)}
                    </span>
                    <div className="flex items-center text-gray-500">
                      {getTypeIcon(task.type)}
                    </div>
                    {/* Edit and Delete buttons - only show for task owner */}
                    {task.assignedBy === user?._id && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit task"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete task"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {task.dueDate && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span className="mr-1">📅</span>
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                {/* Add Submit button for incomplete tasks */}
                {!task.completed && (
                  <button
                    className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    onClick={() => handleSubmitTask(task._id)}
                  >
                    {t('tasks.submitTask') || 'Submit'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl text-gray-400 mx-auto mb-4 block">✅</span>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('tasks.noTasksFound')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('tasks.createYourFirstTask')}
          </p>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('tasks.addNewTask')}
            </h2>
            
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('tasks.title')}
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('tasks.description')}
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('tasks.type')}
                  </label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {Object.values(TASK_TYPES).map(type => (
                      <option key={type} value={type}>
                        {t(`tasks.types.${type}`)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('tasks.priority')}
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="low">{t('tasks.priorities.low')}</option>
                    <option value="medium">{t('tasks.priorities.medium')}</option>
                    <option value="high">{t('tasks.priorities.high')}</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('tasks.dueDate')}
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('tasks.addTask')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTask && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('tasks.editTask')}
            </h2>
            
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('tasks.title')}
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('tasks.description')}
                </label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('tasks.type')}
                  </label>
                  <select
                    value={editingTask.type}
                    onChange={(e) => setEditingTask(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {Object.values(TASK_TYPES).map(type => (
                      <option key={type} value={type}>
                        {t(`tasks.types.${type}`)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('tasks.priority')}
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="low">{t('tasks.priorities.low')}</option>
                    <option value="medium">{t('tasks.priorities.medium')}</option>
                    <option value="high">{t('tasks.priorities.high')}</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('tasks.dueDate')}
                </label>
                <input
                  type="date"
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditTask(false)
                    setEditingTask(null)
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Tasks 