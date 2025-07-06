import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
// Icons replaced with emojis

import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'
import { GAME_TYPES, GAME_DIFFICULTY } from '../utils/constants'

// Game List Component
const GameList = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const response = await api.get('/games')
      setGames(response.data)
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGames = games.filter(game => {
    const matchesType = selectedType === 'all' || game.type === selectedType
    const matchesDifficulty = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty
    return matchesType && matchesDifficulty
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getGameIcon = (type) => {
    switch (type) {
      case 'budget_quiz': return '💰'
      case 'credit_simulation': return '💳'
      case 'stock_market': return '📈'
      default: return '🎮'
    }
  }

  const getGameStats = () => {
    const totalGames = games.length
    const completedGames = games.filter(game => game.completed).length
    const averageScore = games.length > 0 
      ? games.reduce((sum, game) => sum + (game.bestScore || 0), 0) / games.length 
      : 0

    return { totalGames, completedGames, averageScore }
  }

  const stats = getGameStats()

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
          {t('games.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('games.subtitle')}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                      <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('games.totalGames')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGames}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('games.completed')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedGames}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('games.averageScore')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageScore.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-48">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">{t('games.allTypes')}</option>
            {Object.values(GAME_TYPES).map(type => (
              <option key={type} value={type}>
                {t(`games.types.${type}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-48">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">{t('games.allDifficulties')}</option>
            {Object.values(GAME_DIFFICULTY).map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {t(`games.difficulty.${difficulty}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <motion.div
            key={game._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/games/${game._id}`)}
          >
            {/* Game Image */}
            <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-600 rounded-t-lg flex items-center justify-center">
              <span className="text-6xl">{getGameIcon(game.type)}</span>
              {game.completed && (
                <div className="absolute top-4 right-4">
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
              )}
            </div>

            {/* Game Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                  {t(`games.difficulty.${game.difficulty}`)}
                </span>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm">{game.rating || 4.5}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {game.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {game.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{game.duration} min</span>
                </div>
                
                <div className="flex items-center">
                  {game.bestScore && (
                    <div className="flex items-center text-green-600 text-sm font-medium mr-2">
                      <Target className="h-4 w-4 mr-1" />
                      <span>{game.bestScore}</span>
                    </div>
                  )}
                  <Play className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('games.noGamesFound')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('games.tryAdjustingFilters')}
          </p>
        </div>
      )}
    </div>
  )
}

// Game Detail Component
const GameDetail = () => {
  const { t } = useTranslation()
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [gameState, setGameState] = useState('menu') // menu, playing, paused, completed

  useEffect(() => {
    fetchGame()
  }, [gameId])

  const fetchGame = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/games/${gameId}`)
      setGame(response.data)
    } catch (error) {
      console.error('Error fetching game:', error)
    } finally {
      setLoading(false)
    }
  }

  const startGame = () => {
    setGameState('playing')
  }

  const pauseGame = () => {
    setGameState('paused')
  }

  const resumeGame = () => {
    setGameState('playing')
  }

  const completeGame = async (score) => {
    try {
      await api.post(`/games/${gameId}/complete`, { score })
      setGame(prev => ({ 
        ...prev, 
        completed: true, 
        bestScore: Math.max(prev.bestScore || 0, score) 
      }))
      setGameState('completed')
    } catch (error) {
      console.error('Error completing game:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('games.gameNotFound')}
          </h2>
          <button
            onClick={() => navigate('/games')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('common.backToGames')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/games')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        {t('common.back')}
      </button>

      {/* Game Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {game.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {game.description}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{game.duration} min</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                <span>{game.rating || 4.5}</span>
              </div>
              {game.bestScore && (
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  <span>{t('games.bestScore')}: {game.bestScore}</span>
                </div>
              )}
            </div>
          </div>
          
          {game.completed && (
            <div className="flex items-center text-yellow-600">
              <Award className="h-6 w-6 mr-2" />
              <span className="font-medium">{t('games.completed')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Game Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {gameState === 'menu' && (
          <div className="text-center">
            <div className="text-6xl mb-6">🎮</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('games.readyToPlay')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t('games.gameInstructions')}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
            >
              <Play className="h-6 w-6 inline mr-2" />
              {t('games.startGame')}
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('games.gameInProgress')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('games.focusOnGame')}
            </p>
            <button
              onClick={pauseGame}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {t('games.pause')}
            </button>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="text-center">
            <div className="text-4xl mb-4">⏸️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('games.gamePaused')}
            </h2>
            <div className="space-y-3">
              <button
                onClick={resumeGame}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('games.resume')}
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                {t('games.backToMenu')}
              </button>
            </div>
          </div>
        )}

        {gameState === 'completed' && (
                  <div className="text-center">
          <div className="text-6xl mb-4">🎖️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('games.gameCompleted')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('games.congratulations')}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setGameState('menu')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('games.playAgain')}
              </button>
              <button
                onClick={() => navigate('/games')}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                {t('games.backToGames')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Main Games Component
const Games = () => {
  return (
    <Routes>
      <Route path="/" element={<GameList />} />
      <Route path="/:gameId" element={<GameDetail />} />
    </Routes>
  )
}

export default Games 