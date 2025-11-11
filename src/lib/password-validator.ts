/**
 * Password Validation Utility
 * Provides password strength checking and validation
 */

export interface PasswordStrength {
  score: number; // 0-4 (0=very weak, 4=very strong)
  label: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
  feedback: string[];
  isValid: boolean;
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
}

const DEFAULT_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
};

/**
 * Validate password against requirements
 */
export function validatePassword(
  password: string,
  requirements: Partial<PasswordRequirements> = {}
): PasswordStrength {
  const reqs = { ...DEFAULT_REQUIREMENTS, ...requirements };
  const feedback: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < reqs.minLength) {
    feedback.push(`Password must be at least ${reqs.minLength} characters long`);
  } else {
    score++;
    if (password.length >= 12) score++; // Bonus for longer passwords
  }

  // Check for uppercase letters
  if (reqs.requireUppercase) {
    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain at least one uppercase letter');
    } else {
      score++;
    }
  }

  // Check for lowercase letters
  if (reqs.requireLowercase) {
    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain at least one lowercase letter');
    } else {
      score++;
    }
  }

  // Check for numbers
  if (reqs.requireNumber) {
    if (!/[0-9]/.test(password)) {
      feedback.push('Password must contain at least one number');
    } else {
      score++;
    }
  }

  // Check for special characters
  if (reqs.requireSpecial) {
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Password must contain at least one special character (!@#$%^&*...)');
    } else {
      score++;
    }
  }

  // Additional checks for strength
  if (password.length >= 16) {
    score++; // Extra bonus for very long passwords
  }

  // Check for common patterns (weak passwords)
  const commonPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^abc123/i,
    /^letmein/i,
    /^admin/i,
    /^welcome/i,
    /^monkey/i,
    /^dragon/i,
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    feedback.push('Password contains common patterns - please choose something more unique');
    score = Math.max(0, score - 2);
  }

  // Determine label and validity
  let label: PasswordStrength['label'];
  let isValid: boolean;

  if (score === 0) {
    label = 'very-weak';
    isValid = false;
  } else if (score <= 1) {
    label = 'weak';
    isValid = false;
  } else if (score <= 3) {
    label = 'medium';
    isValid = true;
  } else if (score <= 5) {
    label = 'strong';
    isValid = true;
  } else {
    label = 'very-strong';
    isValid = true;
  }

  // If there's any feedback, password is not fully valid
  if (feedback.length > 0 && score < 3) {
    isValid = false;
  }

  return {
    score: Math.min(score, 4),
    label,
    feedback,
    isValid,
  };
}

/**
 * Check if password meets minimum requirements for signup
 */
export function isPasswordValid(password: string, minLength: number = 8): boolean {
  if (password.length < minLength) return false;
  
  // At minimum, require length and at least 2 of: uppercase, lowercase, number, special
  let criteria = 0;
  if (/[A-Z]/.test(password)) criteria++;
  if (/[a-z]/.test(password)) criteria++;
  if (/[0-9]/.test(password)) criteria++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) criteria++;
  
  return criteria >= 2;
}

/**
 * Get password strength color for UI
 */
export function getPasswordStrengthColor(label: PasswordStrength['label']): string {
  switch (label) {
    case 'very-weak':
      return 'text-red-500 bg-red-500/20 border-red-500/50';
    case 'weak':
      return 'text-orange-500 bg-orange-500/20 border-orange-500/50';
    case 'medium':
      return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
    case 'strong':
      return 'text-green-500 bg-green-500/20 border-green-500/50';
    case 'very-strong':
      return 'text-emerald-500 bg-emerald-500/20 border-emerald-500/50';
    default:
      return 'text-gray-500 bg-gray-500/20 border-gray-500/50';
  }
}

/**
 * Get password strength label for display
 */
export function getPasswordStrengthLabel(label: PasswordStrength['label']): string {
  switch (label) {
    case 'very-weak':
      return 'Very Weak';
    case 'weak':
      return 'Weak';
    case 'medium':
      return 'Medium';
    case 'strong':
      return 'Strong';
    case 'very-strong':
      return 'Very Strong';
    default:
      return 'Unknown';
  }
}

