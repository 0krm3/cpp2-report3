import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Clock, User } from 'lucide-react';

const TodaySchedule: React.FC = () => {
  const { getTodayShifts, users } = useApp();
  
  const todayShifts = getTodayShifts();
  
  // Get user name by ID
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };
  
  // Sort shifts by start time
  const sortedShifts = [...todayShifts].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg"
          onClick={() => document.getElementById('todayScheduleModal')?.classList.toggle('hidden')}
        >
          <Bell className="h-6 w-6" />
          {todayShifts.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {todayShifts.length}
            </span>
          )}
        </button>
        
        <div 
          id="todayScheduleModal" 
          className="hidden absolute bottom-14 right-0 bg-white rounded-lg shadow-xl w-72 overflow-hidden"
        >
          <div className="bg-blue-600 text-white p-3">
            <h3 className="font-semibold">今日のスケジュール</h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {sortedShifts.length > 0 ? (
              <div>
                {sortedShifts.map(shift => (
                  <div key={shift.id} className="p-3 border-b last:border-0">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="font-medium">{getUserName(shift.userId)}</span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-600 text-sm">
                      <Clock className="h-3 w-3 text-gray-400 mr-1" />
                      <span>{shift.startTime} - {shift.endTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                今日のシフトはありません
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaySchedule;