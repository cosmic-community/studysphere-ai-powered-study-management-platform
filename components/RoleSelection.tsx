'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GraduationCap, Users } from 'lucide-react'

export default function RoleSelection() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelect = async (role: 'student' | 'parent') => {
    setIsLoading(true)
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300))
    
    router.push(`/auth/${role}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-4"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Choose Your Role
        </h2>
        <p className="text-gray-600 text-sm">
          Select your account type to continue
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleRoleSelect('student')}
          disabled={isLoading}
          className="card-hover p-6 text-left border-2 border-transparent hover:border-primary-200 transition-all duration-200 disabled:opacity-50"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <GraduationCap className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Student
              </h3>
              <p className="text-sm text-gray-600">
                Access your study materials, track progress, and manage your learning schedule
              </p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleRoleSelect('parent')}
          disabled={isLoading}
          className="card-hover p-6 text-left border-2 border-transparent hover:border-secondary-200 transition-all duration-200 disabled:opacity-50"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-secondary-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Parent
              </h3>
              <p className="text-sm text-gray-600">
                Monitor your child's progress, set study rules, and view detailed analytics
              </p>
            </div>
          </div>
        </motion.button>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-gray-500">
          Don't have an account? You'll be able to create one after selecting your role.
        </p>
      </div>
    </motion.div>
  )
}