'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  LogOut,
  User,
  BarChart3,
  Smartphone,
  CheckCircle,
  XCircle,
  Eye,
  Settings
} from 'lucide-react'
import { 
  getStudent, 
  getParent,
  getStudySessions, 
  getQuizResults, 
  getUsageSessions,
  getBlockingRules
} from '@/lib/cosmic'
import { calculateStudyAnalytics, calculateUsageAnalytics } from '@/lib/analytics'
import type { Student, Parent, StudySession, QuizResult, UsageSession, BlockingRule } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner'
import UsageAnalyticsChart from '@/components/UsageAnalyticsChart'

export default function ParentDashboard() {
  const { user, logout } = useAuth()
  const [parent, setParent] = useState<Parent | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [usageSessions, setUsageSessions] = useState<UsageSession[]>([])
  const [blockingRules, setBlockingRules] = useState<BlockingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return

      try {
        setLoading(true)
        
        // First load parent data
        const parentData = await getParent(user.id)
        if (!parentData) throw new Error('Parent not found')
        setParent(parentData)

        // Get student data if we have a studentId
        const studentId = user.studentId
        if (!studentId) throw new Error('Student ID not found')

        const [studentData, sessions, quizzes, usage, rules] = await Promise.all([
          getStudent(studentId),
          getStudySessions(studentId),
          getQuizResults(studentId),
          getUsageSessions(studentId),
          getBlockingRules(studentId)
        ])

        setStudent(studentData)
        setStudySessions(sessions)
        setQuizResults(quizzes)
        setUsageSessions(usage)
        setBlockingRules(rules)
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!parent || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Not Found</h2>
          <p className="text-gray-600">Unable to load parent or student profile.</p>
        </div>
      </div>
    )
  }

  const studyAnalytics = calculateStudyAnalytics(studySessions, quizResults)
  const usageAnalytics = calculateUsageAnalytics(usageSessions)

  const activeBlockingRules = blockingRules.filter(rule => rule.metadata.active)
  
  const currentSession = studySessions.find(session => 
    session.metadata.session_status.value === 'In Progress'
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient">StudySphere</h1>
              <span className="ml-3 text-sm text-gray-500">Parent Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Monitoring: {student.metadata.full_name}</p>
              </div>
              
              <button
                onClick={logout}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Status Alert */}
        {currentSession && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-primary-800">Study Session Active</h3>
                  <p className="text-sm text-primary-600">
                    Apps are currently blocked for {student.metadata.full_name}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {usageAnalytics.totalScreenTime}
                </p>
                <p className="text-sm text-gray-600">Minutes Screen Time</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="bg-warning-100 p-3 rounded-full mr-4">
                <Smartphone className="h-6 w-6 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {usageAnalytics.appsBlocked}
                </p>
                <p className="text-sm text-gray-600">Apps Blocked</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="bg-success-100 p-3 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {usageAnalytics.productivityScore}%
                </p>
                <p className="text-sm text-gray-600">Productivity Score</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center">
              <div className="bg-secondary-100 p-3 rounded-full mr-4">
                <Shield className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {activeBlockingRules.length}
                </p>
                <p className="text-sm text-gray-600">Active Rules</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Usage Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Daily Usage Breakdown
            </h3>
            <UsageAnalyticsChart data={usageAnalytics.dailyUsage} />
          </motion.div>

          {/* Top Apps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Most Used Apps
            </h3>
            
            <div className="space-y-3">
              {usageAnalytics.topApps.map((app, index) => (
                <div key={app.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-gray-200 p-2 rounded-lg mr-3">
                      <Smartphone className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{app.name}</p>
                      <p className="text-sm text-gray-600">{app.category}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{app.usage}m</p>
                    <div className="flex items-center text-xs">
                      {blockingRules.some(rule => 
                        rule.metadata.active && 
                        typeof rule.metadata.app_category === 'object' &&
                        rule.metadata.app_category.metadata?.category_name === app.category
                      ) ? (
                        <>
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-red-600">Blocked</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-600">Allowed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {usageAnalytics.topApps.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Smartphone className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No app usage data available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Study Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Recent Study Sessions
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {studySessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {typeof session.metadata.study_material === 'object' 
                        ? session.metadata.study_material.title 
                        : 'Study Session'
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.metadata.scheduled_start).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className={`badge ${
                      session.metadata.session_status.value === 'Completed' 
                        ? 'badge-success'
                        : session.metadata.session_status.value === 'In Progress'
                        ? 'badge-primary'
                        : session.metadata.session_status.value === 'Scheduled'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}>
                      {session.metadata.session_status.value}
                    </span>
                    
                    <div className="flex items-center mt-1 text-xs">
                      {session.metadata.quiz_completed ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-success-600 mr-1" />
                          <span className="text-success-600">Quiz Passed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 text-danger-600 mr-1" />
                          <span className="text-danger-600">Quiz Pending</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center text-xs mt-1">
                      {session.metadata.apps_unlocked ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-success-600 mr-1" />
                          <span className="text-success-600">Apps Unlocked</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 text-warning-600 mr-1" />
                          <span className="text-warning-600">Apps Blocked</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {studySessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No study sessions to monitor</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Active Blocking Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              AI Blocking Rules
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {activeBlockingRules.map((rule) => (
                <div key={rule.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {typeof rule.metadata.app_category === 'object' 
                        ? rule.metadata.app_category.title 
                        : 'App Category'
                      }
                    </p>
                    <span className={`badge ${
                      rule.metadata.rule_type.value === 'Block During Study'
                        ? 'badge-warning'
                        : rule.metadata.rule_type.value === 'Complete Block'
                        ? 'badge-danger'
                        : 'badge-primary'
                    }`}>
                      {rule.metadata.rule_type.value}
                    </span>
                  </div>
                  
                  {rule.metadata.time_limit && (
                    <p className="text-sm text-gray-600 mb-2">
                      Time Limit: {rule.metadata.time_limit} minutes
                    </p>
                  )}
                  
                  {rule.metadata.reason && (
                    <p className="text-xs text-gray-500">
                      AI Reason: {rule.metadata.reason}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-500">
                      Created: {new Date(rule.metadata.created_date).toLocaleDateString()}
                    </span>
                    {rule.metadata.ai_generated && (
                      <span className="badge badge-secondary">AI Generated</span>
                    )}
                  </div>
                </div>
              ))}
              
              {activeBlockingRules.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No active blocking rules</p>
                  <p className="text-sm">Rules will be created automatically based on usage patterns</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}