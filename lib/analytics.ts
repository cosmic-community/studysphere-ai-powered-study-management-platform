import type { StudyAnalytics, UsageAnalytics, StudySession, QuizResult, UsageSession } from '@/types'
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'

export function calculateStudyAnalytics(
  studySessions: StudySession[],
  quizResults: QuizResult[]
): StudyAnalytics {
  const completedSessions = studySessions.filter(session => 
    session.metadata.session_status.value === 'Completed'
  );
  
  const totalStudyTime = completedSessions.reduce((total, session) => {
    if (session.metadata.actual_start && session.metadata.actual_end) {
      const start = new Date(session.metadata.actual_start);
      const end = new Date(session.metadata.actual_end);
      return total + (end.getTime() - start.getTime()) / (1000 * 60); // Convert to minutes
    }
    return total;
  }, 0);
  
  const averageQuizScore = quizResults.length > 0
    ? quizResults.reduce((sum, result) => sum + result.metadata.percentage, 0) / quizResults.length
    : 0;
  
  // Calculate streak days (mock implementation)
  const streakDays = calculateStreakDays(studySessions);
  
  // Weekly progress data
  const weeklyProgress = generateWeeklyProgress(studySessions, quizResults);
  
  // Subject breakdown
  const subjectBreakdown = calculateSubjectBreakdown(completedSessions);
  
  return {
    totalStudyTime: Math.round(totalStudyTime),
    sessionsCompleted: completedSessions.length,
    averageQuizScore: Math.round(averageQuizScore),
    streakDays,
    weeklyProgress,
    subjectBreakdown
  };
}

export function calculateUsageAnalytics(usageSessions: UsageSession[]): UsageAnalytics {
  if (usageSessions.length === 0) {
    return {
      totalScreenTime: 0,
      appsBlocked: 0,
      productivityScore: 0,
      dailyUsage: [],
      topApps: []
    };
  }
  
  const totalScreenTime = usageSessions.reduce((total, session) => 
    total + session.metadata.total_screen_time, 0
  );
  
  const totalAppsBlocked = usageSessions.reduce((total, session) => 
    total + (session.metadata.blocked_apps?.length || 0), 0
  );
  
  const totalStudyTime = usageSessions.reduce((total, session) => 
    total + session.metadata.study_time, 0
  );
  
  // Calculate productivity score (study time / total screen time * 100)
  const productivityScore = totalScreenTime > 0 
    ? Math.round((totalStudyTime / totalScreenTime) * 100)
    : 0;
  
  // Daily usage breakdown
  const dailyUsage = usageSessions.map(session => ({
    date: format(new Date(session.metadata.date), 'MMM dd'),
    screenTime: session.metadata.total_screen_time,
    studyTime: session.metadata.study_time,
    blockedTime: session.metadata.total_screen_time - session.metadata.study_time
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Top apps calculation
  const topApps = calculateTopApps(usageSessions);
  
  return {
    totalScreenTime: Math.round(totalScreenTime),
    appsBlocked: totalAppsBlocked,
    productivityScore,
    dailyUsage: dailyUsage.slice(-7), // Last 7 days
    topApps
  };
}

function calculateStreakDays(studySessions: StudySession[]): number {
  const completedSessions = studySessions
    .filter(session => session.metadata.session_status.value === 'Completed')
    .sort((a, b) => new Date(b.metadata.actual_end || b.metadata.scheduled_end).getTime() - 
                    new Date(a.metadata.actual_end || a.metadata.scheduled_end).getTime());
  
  if (completedSessions.length === 0) return 0;
  
  // Simple streak calculation - count consecutive days with completed sessions
  let streak = 1;
  let currentDate = new Date(completedSessions[0].metadata.actual_end || completedSessions[0].metadata.scheduled_end);
  
  for (let i = 1; i < completedSessions.length; i++) {
    const sessionDate = new Date(completedSessions[i].metadata.actual_end || completedSessions[i].metadata.scheduled_end);
    const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }
  
  return streak;
}

function generateWeeklyProgress(
  studySessions: StudySession[],
  quizResults: QuizResult[]
): Array<{ day: string; studyTime: number; quizScore: number }> {
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  
  const weeklyData = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    
    const dayString = format(date, 'EEE');
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Calculate study time for this day
    const daySessions = studySessions.filter(session => {
      const sessionDate = session.metadata.actual_start || session.metadata.scheduled_start;
      return sessionDate.startsWith(dateString) && session.metadata.session_status.value === 'Completed';
    });
    
    const studyTime = daySessions.reduce((total, session) => {
      if (session.metadata.actual_start && session.metadata.actual_end) {
        const start = new Date(session.metadata.actual_start);
        const end = new Date(session.metadata.actual_end);
        return total + (end.getTime() - start.getTime()) / (1000 * 60); // Convert to minutes
      }
      return total + 30; // Default session time if actual times not available
    }, 0);
    
    // Calculate average quiz score for this day
    const dayQuizzes = quizResults.filter(result => 
      result.metadata.date_taken.startsWith(dateString)
    );
    
    const quizScore = dayQuizzes.length > 0
      ? dayQuizzes.reduce((sum, result) => sum + result.metadata.percentage, 0) / dayQuizzes.length
      : 0;
    
    weeklyData.push({
      day: dayString,
      studyTime: Math.round(studyTime),
      quizScore: Math.round(quizScore)
    });
  }
  
  return weeklyData;
}

function calculateSubjectBreakdown(completedSessions: StudySession[]): Array<{
  subject: string;
  time: number;
  percentage: number;
}> {
  const subjectTimes: Record<string, number> = {};
  let totalTime = 0;
  
  completedSessions.forEach(session => {
    // Extract subject from study material if available
    const subject = typeof session.metadata.study_material === 'object' 
      ? session.metadata.study_material.metadata?.subject?.value || 'General'
      : 'General';
    
    let sessionTime = 30; // Default time
    if (session.metadata.actual_start && session.metadata.actual_end) {
      const start = new Date(session.metadata.actual_start);
      const end = new Date(session.metadata.actual_end);
      sessionTime = (end.getTime() - start.getTime()) / (1000 * 60);
    }
    
    subjectTimes[subject] = (subjectTimes[subject] || 0) + sessionTime;
    totalTime += sessionTime;
  });
  
  return Object.entries(subjectTimes)
    .map(([subject, time]) => ({
      subject,
      time: Math.round(time),
      percentage: totalTime > 0 ? Math.round((time / totalTime) * 100) : 0
    }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 5); // Top 5 subjects
}

function calculateTopApps(usageSessions: UsageSession[]): Array<{
  name: string;
  usage: number;
  category: string;
}> {
  const appUsage: Record<string, number> = {};
  
  usageSessions.forEach(session => {
    Object.entries(session.metadata.app_usage_data || {}).forEach(([app, usage]) => {
      appUsage[app] = (appUsage[app] || 0) + usage;
    });
  });
  
  // Mock categories for apps
  const appCategories: Record<string, string> = {
    'Instagram': 'Social Media',
    'TikTok': 'Social Media',
    'StudySphere': 'Education',
    'Calculator': 'Productivity',
    'Messages': 'Communication',
    'Safari': 'Productivity'
  };
  
  return Object.entries(appUsage)
    .map(([name, usage]) => ({
      name,
      usage: Math.round(usage),
      category: appCategories[name] || 'Other'
    }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5); // Top 5 apps
}