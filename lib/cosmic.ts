import { createBucketClient } from '@cosmicjs/sdk'
import type { 
  Student, 
  Parent, 
  StudyMaterial, 
  QuizQuestion, 
  QuizResult, 
  StudySession, 
  UsageSession, 
  AppCategory, 
  BlockingRule,
  CosmicResponse
} from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Student-related functions
export async function getStudents(): Promise<Student[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'students' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as Student[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch students');
  }
}

export async function getStudent(id: string): Promise<Student | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'students',
      id
    }).depth(2);
    return response.object as Student;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch student');
  }
}

export async function getStudentByEmail(email: string): Promise<Student | null> {
  try {
    const response = await cosmic.objects.find({
      type: 'students',
      'metadata.email': email
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);
    
    const students = response.objects as Student[];
    return students.length > 0 ? students[0] : null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch student by email');
  }
}

// Parent-related functions
export async function getParents(): Promise<Parent[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'parents' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as Parent[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch parents');
  }
}

export async function getParent(id: string): Promise<Parent | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'parents',
      id
    }).depth(1);
    return response.object as Parent;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch parent');
  }
}

export async function getParentByEmail(email: string): Promise<Parent | null> {
  try {
    const response = await cosmic.objects.find({
      type: 'parents',
      'metadata.email': email
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);
    
    const parents = response.objects as Parent[];
    return parents.length > 0 ? parents[0] : null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch parent by email');
  }
}

// Study Materials functions
export async function getStudyMaterials(): Promise<StudyMaterial[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'study-materials' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as StudyMaterial[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch study materials');
  }
}

export async function getStudyMaterial(id: string): Promise<StudyMaterial | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'study-materials',
      id
    }).depth(1);
    return response.object as StudyMaterial;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch study material');
  }
}

// Quiz functions
export async function getQuizQuestions(studyMaterialId: string): Promise<QuizQuestion[]> {
  try {
    const response = await cosmic.objects.find({
      type: 'quiz-questions',
      'metadata.study_material': studyMaterialId
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);
    
    return response.objects as QuizQuestion[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch quiz questions');
  }
}

export async function getQuizResults(studentId: string): Promise<QuizResult[]> {
  try {
    const response = await cosmic.objects.find({
      type: 'quiz-results',
      'metadata.student': studentId
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);
    
    const results = response.objects as QuizResult[];
    return results.sort((a, b) => 
      new Date(b.metadata.date_taken).getTime() - new Date(a.metadata.date_taken).getTime()
    );
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch quiz results');
  }
}

// Study Sessions functions
export async function getStudySessions(studentId: string): Promise<StudySession[]> {
  try {
    const response = await cosmic.objects.find({
      type: 'study-sessions',
      'metadata.student': studentId
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);
    
    const sessions = response.objects as StudySession[];
    return sessions.sort((a, b) => 
      new Date(b.metadata.scheduled_start).getTime() - new Date(a.metadata.scheduled_start).getTime()
    );
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch study sessions');
  }
}

export async function createStudySession(sessionData: {
  student: string;
  studyMaterial: string;
  scheduledStart: string;
  scheduledEnd: string;
}): Promise<StudySession> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'study-sessions',
      title: `Study Session - ${new Date(sessionData.scheduledStart).toLocaleDateString()}`,
      metadata: {
        student: sessionData.student,
        study_material: sessionData.studyMaterial,
        scheduled_start: sessionData.scheduledStart,
        scheduled_end: sessionData.scheduledEnd,
        session_status: { key: 'scheduled', value: 'Scheduled' },
        quiz_completed: false,
        apps_unlocked: false
      }
    });
    
    return response.object as StudySession;
  } catch (error) {
    console.error('Error creating study session:', error);
    throw new Error('Failed to create study session');
  }
}

export async function updateStudySession(sessionId: string, updates: {
  session_status?: string;
  quiz_completed?: boolean;
  apps_unlocked?: boolean;
  actual_start?: string;
  actual_end?: string;
  notes?: string;
}): Promise<StudySession> {
  try {
    // Convert status to proper format if provided
    const metadata: Record<string, any> = {};
    
    if (updates.session_status) {
      metadata.session_status = { 
        key: updates.session_status.toLowerCase().replace(' ', '_'), 
        value: updates.session_status 
      };
    }
    
    // Add other updates
    Object.keys(updates).forEach(key => {
      if (key !== 'session_status' && updates[key as keyof typeof updates] !== undefined) {
        metadata[key] = updates[key as keyof typeof updates];
      }
    });

    const response = await cosmic.objects.updateOne(sessionId, {
      metadata
    });
    
    return response.object as StudySession;
  } catch (error) {
    console.error('Error updating study session:', error);
    throw new Error('Failed to update study session');
  }
}

// Usage Sessions functions
export async function getUsageSessions(studentId: string, limit = 7): Promise<UsageSession[]> {
  try {
    const response = await cosmic.objects.find({
      type: 'usage-sessions',
      'metadata.student': studentId
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);
    
    const sessions = response.objects as UsageSession[];
    return sessions
      .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
      .slice(0, limit);
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch usage sessions');
  }
}

// App Categories functions
export async function getAppCategories(): Promise<AppCategory[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'app-categories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as AppCategory[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch app categories');
  }
}

// Blocking Rules functions
export async function getBlockingRules(studentId: string): Promise<BlockingRule[]> {
  try {
    const response = await cosmic.objects.find({
      type: 'blocking-rules',
      'metadata.student': studentId
    }).props(['id', 'title', 'slug', 'metadata']).depth(1);
    
    return response.objects as BlockingRule[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch blocking rules');
  }
}

export async function createBlockingRule(ruleData: {
  student: string;
  appCategory: string;
  ruleType: string;
  timeLimit?: number;
  reason?: string;
}): Promise<BlockingRule> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'blocking-rules',
      title: `Blocking Rule - ${new Date().toLocaleDateString()}`,
      metadata: {
        student: ruleData.student,
        app_category: ruleData.appCategory,
        rule_type: { key: ruleData.ruleType.toLowerCase().replace(' ', '_'), value: ruleData.ruleType },
        time_limit: ruleData.timeLimit || "",
        active: true,
        ai_generated: true,
        created_date: new Date().toISOString().split('T')[0],
        reason: ruleData.reason || ""
      }
    });
    
    return response.object as BlockingRule;
  } catch (error) {
    console.error('Error creating blocking rule:', error);
    throw new Error('Failed to create blocking rule');
  }
}

// Quiz submission function
export async function submitQuizResult(resultData: {
  student: string;
  studyMaterial: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeTaken: number;
  passed: boolean;
  attemptNumber: number;
  answersGiven: Record<string, string>;
}): Promise<QuizResult> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'quiz-results',
      title: `Quiz Result - ${new Date().toLocaleDateString()}`,
      metadata: {
        student: resultData.student,
        study_material: resultData.studyMaterial,
        score: resultData.score,
        total_points: resultData.totalPoints,
        percentage: resultData.percentage,
        time_taken: resultData.timeTaken,
        passed: resultData.passed,
        attempt_number: resultData.attemptNumber,
        date_taken: new Date().toISOString().split('T')[0],
        answers_given: resultData.answersGiven
      }
    });
    
    return response.object as QuizResult;
  } catch (error) {
    console.error('Error submitting quiz result:', error);
    throw new Error('Failed to submit quiz result');
  }
}