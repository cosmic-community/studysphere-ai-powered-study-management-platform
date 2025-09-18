'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Play, 
  CheckCircle,
  AlertCircle,
  LogOut,
  User,
  BarChart3
} from 'lucide-react'
import { 
  getStudent, 
  getStudySessions, 
  getQuizResults, 
  getStudyMaterials,
  getUsageSessions
} from '@/lib/cosmic'
import { calculateStudyAnalytics, calculateUsageAnalytics } from '@/lib/analytics'
import type { Student, StudySession, QuizResult, StudyMaterial, UsageSession } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner'
import StudyAnalyticsChart from '@/components/StudyAnalyticsChart'

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const [student, setStudent] = useState<Student | null>(null)
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([])
  const [usageSessions, setUsageSessions] = useState<UsageSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return

      try {
        setLoading(true)
        
        const [studentData, sessions, quizzes, materials, usage] = await Promise.all([
          getStudent(user.id),
          getStudySessions(user.id),
          getQuizResults(user.id),
          getStudyMaterials(),
          getUsageSessions(user.id)
        ])

        setStudent(studentData)
        setStudySessions(sessions)
        setQuizResults(quizzes)
        setStudyMaterials(materials)
        setUsageSessions(usage)
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
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Student Not Found</h2>
          <p className="text-gray-600">Unable to load student profile.</p>
        </div>
      </div>
    )
  }

  const studyAnalytics = calculateStudyAnalytics(studySessions, quizResults)
  const usageAnalytics = calculateUsageAnalytics(usageSessions)

  const activeSession = studySessions.find(session => 
    session.metadata.session_status.value === 'In Progress'
  )

  const upcomingSession = studySessions.find(session => 
    session.metadata.session_status.value === 'Scheduled' &&
    new Date(session.metadata.scheduled_start) > new Date()
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient">StudySphere</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
              
              {student.metadata.profile_picture && (
                <img
                  src={`${student.metadata.profile_picture.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                  alt={student.metadata.full_name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
              
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
        {/* Active/Upcoming Session Alert */}
        {(activeSession || upcomingSession) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {activeSession ? (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Play className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-primary-800">Study Session In Progress</h3>
                    <p className="text-sm text-primary-600">
                      Apps are blocked until you complete the quiz
                    </p>
                  </div>
                </div>
              </div>
            ) : upcomingSession ? (
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-warning-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-warning-800">Upcoming Study Session</h3>
                    <p className="text-sm text-warning-600">
                      Scheduled for {new Date(upcomingSession.metadata.scheduled_start).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
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
                  {studyAnalytics.totalStudyTime}
                </p>
                <p className="text-sm text-gray-600">Minutes Studied</p>
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
              <div className="bg-success-100 p-3 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {studyAnalytics.sessionsCompleted}
                </p>
                <p className="text-sm text-gray-600">Sessions Completed</p>
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
              <div className="bg-warning-100 p-3 rounded-full mr-4">
                <Award className="h-6 w-6 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {studyAnalytics.averageQuizScore}%
                </p>
                <p className="text-sm text-gray-600">Average Score</p>
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
                <TrendingUp className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {studyAnalytics.streakDays}
                </p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Study Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Weekly Progress
            </h3>
            <StudyAnalyticsChart data={studyAnalytics.weeklyProgress} />
          </motion.div>

          {/* Recent Study Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Recent Sessions
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {studySessions.slice(0, 5).map((session, index) => (
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
                    
                    {session.metadata.quiz_completed && (
                      <div className="flex items-center mt-1 text-xs text-success-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Quiz Passed
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {studySessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No study sessions yet</p>
                  <p className="text-sm">Your study sessions will appear here</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Available Study Materials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Study Materials
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studyMaterials.slice(0, 6).map((material) => (
                <div key={material.id} className="card-hover">
                  {material.metadata.featured_image && (
                    <img
                      src={`${material.metadata.featured_image.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
                      alt={material.metadata.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  <h4 className="font-medium text-gray-900 mb-2">
                    {material.metadata.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span className="badge badge-primary">
                      {material.metadata.subject.value}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {material.metadata.duration} min
                    </span>
                  </div>
                  
                  <button 
                    className="btn-primary w-full text-sm"
                    onClick={() => alert('Study session would start here with app blocking')}
                  >
                    Start Learning
                  </button>
                </div>
              ))}
              
              {studyMaterials.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No study materials available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}