// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Student interface with complete metadata structure
export interface Student extends CosmicObject {
  type: 'students';
  metadata: {
    full_name: string;
    age: number;
    date_of_birth: string;
    gender: {
      key: string;
      value: 'Male' | 'Female' | 'Other';
    };
    email: string;
    grade_level: {
      key: string;
      value: 'Elementary' | 'Middle School' | 'High School' | 'College';
    };
    qualifications?: string;
    interests?: string[];
    parent?: Parent | string;
    profile_picture?: {
      url: string;
      imgix_url: string;
    };
  };
}

// Parent interface with oversight and notification preferences
export interface Parent extends CosmicObject {
  type: 'parents';
  metadata: {
    full_name: string;
    email: string;
    phone_number: string;
    student_email: string;
    notification_preferences?: string[];
    oversight_level: {
      key: string;
      value: 'Basic Monitoring' | 'Standard Control' | 'Strict Supervision';
    };
  };
}

// Study Materials interface with rich content
export interface StudyMaterial extends CosmicObject {
  type: 'study-materials';
  metadata: {
    title: string;
    subject: {
      key: string;
      value: 'Mathematics' | 'Science' | 'English' | 'History' | 'Programming';
    };
    grade_level: {
      key: string;
      value: 'Elementary' | 'Middle School' | 'High School' | 'College';
    };
    content: string;
    duration: number;
    difficulty: {
      key: string;
      value: 'Beginner' | 'Intermediate' | 'Advanced';
    };
    featured_image?: {
      url: string;
      imgix_url: string;
    };
  };
}

// Quiz Question interface with multiple question types
export interface QuizQuestion extends CosmicObject {
  type: 'quiz-questions';
  metadata: {
    question: string;
    question_type: {
      key: string;
      value: 'Multiple Choice' | 'True/False' | 'Short Answer' | 'Essay';
    };
    study_material: StudyMaterial | string;
    answer_options?: string[];
    correct_answer: string;
    explanation?: string;
    points: number;
    difficulty: {
      key: string;
      value: 'Easy' | 'Medium' | 'Hard';
    };
  };
}

// Quiz Result interface for performance tracking
export interface QuizResult extends CosmicObject {
  type: 'quiz-results';
  metadata: {
    student: Student | string;
    study_material: StudyMaterial | string;
    score: number;
    total_points: number;
    percentage: number;
    time_taken: number;
    passed: boolean;
    attempt_number: number;
    date_taken: string;
    answers_given?: Record<string, string>;
  };
}

// Study Session interface for tracking learning periods
export interface StudySession extends CosmicObject {
  type: 'study-sessions';
  metadata: {
    student: Student | string;
    study_material: StudyMaterial | string;
    scheduled_start: string;
    scheduled_end: string;
    actual_start?: string;
    actual_end?: string;
    session_status: {
      key: string;
      value: 'Scheduled' | 'In Progress' | 'Completed' | 'Missed' | 'Cancelled';
    };
    quiz_completed: boolean;
    apps_unlocked: boolean;
    notes?: string;
  };
}

// Usage Session interface for app tracking
export interface UsageSession extends CosmicObject {
  type: 'usage-sessions';
  metadata: {
    student: Student | string;
    date: string;
    app_usage_data: Record<string, number>;
    total_screen_time: number;
    most_used_app?: string;
    study_time: number;
    blocked_apps?: string[];
    ai_analysis?: string;
  };
}

// App Category interface for categorizing applications
export interface AppCategory extends CosmicObject {
  type: 'app-categories';
  metadata: {
    category_name: string;
    category_type: {
      key: string;
      value: 'Educational' | 'Social Media' | 'Gaming' | 'Entertainment' | 'Productivity' | 'Communication';
    };
    default_blocking: {
      key: string;
      value: 'Always Allow' | 'Block During Study Time' | 'Time Limited' | 'Always Block';
    };
    default_time_limit?: number;
    description?: string;
    icon?: {
      url: string;
      imgix_url: string;
    };
  };
}

// Blocking Rule interface for AI-generated rules
export interface BlockingRule extends CosmicObject {
  type: 'blocking-rules';
  metadata: {
    student: Student | string;
    app_category: AppCategory | string;
    rule_type: {
      key: string;
      value: 'Time Limit' | 'Block During Study' | 'Complete Block' | 'Schedule Based';
    };
    time_limit?: number;
    active: boolean;
    ai_generated: boolean;
    created_date: string;
    last_modified?: string;
    reason?: string;
  };
}

// API Response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Authentication context types
export interface AuthUser {
  id: string;
  email: string;
  role: 'student' | 'parent';
  name: string;
  studentId?: string; // For parent accounts
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: 'student' | 'parent', masterPassword?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Form data types
export interface StudentLoginData {
  email: string;
  password: string;
}

export interface ParentLoginData {
  email: string;
  password: string;
  masterPassword: string;
}

export interface StudentSignupData {
  fullName: string;
  age: number;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  qualifications?: string;
  email: string;
  password: string;
  interests?: string[];
}

export interface ParentSignupData {
  name: string;
  phoneNumber: string;
  studentEmail: string;
  email: string;
  password: string;
  masterPassword: string;
}

// Dashboard analytics types
export interface StudyAnalytics {
  totalStudyTime: number;
  sessionsCompleted: number;
  averageQuizScore: number;
  streakDays: number;
  weeklyProgress: Array<{
    day: string;
    studyTime: number;
    quizScore: number;
  }>;
  subjectBreakdown: Array<{
    subject: string;
    time: number;
    percentage: number;
  }>;
}

export interface UsageAnalytics {
  totalScreenTime: number;
  appsBlocked: number;
  productivityScore: number;
  dailyUsage: Array<{
    date: string;
    screenTime: number;
    studyTime: number;
    blockedTime: number;
  }>;
  topApps: Array<{
    name: string;
    usage: number;
    category: string;
  }>;
}

// Type guards for runtime validation
export function isStudent(obj: CosmicObject): obj is Student {
  return obj.type === 'students';
}

export function isParent(obj: CosmicObject): obj is Parent {
  return obj.type === 'parents';
}

export function isStudyMaterial(obj: CosmicObject): obj is StudyMaterial {
  return obj.type === 'study-materials';
}

export function isQuizQuestion(obj: CosmicObject): obj is QuizQuestion {
  return obj.type === 'quiz-questions';
}

// Utility types
export type CreateStudentData = Omit<Student, 'id' | 'created_at' | 'modified_at'>;
export type CreateParentData = Omit<Parent, 'id' | 'created_at' | 'modified_at'>;
export type UpdateStudySessionData = Partial<StudySession['metadata']>;