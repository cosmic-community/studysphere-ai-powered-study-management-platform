# StudySphere - AI-Powered Study Management Platform

![StudySphere Preview](https://imgix.cosmicjs.com/eadcc2b0-a044-11ed-81f2-f50e185dd248-rj8fMHNPXbg.jpg?w=1200&h=300&fit=crop&auto=format,compress)

StudySphere is a comprehensive AI-powered educational platform that automatically manages student screen time and enforces focused study sessions. The platform combines intelligent app blocking with detailed analytics to create an optimal learning environment while providing parents with complete oversight and control.

## ✨ Features

- **🤖 AI-Powered App Blocking** - Automatic detection and blocking of distracting apps during study sessions
- **📊 Smart Analytics Dashboard** - Comprehensive tracking of app usage patterns with AI-generated insights  
- **🎯 Adaptive Study Sessions** - Quiz-based unlocking system that adapts to student performance
- **👨‍👩‍👧‍👦 Parent Oversight Portal** - Complete monitoring with real-time notifications and usage reports
- **🔐 Secure Authentication** - Role-based access with master password protection
- **📱 Mobile-First Design** - Responsive interface optimized for all devices
- **📈 Real-time Progress Tracking** - Live updates on study progress and blocking status
- **🎓 Interactive Learning Materials** - Rich content delivery with integrated quiz systems

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68cb931dfe0840663f65019d&clone_repository=68cb975afe0840663f6501d1)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Build a complete login system for a web app called "StudySphere".

Frontend (React.js + TypeScript + Tailwind CSS)

UI Layout:

App name "StudySphere" displayed at the top center, large and prominent.

Login or Signup form displayed below the app name.

Forms should be centered and fully responsive for desktop and mobile.

Authentication Flow:

Role Selection Page: User chooses Student or Parent, then is redirected to the corresponding login/signup page.

Login/Signup Page: Users toggle between login and signup. Smooth transitions.

Student Login Form:

Email, Password

"Forgot Password" link below password field → triggers student password reset via email verification.

Parent Login Form:

Email, Password, Master Password

"Forgot Master Password" link below master password → triggers master password reset via email + phone verification.

No regular "Forgot Password" link.

Student Signup Form:

Full Name, Age, Date of Birth, Gender (Male/Female/Other), Qualifications, Email, Password, Interests (selectable or tags).

Parent Signup Form:

Name, Phone Number, Student's Email, Email, Password, Master Password.

Password Reset Workflows:

Students: email verification code → reset password.

Parents: email + phone verification codes → reset master password.

Validation:

Required fields, email format, phone format, password strength

Show error messages for invalid credentials.

Frontend Logic:

Only redirect to dashboard if backend returns a valid JWT token.

Use React Router for navigation.

Use Redux or Context API for authentication state management.

Tailwind CSS for styling and responsive design.

Backend (Node.js + Express + MongoDB + JWT)

Models:

Student: fullName, age, dob, gender, qualifications, email (unique), password (hashed), interests (array).

Parent: name, phone, studentEmail, email (unique), password (hashed), masterPassword (hashed).

Routes:

/api/auth/student/signup, /api/auth/student/login, /api/auth/student/forgot-password

/api/auth/parent/signup, /api/auth/parent/login, /api/auth/parent/forgot-master-password

Backend Logic:

Hash passwords & master passwords using bcrypt.

Compare hashed passwords during login.

Generate JWT tokens containing user ID and role, expiring in 1 hour.

Protect routes with JWT middleware.

Validate input fields: required, email format, phone number format, password strength.

Return clear JSON responses for success/failure.

Use environment variables for MongoDB URI and JWT secret.

Additional Requirements:

Students and parents cannot access each other's dashboards.

Frontend must only redirect if valid JWT token is received.

Fully responsive, mobile-friendly design.

Smooth navigation between login, signup, and password reset flows.                                                                                                                                                           
Build a complete login system for a web app called "StudySphere".

Frontend (React.js + TypeScript + Tailwind CSS)

UI Layout:

App name "StudySphere" displayed at the top center, large and prominent.

Login or Signup form displayed below the app name.

Forms should be centered and fully responsive for desktop and mobile.

Authentication Flow:

Role Selection Page: User chooses Student or Parent, then is redirected to the corresponding login/signup page.

Login/Signup Page: Users toggle between login and signup. Smooth transitions.

Student Login Form:

Email, Password

"Forgot Password" link below password field → triggers student password reset via email verification.

Parent Login Form:

Email, Password, Master Password

"Forgot Master Password" link below master password → triggers master password reset via email + phone verification.

No regular "Forgot Password" link.

Student Signup Form:

Full Name, Age, Date of Birth, Gender (Male/Female/Other), Qualifications, Email, Password, Interests (selectable or tags).

Parent Signup Form:

Name, Phone Number, Student's Email, Email, Password, Master Password.

Password Reset Workflows:

Students: email verification code → reset password.

Parents: email + phone verification codes → reset master password.

Validation:

Required fields, email format, phone format, password strength

Show error messages for invalid credentials.

Frontend Logic:

Only redirect to dashboard if backend returns a valid JWT token.

Use React Router for navigation.

Use Redux or Context API for authentication state management.

Tailwind CSS for styling and responsive design.

Backend (Node.js + Express + MongoDB + JWT)

Models:

Student: fullName, age, dob, gender, qualifications, email (unique), password (hashed), interests (array).

Parent: name, phone, studentEmail, email (unique), password (hashed), masterPassword (hashed).

Routes:

/api/auth/student/signup, /api/auth/student/login, /api/auth/student/forgot-password

/api/auth/parent/signup, /api/auth/parent/login, /api/auth/parent/forgot-master-password

Backend Logic:

Hash passwords & master passwords using bcrypt.

Compare hashed passwords during login.

Generate JWT tokens containing user ID and role, expiring in 1 hour.

Protect routes with JWT middleware.

Validate input fields: required, email format, phone number format, password strength.

Return clear JSON responses for success/failure.

Use environment variables for MongoDB URI and JWT secret.

Additional Requirements:

Students and parents cannot access each other's dashboards.

Frontend must only redirect if valid JWT token is received.

Fully responsive, mobile-friendly design.

Smooth navigation between login, signup, and password reset flows.
Enhance StudySphere so that screen time tracking and app blocking happen automatically, without asking the student.

⿡ Automatic Screen Time Tracking

As soon as a student creates or logs into an account:

The app automatically gains access to phone screen time and app usage stats (with device permissions).

It silently tracks all app usage for 1 week.

Collects data: daily usage, weekly usage, and most-used apps.

⿢ AI Analysis & App Limits

After 1 week of tracking, AI automatically:

Detects most-used apps

Assigns strict time limits to those apps

Stores this data securely in backend

Parents can see weekly reports + limits applied in their dashboard.

⿣ Study Session Blocking

When the student's study schedule begins:

The AI immediately blocks distracting apps (e.g., social media, games).

Only StudySphere stays open for learning.

After each roadmap lesson → AI quiz is triggered.

If student passes → apps unlock for normal use.

If student fails → apps remain blocked, and the lesson restarts.

⿤ Parent Oversight

Parents can observe:

Daily & weekly screen time per app

Apps blocked/unblocked automatically by AI

Quiz results linked to unlocking logic

Cannot disable or override the AI blocking system

⿥ Frontend Requirements

Student side:

Study session blocker screen → shows "apps locked until quiz is passed."

Roadmap & quizzes integrated with app blocking logic.

Parent side:

Usage reports → charts for app usage & AI-applied limits.

Alerts when apps are blocked/unblocked.

Tailwind CSS for mobile-friendly responsive UI.

⿦ Backend/API Requirements

/api/usage → collect and store screen time automatically

/api/limits → AI applies app limits after weekly analysis

/api/blocker → start/stop app blocking based on study sessions and quiz results

/api/reports → fetch usage stats & limits for parent dashboard

Secure all endpoints with JWT

⿧ Security & Rules

Students cannot disable screen time tracking or app blocking.

Parents hold master password → prevents app uninstallation.

AI automatically controls blocking/unblocking, no manual student choice.

Privacy: usage stats secured in backend.
Additional Rule for Study Time Enforcement

The blocking system is schedule-driven, not app-driven.

When study time starts:

All distracting apps are automatically blocked, even if the student does not open StudySphere.

Student is forced to open StudySphere if they want to unlock apps after study.

After completing the lesson + passing quiz:

Apps unlock automatically.

If quiz is failed or skipped:

Apps remain locked until lesson is redone & passed."

### Code Generation Prompt

> Based on the content model I created for "Build a complete login system for a web app called "StudySphere".", now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠 Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic** - Headless CMS for content management
- **React Context API** - State management for authentication
- **Recharts** - Data visualization and analytics
- **React Hook Form** - Form handling and validation
- **Framer Motion** - Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Bun (recommended) or npm
- Cosmic account with bucket access

### Installation

1. **Clone this repository**

```bash
git clone <repository-url>
cd studysphere-platform
```

2. **Install dependencies**

```bash
bun install
```

3. **Environment Setup**

Create a `.env.local` file in the root directory:

```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. **Run the development server**

```bash
bun run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Cosmic SDK Examples

### Fetching Student Data with Usage Analytics

```typescript
import { cosmic } from '@/lib/cosmic'

// Get student with full relationship data
export async function getStudentWithAnalytics(studentId: string) {
  try {
    const response = await cosmic.objects.findOne({
      type: 'students',
      id: studentId
    }).depth(2)
    
    return response.object
  } catch (error) {
    console.error('Error fetching student:', error)
    return null
  }
}

// Get recent usage sessions for analytics
export async function getUsageSessions(studentId: string, limit = 7) {
  try {
    const response = await cosmic.objects.find({
      type: 'usage-sessions',
      'metadata.student': studentId
    }).props(['id', 'title', 'metadata']).depth(1)
    
    return response.objects.sort((a, b) => 
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    ).slice(0, limit)
  } catch (error) {
    if (error.status === 404) return []
    throw error
  }
}
```

### Creating and Managing Study Sessions

```typescript
// Create a new study session
export async function createStudySession(sessionData: {
  student: string
  studyMaterial: string
  scheduledStart: string
  scheduledEnd: string
}) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'study-sessions',
      title: `Study Session - ${new Date(sessionData.scheduledStart).toLocaleDateString()}`,
      metadata: {
        ...sessionData,
        session_status: 'Scheduled',
        quiz_completed: false,
        apps_unlocked: false
      }
    })
    
    return response.object
  } catch (error) {
    console.error('Error creating study session:', error)
    throw error
  }
}

// Update session status and quiz results
export async function updateStudySession(sessionId: string, updates: {
  session_status?: string
  quiz_completed?: boolean
  apps_unlocked?: boolean
  actual_start?: string
  actual_end?: string
  notes?: string
}) {
  try {
    const response = await cosmic.objects.updateOne(sessionId, {
      metadata: updates
    })
    
    return response.object
  } catch (error) {
    console.error('Error updating study session:', error)
    throw error
  }
}
```

## 🔗 Cosmic CMS Integration

This application demonstrates advanced Cosmic integration patterns:

### Content Structure
- **Students**: Core user profiles with learning analytics
- **Parents**: Guardian accounts with oversight capabilities  
- **Study Materials**: Rich educational content with embedded quizzes
- **Quiz Questions**: Interactive assessments with multiple formats
- **Usage Sessions**: Detailed app usage tracking and analysis
- **Study Sessions**: Scheduled learning periods with blocking rules
- **Blocking Rules**: AI-generated app restriction policies
- **Quiz Results**: Performance tracking and progress analytics

### Key Integration Features
- **Real-time Content Updates**: Live sync of study progress and analytics
- **Relationship Management**: Complex parent-student-material connections
- **Dynamic Content Rendering**: Rich study materials with embedded media
- **Analytics Aggregation**: Automated usage pattern analysis and reporting
- **Conditional Logic**: Quiz-based app unlocking and session management

### Advanced Queries
- **Nested Object Relationships**: Deep querying with depth parameter for connected data
- **Filtered Analytics**: Time-based usage pattern analysis and trend identification
- **Performance Metrics**: Automated calculation of study effectiveness and progress tracking
- **Parent Dashboard Data**: Aggregated reports combining multiple content types

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically with git pushes

### Netlify
1. Connect repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Add environment variables

### Environment Variables
Set these in your deployment platform:
- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket identifier
- `COSMIC_READ_KEY` - Public read access key
- `COSMIC_WRITE_KEY` - Private write access key

<!-- README_END -->