import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
// Icons replaced with HTML entities and text

import { useAuth } from '../hooks/useAuth'
import { api } from '../utils/api'

const Chat = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [selectedHistory, setSelectedHistory] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchChatHistory()
    scrollToBottom()
  }, [messages])

  const fetchChatHistory = async () => {
    try {
      const response = await api.get('/chat/history')
      setChatHistory(response.data)
    } catch (error) {
      console.error('Error fetching chat history:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)
    setIsTyping(true)

    try {
      const response = await api.post('/chat/message', {
        message: message,
        userId: user._id
      })

      const botMessage = {
        id: Date.now() + 1,
        content: response.data.response,
        sender: 'bot',
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        content: t('chat.errorMessage'),
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
      setIsTyping(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  const startNewChat = () => {
    setMessages([])
    setSelectedHistory(null)
    setShowHistory(false)
  }

  const loadChatHistory = (history) => {
    setMessages(history.messages || [])
    setSelectedHistory(history)
    setShowHistory(false)
  }

  const deleteChatHistory = async (historyId) => {
    try {
      await api.delete(`/chat/history/${historyId}`)
      fetchChatHistory()
      if (selectedHistory?._id === historyId) {
        startNewChat()
      }
    } catch (error) {
      console.error('Error deleting chat history:', error)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Here you would implement actual voice recording functionality
    // For now, we'll just toggle the state
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return t('chat.today')
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('chat.yesterday')
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('chat.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('chat.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <span className="text-lg">↻</span>
          </button>
          <button
            onClick={startNewChat}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('chat.newChat')}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Chat History Sidebar */}
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 min-w-0"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('chat.history')}
            </h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {chatHistory.map((history) => (
                <div
                  key={history._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedHistory?._id === history._id
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => loadChatHistory(history)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {history.title || t('chat.untitled')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(history.updatedAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteChatHistory(history._id)
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <span className="text-6xl text-gray-400 mb-4">💬</span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('chat.welcome')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  {t('chat.welcomeMessage')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.isError
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === 'bot' && (
                          <span className="text-sm mt-1 flex-shrink-0">🤖</span>
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">🤖</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <span className="text-lg">{isRecording ? '🎤' : '🎤'}</span>
              </button>
              
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('chat.typeMessage')}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
              />
              
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="text-lg animate-spin">⏳</span>
                ) : (
                  <span className="text-lg">📤</span>
                )}
              </button>
            </form>
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              {t('chat.poweredByAI')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat 