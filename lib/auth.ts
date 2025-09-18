import type { AuthUser } from '@/types'
import { getStudentByEmail, getParentByEmail } from '@/lib/cosmic'

// Mock authentication functions - In production, integrate with your auth service
export async function authenticateStudent(email: string, password: string): Promise<AuthUser | null> {
  try {
    const student = await getStudentByEmail(email);
    
    if (!student) {
      return null;
    }
    
    // Mock password validation - implement actual password hashing in production
    if (password.length < 6) {
      return null;
    }
    
    return {
      id: student.id,
      email: student.metadata.email,
      role: 'student',
      name: student.metadata.full_name
    };
  } catch (error) {
    console.error('Student authentication error:', error);
    return null;
  }
}

export async function authenticateParent(
  email: string, 
  password: string, 
  masterPassword: string
): Promise<AuthUser | null> {
  try {
    const parent = await getParentByEmail(email);
    
    if (!parent) {
      return null;
    }
    
    // Mock password validation - implement actual password hashing in production
    if (password.length < 6 || masterPassword.length < 8) {
      return null;
    }
    
    // Find associated student
    const studentEmail = parent.metadata.student_email;
    const student = await getStudentByEmail(studentEmail);
    
    return {
      id: parent.id,
      email: parent.metadata.email,
      role: 'parent',
      name: parent.metadata.full_name,
      studentId: student?.id
    };
  } catch (error) {
    console.error('Parent authentication error:', error);
    return null;
  }
}

// Generate mock JWT token - implement actual JWT generation in production
export function generateToken(user: AuthUser): string {
  return btoa(JSON.stringify({
    ...user,
    exp: Date.now() + 3600000 // 1 hour
  }));
}

// Validate mock JWT token - implement actual JWT validation in production
export function validateToken(token: string): AuthUser | null {
  try {
    const decoded = JSON.parse(atob(token));
    
    if (decoded.exp < Date.now()) {
      return null; // Token expired
    }
    
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
      studentId: decoded.studentId
    };
  } catch (error) {
    return null;
  }
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Email format validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone number format validation
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}