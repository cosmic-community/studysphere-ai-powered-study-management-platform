import { redirect } from 'next/navigation'
import RoleSelection from '@/components/RoleSelection'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            StudySphere
          </h1>
          <p className="text-gray-600">
            AI-Powered Study Management Platform
          </p>
        </div>
        
        <RoleSelection />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Intelligent learning with automatic app blocking
          </p>
        </div>
      </div>
    </main>
  )
}