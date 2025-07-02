import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { users } from '../data/mockData';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const AllShifts: React.FC = () => {
  const { shifts } = useApp();
  const [currentWeek, setCurrentWeek] = useState(getWeekDates(new Date()));
  
  // Get dates for a week
  function getWeekDates(date: Date): string[] {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = date.getDate() - day;
    
    return Array(7).fill(null).map((_, i) => {
      const newDate = new Date(date);
      newDate.setDate(diff + i);
      return newDate.toISOString().split('T')[0];
    });
  }
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getDate()}日 (${days[date.getDay()]})`;
  };
  
  // Check if date is today
  const isToday = (dateStr: string) => {
    const today = new Date();
    return dateStr === today.toISOString().split('T')[0];
  };
  
  // Go to previous week
  const prevWeek = () => {
    const firstDay = new Date(currentWeek[0]);
    firstDay.setDate(firstDay.getDate() - 7);
    setCurrentWeek(getWeekDates(firstDay));
  };
  
  // Go to next week
  const nextWeek = () => {
    const firstDay = new Date(currentWeek[0]);
    firstDay.setDate(firstDay.getDate() + 7);
    setCurrentWeek(getWeekDates(firstDay));
  };
  
  // Go to current week
  const goToCurrentWeek = () => {
    setCurrentWeek(getWeekDates(new Date()));
  };
  
  // Get month and year for display
  const getMonthYear = () => {
    const firstDay = new Date(currentWeek[0]);
    const lastDay = new Date(currentWeek[6]);
    
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${firstDay.getFullYear()}年${firstDay.getMonth() + 1}月`;
    } else {
      return `${firstDay.getFullYear()}年${firstDay.getMonth() + 1}月～${lastDay.getMonth() + 1}月`;
    }
  };
  
  // Get shifts for a specific date and user
  const getShiftForDateAndUser = (date: string, userId: string) => {
    return shifts.find(shift => 
      shift.date === date && shift.userId === userId
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">全体シフト表</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        {/* Week navigation */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={prevWeek}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold">{getMonthYear()}</h2>
            <button 
              onClick={goToCurrentWeek}
              className="text-sm text-blue-500 hover:underline mt-1"
            >
              今週に戻る
            </button>
          </div>
          
          <button 
            onClick={nextWeek}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* Calendar grid */}
        <div className="min-w-[768px]">
          <div className="grid grid-cols-8 border-b pb-2 mb-4">
            <div className="font-medium">スタッフ</div>
            {currentWeek.map((date, index) => (
              <div 
                key={date} 
                className={`font-medium text-center ${
                  isToday(date) ? 'text-blue-600' : index === 0 || index === 6 ? 'text-red-500' : ''
                }`}
              >
                {formatDate(date)}
                {isToday(date) && <span className="block text-xs">(今日)</span>}
              </div>
            ))}
          </div>
          
          {users
            .filter(user => user.role === 'employee')
            .map(user => (
              <div key={user.id} className="grid grid-cols-8 border-b py-3 last:border-0">
                <div className="font-medium">{user.name}</div>
                
                {currentWeek.map(date => {
                  const shift = getShiftForDateAndUser(date, user.id);
                  
                  return (
                    <div key={date} className="text-center">
                      {shift ? (
                        <div className={`mx-1 p-1 rounded text-sm ${
                          isToday(date) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                        }`}>
                          {shift.startTime} - {shift.endTime}
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium text-blue-700">シフト表について</h3>
            <p className="text-sm text-blue-600 mt-1">
              全スタッフのシフトをカレンダー形式で確認できます。シフトの希望提出は「自分のシフト」ページから行ってください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllShifts;