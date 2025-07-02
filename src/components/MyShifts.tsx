import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTodayString, getDateString } from '../data/mockData';
import { Calendar as CalendarIcon, Clock, Plus, List, Calendar as FullCalendar } from 'lucide-react';
import FullCalendarComponent from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const MyShifts: React.FC = () => {
  const { currentUser, shifts, shiftPreferences, submitShiftPreference } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [monthlyPreferences, setMonthlyPreferences] = useState<{
    [date: string]: { startTime: string; endTime: string };
  }>({});
  
  if (!currentUser) return null;
  
  // Get user's shifts and preferences
  const userShifts = shifts.filter(shift => shift.userId === currentUser.id);
  const userPreferences = shiftPreferences.filter(pref => pref.userId === currentUser.id);
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${dateStr} (${days[date.getDay()]})`;
  };
  
  // Handle monthly preference submission
  const handleSubmitMonthlyPreferences = () => {
    if (!currentUser) return;
    
    Object.entries(monthlyPreferences).forEach(([date, times]) => {
      submitShiftPreference({
        userId: currentUser.id,
        date,
        startTime: times.startTime,
        endTime: times.endTime,
        notes: '',
      });
    });
    
    setIsModalOpen(false);
    setMonthlyPreferences({});
  };
  
  // Get calendar events
  const getCalendarEvents = () => {
    const confirmedEvents = userShifts.map(shift => ({
      title: `確定: ${shift.startTime}-${shift.endTime}`,
      start: shift.date,
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
    }));
    
    const preferenceEvents = userPreferences.map(pref => ({
      title: `希望: ${pref.startTime}-${pref.endTime}`,
      start: pref.date,
      backgroundColor: pref.status === 'approved' ? '#10B981' : 
                      pref.status === 'rejected' ? '#EF4444' : '#F59E0B',
      borderColor: pref.status === 'approved' ? '#10B981' : 
                  pref.status === 'rejected' ? '#EF4444' : '#F59E0B',
    }));
    
    return [...confirmedEvents, ...preferenceEvents];
  };
  
  // Generate dates for selected month
  const getDatesForMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const dates: string[] = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates;
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">自分のシフト</h1>
        <div className="flex gap-4">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 flex items-center ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              リスト
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 flex items-center ${
                viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <FullCalendar className="h-4 w-4 mr-2" />
              カレンダー
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            希望を提出
          </button>
        </div>
      </div>
      
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <FullCalendarComponent
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={getCalendarEvents()}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: '',
            }}
            locale="ja"
            buttonText={{
              today: '今日',
            }}
            height="auto"
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Confirmed Shifts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
              確定シフト
            </h2>
            
            {userShifts.length > 0 ? (
              <div className="space-y-4">
                {userShifts
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(shift => (
                    <div key={shift.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{formatDate(shift.date)}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          shift.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          shift.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {shift.status === 'scheduled' ? '予定' :
                           shift.status === 'completed' ? '完了' : '欠勤'}
                        </span>
                      </div>
                      <div className="mt-1 text-gray-600">
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">確定しているシフトはありません</p>
            )}
          </div>
          
          {/* Shift Preferences */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
              希望シフト
            </h2>
            
            {userPreferences.length > 0 ? (
              <div className="space-y-4">
                {userPreferences
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(preference => (
                    <div key={preference.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{formatDate(preference.date)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          preference.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          preference.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {preference.status === 'pending' ? '審査中' :
                           preference.status === 'approved' ? '承認済' : '却下'}
                        </span>
                      </div>
                      <div className="mt-1 text-gray-600">
                        {preference.startTime} - {preference.endTime}
                      </div>
                      {preference.notes && (
                        <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                          {preference.notes}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">提出した希望シフトはありません</p>
            )}
          </div>
        </div>
      )}
      
      {/* Monthly Shift Preference Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6">
            <h2 className="text-xl font-semibold mb-4">シフト希望を提出</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">対象月</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setMonthlyPreferences({});
                }}
                min={getDateString(1).substring(0, 7)}
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-3 text-left">日付</th>
                    <th className="p-3 text-left">開始時間</th>
                    <th className="p-3 text-left">終了時間</th>
                  </tr>
                </thead>
                <tbody>
                  {getDatesForMonth().map(date => (
                    <tr key={date} className="border-b">
                      <td className="p-3">{formatDate(date)}</td>
                      <td className="p-3">
                        <input
                          type="time"
                          value={monthlyPreferences[date]?.startTime || ''}
                          onChange={(e) => setMonthlyPreferences(prev => ({
                            ...prev,
                            [date]: {
                              ...prev[date],
                              startTime: e.target.value,
                            },
                          }))}
                          className="border border-gray-300 rounded-lg p-2"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="time"
                          value={monthlyPreferences[date]?.endTime || ''}
                          onChange={(e) => setMonthlyPreferences(prev => ({
                            ...prev,
                            [date]: {
                              ...prev[date],
                              endTime: e.target.value,
                            },
                          }))}
                          className="border border-gray-300 rounded-lg p-2"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmitMonthlyPreferences}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                提出する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyShifts;