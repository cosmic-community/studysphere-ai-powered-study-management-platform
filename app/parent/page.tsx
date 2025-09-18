'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ParentDashboard from '@/components/ParentDashboard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ParentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/parent')
      } else if (user.role !== 'parent') {
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

  if (!user || user.role !== 'parent') {
    return null
  }

  return <ParentDashboard />
}