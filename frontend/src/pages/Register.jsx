import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Register = () => {
  const { t } = useTranslation()
  const { register: registerUser, loading, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm()

  const password = watch('password')

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      const result = await registerUser(data)
      
      if (!result.success) {
        setError('root', {
          type: 'manual',
          message: result.error
        })
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: t('errors.genericError')
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold gradient-text">FinEdu</span>
          </Link>
        </motion.div>

        {/* Register Form */}
        <motion.div variants={itemVariants} className="card">
          <div className="card-body">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.createAccount')}
              </h1>
              <p className="text-gray-600">
                Start your financial learning journey today
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="label">
                  {t('auth.name')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                    placeholder="Enter your full name"
                    {...register('name', {
                      required: t('auth.nameRequired'),
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="error-text">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="label">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                    placeholder="Enter your email"
                    {...register('email', {
                      required: t('auth.emailRequired'),
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t('auth.invalidEmail')
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="error-text">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field (Optional) */}
              <div>
                <label htmlFor="phone" className="label">
                  {t('auth.phone')} <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    className={`input pl-10 ${errors.phone ? 'input-error' : ''}`}
                    placeholder="Enter your phone number"
                    {...register('phone', {
                      pattern: {
                        value: /^[\+]?[1-9][\d]{0,15}$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="error-text">{errors.phone.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="label">
                  {t('auth.role')}
                </label>
                <select
                  id="role"
                  className={`input ${errors.role ? 'input-error' : ''}`}
                  {...register('role', {
                    required: 'Please select your role'
                  })}
                >
                  <option value="">Select your role</option>
                  <option value="student">{t('auth.student')}</option>
                  <option value="teacher">{t('auth.teacher')}</option>
                </select>
                {errors.role && (
                  <p className="error-text">{errors.role.message}</p>
                )}
              </div>

              {/* Language Selection */}
              <div>
                <label htmlFor="language" className="label">
                  {t('auth.language')}
                </label>
                <select
                  id="language"
                  className="input"
                  {...register('language')}
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                </select>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="label">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder="Create a password"
                    {...register('password', {
                      required: t('auth.passwordRequired'),
                      minLength: {
                        value: 6,
                        message: t('auth.passwordTooShort')
                      }
                    })}
                  />
                  
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="error-text">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="label">
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Confirm your password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value =>
                        value === password || t('auth.passwordsDoNotMatch')
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="error-text">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                    {...register('acceptTerms', {
                      required: 'You must accept the terms and conditions'
                    })}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="error-text">{errors.acceptTerms.message}</p>
                )}
              </div>

              {/* Error Message */}
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{errors.root.message}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <>
                    {t('auth.registerButton')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  {t('auth.signInHere')}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={itemVariants}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          <div className="text-center">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-primary-600 text-sm">🎓</span>
            </div>
            <p className="text-xs text-gray-600">Free Learning</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-primary-600 text-sm">🏆</span>
            </div>
            <p className="text-xs text-gray-600">Achievements</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-primary-600 text-sm">🤖</span>
            </div>
            <p className="text-xs text-gray-600">AI Assistant</p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div variants={itemVariants} className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Register