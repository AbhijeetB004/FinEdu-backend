import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
// Icons replaced with emojis
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t, i18n } = useTranslation()

  const features = [
    {
      icon: '📚',
      title: 'Interactive Lessons',
      description: 'Learn financial concepts through engaging, bite-sized lessons designed for rural communities.',
      color: 'text-blue-600'
    },
    {
      icon: '👥',
      title: 'Community Learning',
      description: 'Connect with peers and teachers in a supportive learning environment.',
      color: 'text-green-600'
    },
    {
      icon: '🏆',
      title: 'Gamified Experience',
      description: 'Earn XP, unlock achievements, and level up your financial knowledge.',
      color: 'text-purple-600'
    },
    {
      icon: '📱',
      title: 'Mobile-First Design',
      description: 'Optimized for smartphones and low-bandwidth connections.',
      color: 'text-orange-600'
    },
    {
      icon: '🌍',
      title: 'Multi-Language Support',
      description: 'Available in English, Hindi, and Kannada for better accessibility.',
      color: 'text-indigo-600'
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and insights.',
      color: 'text-red-600'
    }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Student',
      location: 'Karnataka',
      content: 'FinEdu helped me understand banking and savings in my own language. The games make learning fun!',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Teacher',
      location: 'Uttar Pradesh',
      content: 'An excellent platform for teaching financial literacy to rural students. Very user-friendly.',
      rating: 5
    },
    {
      name: 'Anita Devi',
      role: 'Student',
      location: 'Bihar',
      content: 'I learned how to budget and save money through the interactive lessons. Highly recommended!',
      rating: 5
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Students Enrolled' },
    { number: '500+', label: 'Lessons Available' },
    { number: '50+', label: 'Villages Reached' },
    { number: '95%', label: 'Completion Rate' }
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
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="text-2xl font-bold gradient-text">FinEdu</span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-4">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="input text-sm py-2"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="kn">ಕನ್ನಡ</option>
              </select>

              <div className="flex space-x-2">
                <Link to="/login" className="btn btn-secondary">
                  {t('auth.login')}
                </Link>
                <Link to="/register" className="btn btn-primary">
                  {t('auth.register')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Financial Education for
              <span className="gradient-text block">Rural Communities</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Learn essential financial skills through interactive lessons, games, and AI-powered assistance. 
              Designed specifically for rural learners with mobile-first approach and multi-language support.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
                <span className="ml-2">→</span>
              </Link>
              
              <button className="btn btn-secondary btn-lg flex items-center">
                <span className="mr-2">▶</span>
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Why Choose FinEdu?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Our platform is specifically designed to address the unique challenges 
              of financial education in rural areas.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="card-body text-center">
                  <div className={`w-12 h-12 ${feature.color} bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <span className={`text-2xl ${feature.color}`}>{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Get started with FinEdu in three simple steps
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: '01',
                title: 'Sign Up',
                description: 'Create your free account and choose your preferred language',
                icon: '👥'
              },
              {
                step: '02',
                title: 'Learn',
                description: 'Complete interactive lessons and play educational games',
                icon: '📚'
              },
              {
                step: '03',
                title: 'Grow',
                description: 'Track your progress and earn achievements as you learn',
                icon: '📈'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-2xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              What Our Users Say
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Real stories from students and teachers using FinEdu
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card"
              >
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Ready to Start Your Financial Journey?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of learners who are building their financial future with FinEdu. 
              It's free, accessible, and designed for you.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg">
                Start Learning Today
                <span className="ml-2">→</span>
              </Link>
              <Link to="/login" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 btn-lg">
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold">FinEdu</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering rural communities with accessible financial education through 
                technology and gamification.
              </p>
              <div className="text-sm text-gray-500">
                © 2025 FinEdu. All rights reserved.
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home