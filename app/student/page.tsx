'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import StudentDashboard from '@/components/StudentDashboard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function StudentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/student')
      } else if (user.role !== 'student') {
        router.push('/')
      } else {
        setIsLoading(false)
      }
    }
  }, [user, loading, router])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!user || user.role !== 'student') {
    return null
  }

  return <StudentDashboard />
}