import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'react-feather'
import { useTranslation } from 'react-i18next'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo)
    }
    
    // In production, you might want to log this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
        />
      )
    }

    return this.props.children
  }
}

const ErrorFallback = ({ error, errorInfo, onReload, onGoHome }) => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Error Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {t('errors.genericError')}
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 mb-6">
          Something went wrong while loading this page. Please try refreshing or go back to the home page.
        </p>

        {/* Error Details (Development Only) */}
        {import.meta.env.DEV && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Technical Details
            </summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32">
              <div className="font-semibold mb-1">Error:</div>
              <div className="mb-2">{error.toString()}</div>
              {errorInfo && (
                <>
                  <div className="font-semibold mb-1">Stack Trace:</div>
                  <div>{errorInfo.componentStack}</div>
                </>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReload}
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {t('common.refresh')}
          </button>
          
          <button
            onClick={onGoHome}
            className="btn btn-secondary flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('navigation.home')}
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-4">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  )
}

export default ErrorBoundary