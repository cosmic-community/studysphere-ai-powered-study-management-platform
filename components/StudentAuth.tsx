'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Calendar, GraduationCap } from 'lucide-react'
import { validateEmail, validatePasswordStrength } from '@/lib/auth'

export default function StudentAuth() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    qualifications: '',
    interests: [] as string[]
  })

  const availableInterests = [
    'Mathematics', 'Science', 'Literature', 'History', 'Art', 'Music', 'Sports', 'Technology'
  ]

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest]
    
    handleInputChange('interests', newInterests)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        // Login validation
        if (!formData.email || !formData.password) {
          throw new Error('Please fill in all required fields')
        }

        if (!validateEmail(formData.email)) {
          throw new Error('Please enter a valid email address')
        }

        const success = await login(formData.email, formData.password, 'student')
        
        if (success) {
          router.push('/student')
        } else {
          throw new Error('Invalid email or password')
        }
      } else {
        // Signup validation
        const requiredFields = ['email', 'password', 'fullName', 'age', 'dateOfBirth', 'gender']
        const missingFields = requiredFields.filter(field => !formData[field])
        
        if (missingFields.length > 0) {
          throw new Error('Please fill in all required fields')
        }

        if (!validateEmail(formData.email)) {
          throw new Error('Please enter a valid email address')
        }

        const passwordValidation = validatePasswordStrength(formData.password)
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.errors[0])
        }

        const age = parseInt(formData.age)
        if (isNaN(age) || age < 5 || age > 25) {
          throw new Error('Please enter a valid age between 5 and 25')
        }

        // Mock signup success - in production, create account first
        throw new Error('Account creation is not available in demo mode. Use the sample student account: emily.chen@email.com')
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
            <div className="bg-primary-100 p-3 rounded-full inline-block mb-3">
              <GraduationCap className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student {isLogin ? 'Login' : 'Signup'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin 
                ? 'Access your learning dashboard'
                : 'Create your student account'
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
              Email: emily.chen@email.com<br />
              Password: password123
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
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Age and Date of Birth */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="25"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="input-field"
                      placeholder="Age"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Qualifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications (Optional)
                  </label>
                  <textarea
                    value={formData.qualifications}
                    onChange={(e) => handleInputChange('qualifications', e.target.value)}
                    className="input-field"
                    rows={3}
                    placeholder="List your achievements, awards, or qualifications"
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableInterests.map((interest) => (
                      <label key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestToggle(interest)}
                          className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{interest}</span>
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

            {/* Forgot Password - Login only */}
            {isLogin && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-800"
                  onClick={() => alert('Password reset functionality would be implemented here')}
                >
                  Forgot Password?
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