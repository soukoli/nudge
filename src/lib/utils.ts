import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { NudgeFrequency } from '@/lib/db';

/**
 * Calculate the next due date based on nudge frequency
 */
export function calculateNextDueDate(
  lastDoneAt: Date | null,
  frequency: NudgeFrequency | null,
): Date | null {
  if (!frequency || frequency === 'ONCE') {
    return null;
  }

  const baseDate = lastDoneAt || new Date();

  switch (frequency) {
    case 'DAILY':
      return addDays(baseDate, 1);
    case 'WEEKLY':
      return addWeeks(baseDate, 1);
    case 'MONTHLY':
      return addMonths(baseDate, 1);
    default:
      return null;
  }
}

/**
 * Check if a date is overdue
 */
export function isOverdue(dueDate: Date | null): boolean {
  if (!dueDate) return false;
  return new Date() > dueDate;
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Get member type based on age
 */
export function getMemberTypeFromAge(age: number): string {
  if (age < 1) return 'CHILD_BABY';
  if (age < 3) return 'CHILD_TODDLER';
  if (age < 6) return 'CHILD_PRESCHOOL';
  if (age < 12) return 'CHILD_SCHOOL';
  if (age < 18) return 'CHILD_TEEN';
  return 'ADULT';
}

/**
 * Generate a random share code
 */
export function generateShareCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
