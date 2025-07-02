export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password: string; // Added password field
}

export interface TimeEntry {
  id: string;
  userId: string;
  clockInTime: Date | null;
  clockOutTime: Date | null;
  date: string; // YYYY-MM-DD
  corrected?: boolean; // Flag to indicate if entry was corrected
  correctionReason?: string; // Reason for correction
}

export interface ShiftPreference {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface Shift {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'scheduled' | 'completed' | 'missed';
}