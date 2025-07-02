import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, TimeEntry, ShiftPreference, Shift } from '../types';
import { users, timeEntries as mockTimeEntries, shiftPreferences as mockPreferences, shifts as mockShifts, getTodayString } from '../data/mockData';

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Users
  users: User[];
  
  // Time Clock
  timeEntries: TimeEntry[];
  clockIn: (userId: string) => void;
  clockOut: (userId: string) => void;
  getActiveTimeEntry: (userId: string) => TimeEntry | undefined;
  correctTimeEntry: (entryId: string, correction: Partial<TimeEntry>) => void;
  
  // Shift Preferences
  shiftPreferences: ShiftPreference[];
  submitShiftPreference: (preference: Omit<ShiftPreference, 'id' | 'status'>) => void;
  updateShiftPreferenceStatus: (id: string, status: ShiftPreference['status']) => void;
  
  // Shifts
  shifts: Shift[];
  scheduleShift: (shift: Omit<Shift, 'id' | 'status'>) => void;
  updateShiftStatus: (id: string, status: Shift['status']) => void;
  getTodayShifts: () => Shift[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(mockTimeEntries);
  const [shiftPreferences, setShiftPreferences] = useState<ShiftPreference[]>(mockPreferences);
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);

  // Load data from localStorage on mount if available
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    const storedTimeEntries = localStorage.getItem('timeEntries');
    if (storedTimeEntries) {
      const parsedEntries = JSON.parse(storedTimeEntries).map((entry: any) => ({
        ...entry,
        clockInTime: entry.clockInTime ? new Date(entry.clockInTime) : null,
        clockOutTime: entry.clockOutTime ? new Date(entry.clockOutTime) : null,
      }));
      setTimeEntries(parsedEntries);
    }
    
    const storedPreferences = localStorage.getItem('shiftPreferences');
    if (storedPreferences) {
      setShiftPreferences(JSON.parse(storedPreferences));
    }
    
    const storedShifts = localStorage.getItem('shifts');
    if (storedShifts) {
      setShifts(JSON.parse(storedShifts));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  useEffect(() => {
    localStorage.setItem('shiftPreferences', JSON.stringify(shiftPreferences));
  }, [shiftPreferences]);

  useEffect(() => {
    localStorage.setItem('shifts', JSON.stringify(shifts));
  }, [shifts]);

  // Auth functions
  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Time Clock functions
  const getActiveTimeEntry = (userId: string) => {
    return timeEntries.find(entry => 
      entry.userId === userId && 
      entry.date === getTodayString() && 
      entry.clockInTime && 
      !entry.clockOutTime
    );
  };

  const clockIn = (userId: string) => {
    if (getActiveTimeEntry(userId)) return;
    
    const newEntry: TimeEntry = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      clockInTime: new Date(),
      clockOutTime: null,
      date: getTodayString(),
    };
    
    setTimeEntries(prev => [...prev, newEntry]);
  };

  const clockOut = (userId: string) => {
    const activeEntry = getActiveTimeEntry(userId);
    if (!activeEntry) return;
    
    setTimeEntries(prev => 
      prev.map(entry => 
        entry.id === activeEntry.id 
          ? { ...entry, clockOutTime: new Date() } 
          : entry
      )
    );
  };

  const correctTimeEntry = (entryId: string, correction: Partial<TimeEntry>) => {
    setTimeEntries(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? {
              ...entry,
              ...correction,
              corrected: true,
            }
          : entry
      )
    );
  };

  // Shift Preference functions
  const submitShiftPreference = (preference: Omit<ShiftPreference, 'id' | 'status'>) => {
    const newPreference: ShiftPreference = {
      ...preference,
      id: Math.random().toString(36).substring(2, 9),
      status: 'pending',
    };
    
    setShiftPreferences(prev => [...prev, newPreference]);
  };

  const updateShiftPreferenceStatus = (id: string, status: ShiftPreference['status']) => {
    setShiftPreferences(prev => 
      prev.map(pref => 
        pref.id === id 
          ? { ...pref, status } 
          : pref
      )
    );
  };

  // Shift functions
  const scheduleShift = (shift: Omit<Shift, 'id' | 'status'>) => {
    const newShift: Shift = {
      ...shift,
      id: Math.random().toString(36).substring(2, 9),
      status: 'scheduled',
    };
    
    setShifts(prev => [...prev, newShift]);
  };

  const updateShiftStatus = (id: string, status: Shift['status']) => {
    setShifts(prev => 
      prev.map(shift => 
        shift.id === id 
          ? { ...shift, status } 
          : shift
      )
    );
  };

  const getTodayShifts = () => {
    return shifts.filter(shift => shift.date === getTodayString());
  };

  const value = {
    currentUser,
    login,
    logout,
    users,
    timeEntries,
    clockIn,
    clockOut,
    getActiveTimeEntry,
    correctTimeEntry,
    shiftPreferences,
    submitShiftPreference,
    updateShiftPreferenceStatus,
    shifts,
    scheduleShift,
    updateShiftStatus,
    getTodayShifts,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
      throw new Error('useApp must be used within an AppProvider');
    }
    return context;
  };