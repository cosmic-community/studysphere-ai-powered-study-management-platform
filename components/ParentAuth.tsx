'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, Shield, Users } from 'lucide-react'
import { validateEmail, validatePasswordStrength, validatePhoneNumber } from '@/lib/auth'

export default function ParentAuth() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showMasterPassword, setShowMasterPassword] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    masterPassword: '',
    name: '',
    phoneNumber: '',
    studentEmail: '',
    notificationPreferences: [] as string[]
  })

  const notificationOptions = [
    'Daily Reports',
    'Weekly Summary', 
    'Quiz Results',
    'Screen Time Alerts',
    'Study Session Updates'
  ]

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleNotificationToggle = (option: string) => {
    const newPreferences = formData.notificationPreferences.includes(option)
      ? formData.notificationPreferences.filter(p => p !== option)
      : [...formData.notificationPreferences, option]
    
    handleInputChange('notificationPreferences', newPreferences)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        // Login validation
        if (!formData.email || !formData.password || !formData.masterPassword) {
          throw new Error('Please fill in all required fields')
        }

        if (!validateEmail(formData.email)) {
          throw new Error('Please enter a valid email address')
        }

        const success = await login(formData.email, formData.password, 'parent', formData.masterPassword)
        
        if (success) {
          router.push('/parent')
        } else {
          throw new Error('Invalid credentials. Please check your email, password, and master password.')
        }
      } else {
        // Signup validation
        const requiredFields = ['email', 'password', 'masterPassword', 'name', 'phoneNumber', 'studentEmail']
        const missingFields = requiredFields.filter(field => !formData[field])
        
        if (missingFields.length > 0) {
          throw new Error('Please fill in all required fields')
        }

        if (!validateEmail(formData.email) || !validateEmail(formData.studentEmail)) {
          throw new Error('Please enter valid email addresses')
        }

        if (!validatePhoneNumber(formData.phoneNumber)) {
          throw new Error('Please enter a valid phone number')
        }

        const passwordValidation = validatePasswordStrength(formData.password)
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.errors[0])
        }

        const masterPasswordValidation = validatePasswordStrength(formData.masterPassword)
        if (!masterPasswordValidation.isValid) {
          throw new Error('Master password: ' + masterPasswordValidation.errors[0])
        }

        // Mock signup success - in production, create account first
        throw new Error('Account creation is not available in demo mode. Use the sample parent account: david.chen@email.com')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          
          <div className="mb-4">
            <div className="bg-secondary-100 p-3 rounded-full inline-block mb-3">
              <Users className="h-8 w-8 text-secondary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Parent {isLogin ? 'Login' : 'Signup'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin 
                ? 'Access your oversight dashboard'
                : 'Create your parent account'
              }
            </p>
          </div>
        </div>

        {/* Demo Account Info */}
        {isLogin && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Demo Account:</strong>
            </p>
            <p className="text-xs text-blue-700">
              Email: david.chen@email.com<br />
              Password: password123<br />
              Master Password: masterpass123
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Master Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Master Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showMasterPassword ? 'text' : 'password'}
                  value={formData.masterPassword}
                  onChange={(e) => handleInputChange('masterPassword', e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your master password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowMasterPassword(!showMasterPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showMasterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Master password prevents app uninstallation
              </p>
            </div>

            {/* Signup Fields */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                {/* Student Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student's Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.studentEmail}
                      onChange={(e) => handleInputChange('studentEmail', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your child's email"
                      required
                    />
                  </div>
                </div>

                {/* Notification Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Preferences (Optional)
                  </label>
                  <div className="space-y-2">
                    {notificationOptions.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.notificationPreferences.includes(option)}
                          onChange={() => handleNotificationToggle(option)}
                          className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <div className="loading-spinner h-5 w-5 mr-2" />
              ) : null}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            {/* Forgot Master Password - Login only */}
            {isLogin && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-800"
                  onClick={() => alert('Master password reset would require email + phone verification')}
                >
                  Forgot Master Password?
                </button>
              </div>
            )}
          </div>

          {/* Toggle Mode */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}