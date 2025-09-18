import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StudySphere - AI-Powered Study Management Platform',
  description: 'Intelligent study session management with automated app blocking and comprehensive analytics for students and parents.',
  keywords: ['study management', 'app blocking', 'student analytics', 'parental controls', 'education technology'],
  authors: [{ name: 'StudySphere Team' }],
  openGraph: {
    title: 'StudySphere - AI-Powered Study Management Platform',
    description: 'Transform your study habits with intelligent app blocking and detailed progress tracking.',
    type: 'website',
    siteName: 'StudySphere',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <CosmicBadge bucketSlug={bucketSlug} />
        </AuthProvider>
      </body>
    </html>
  )
}