import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setLanguage, getLanguage } from '../utils/storage'
import { SUPPORTED_LANGUAGES } from '../utils/constants'

// Create context
const LanguageContext = createContext()

// Provider component
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(getLanguage())
  const [isRTL, setIsRTL] = useState(false)

  // Initialize language
  useEffect(() => {
    const savedLanguage = getLanguage()
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage)
    }
    setCurrentLanguage(savedLanguage)
    updateDirection(savedLanguage)
  }, [i18n])

  // Update document direction based on language
  const updateDirection = (language) => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']
    const isRightToLeft = rtlLanguages.includes(language)
    setIsRTL(isRightToLeft)
    
    document.documentElement.dir = isRightToLeft ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }

  // Change language
  const changeLanguage = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode)
      setLanguage(languageCode)
      setCurrentLanguage(languageCode)
      updateDirection(languageCode)
      
      // Announce language change to screen readers
      const languageName = getLanguageName(languageCode)
      announceToScreenReader(`Language changed to ${languageName}`)
      
      return true
    } catch (error) {
      console.error('Error changing language:', error)
      return false
    }
  }

  // Get language name
  const getLanguageName = (code) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code)
    return language ? language.name : code
  }

  // Get native language name
  const getNativeLanguageName = (code) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code)
    return language ? language.nativeName : code
  }

  // Get available languages
  const getAvailableLanguages = () => {
    return SUPPORTED_LANGUAGES
  }

  // Check if language is supported
  const isLanguageSupported = (code) => {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === code)
  }

  // Get browser language
  const getBrowserLanguage = () => {
    const browserLang = navigator.language || navigator.languages[0]
    const langCode = browserLang.split('-')[0] // Get language code without region
    return isLanguageSupported(langCode) ? langCode : 'en'
  }

  // Auto-detect language
  const autoDetectLanguage = () => {
    const browserLang = getBrowserLanguage()
    if (browserLang !== currentLanguage) {
      changeLanguage(browserLang)
    }
  }

  // Format text based on language direction
  const formatText = (text) => {
    if (!text) return ''
    
    // Add any language-specific text formatting here
    if (isRTL) {
      // RTL-specific formatting if needed
      return text
    }
    
    return text
  }

  // Get localized date format
  const getDateFormat = () => {
    const formats = {
      en: 'MM/dd/yyyy',
      hi: 'dd/MM/yyyy',
      kn: 'dd/MM/yyyy',
    }
    return formats[currentLanguage] || formats.en
  }

  // Get localized number format
  const formatNumber = (number) => {
    try {
      return new Intl.NumberFormat(currentLanguage).format(number)
    } catch (error) {
      return number.toString()
    }
  }

  // Get localized currency format
  const formatCurrency = (amount, currency = 'INR') => {
    try {
      return new Intl.NumberFormat(currentLanguage, {
        style: 'currency',
        currency: currency,
      }).format(amount)
    } catch (error) {
      return `${currency} ${amount}`
    }
  }

  // Announce to screen reader
  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.setAttribute('class', 'sr-only')
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  // Get text direction class
  const getDirectionClass = () => {
    return isRTL ? 'rtl' : 'ltr'
  }

  // Get language-specific font class
  const getFontClass = () => {
    const fontClasses = {
      en: 'font-inter',
      hi: 'font-hindi',
      kn: 'font-kannada',
    }
    return fontClasses[currentLanguage] || fontClasses.en
  }

  // Context value
  const value = {
    // State
    currentLanguage,
    isRTL,
    
    // Actions
    changeLanguage,
    autoDetectLanguage,
    
    // Utilities
    getLanguageName,
    getNativeLanguageName,
    getAvailableLanguages,
    isLanguageSupported,
    getBrowserLanguage,
    formatText,
    getDateFormat,
    formatNumber,
    formatCurrency,
    getDirectionClass,
    getFontClass,
    announceToScreenReader,
  }

  return (
    <LanguageContext.Provider value={value}>
      <div className={`${getDirectionClass()} ${getFontClass()}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext