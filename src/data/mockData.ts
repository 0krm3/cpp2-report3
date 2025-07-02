import { User, TimeEntry, ShiftPreference, Shift } from '../types';

// Generate a random ID
export const generateId = (): string => Math.random().toString(36).substring(2, 9);

// Current users with passwords
export const users: User[] = [
  {
    id: '1',
    name: '田中 健太',
    role: 'admin',
    email: 'tanaka@example.com',
    password: 'admin123'
  },
  {
    id: '2',
    name: '佐藤 美咲',
    role: 'employee',
    email: 'sato@example.com',
    password: 'employee123'
  },
  {
    id: '3',
    name: '山田 太郎',
    role: 'employee',
    email: 'yamada@example.com',
    password: 'employee456'
  },
  {
    id: '4',
    name: '鈴木 さくら',
    role: 'employee',
    email: 'suzuki@example.com',
    password: 'employee789'
  },
];

// Function to get today's date in YYYY-MM-DD format
export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Function to get date for n days from today
export const getDateString = (daysFromToday: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split('T')[0];
};

// Mock time entries
export const timeEntries: TimeEntry[] = [
  {
    id: '1',
    userId: '2',
    clockInTime: new Date(new Date().setHours(9, 0, 0, 0)),
    clockOutTime: new Date(new Date().setHours(17, 0, 0, 0)),
    date: getDateString(-1),
  },
  {
    id: '2',
    userId: '3',
    clockInTime: new Date(new Date().setHours(10, 0, 0, 0)),
    clockOutTime: new Date(new Date().setHours(19, 0, 0, 0)),
    date: getDateString(-1),
  },
  {
    id: '3',
    userId: '2',
    clockInTime: new Date(new Date().setHours(9, 0, 0, 0)),
    clockOutTime: null,
    date: getTodayString(),
  },
];

// Mock shift preferences
export const shiftPreferences: ShiftPreference[] = [
  {
    id: '1',
    userId: '2',
    date: getDateString(1),
    startTime: '09:00',
    endTime: '17:00',
    status: 'pending',
  },
  {
    id: '2',
    userId: '2',
    date: getDateString(2),
    startTime: '09:00',
    endTime: '17:00',
    status: 'approved',
  },
  {
    id: '3',
    userId: '3',
    date: getDateString(1),
    startTime: '13:00',
    endTime: '21:00',
    status: 'pending',
    notes: '午後のシフトを希望します',
  },
  {
    id: '4',
    userId: '4',
    date: getDateString(2),
    startTime: '09:00',
    endTime: '17:00',
    status: 'approved',
  },
];

// Mock scheduled shifts
export const shifts: Shift[] = [
  {
    id: '1',
    userId: '2',
    date: getTodayString(),
    startTime: '09:00',
    endTime: '17:00',
    status: 'scheduled',
  },
  {
    id: '2',
    userId: '3',
    date: getTodayString(),
    startTime: '13:00',
    endTime: '21:00',
    status: 'scheduled',
  },
  {
    id: '3',
    userId: '4',
    date: getTodayString(),
    startTime: '09:00',
    endTime: '17:00',
    status: 'scheduled',
  },
  {
    id: '4',
    userId: '2',
    date: getDateString(1),
    startTime: '09:00',
    endTime: '17:00',
    status: 'scheduled',
  },
  {
    id: '5',
    userId: '4',
    date: getDateString(1),
    startTime: '09:00',
    endTime: '17:00',
    status: 'scheduled',
  },
];