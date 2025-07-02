import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Calendar, Check, X, Calendar as CalendarIcon } from 'lucide-react';

const ShiftManagement: React.FC = () => {
  const { 
    currentUser, 
    users, 
    shiftPreferences, 
    updateShiftPreferenceStatus, 
    scheduleShift, 
    shifts, 
    getTodayShifts 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'requests' | 'schedule'>('requests');
  const [selectedUser, setSelectedUser] = useState<string | 'all'>('all');
  
  // Check if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 rounded-xl p-6 border border-red-100">
          <h1 className="text-xl font-semibold text-red-700">
            アクセス権限がありません
          </h1>
          <p className="mt-2 text-red-600">
            このページは管理者のみアクセスできます。
          </p>
        </div>
      </div>
    );
  }
  
  // Get pending shift preferences
  const pendingPreferences = shiftPreferences
    .filter(pref => 
      pref.status === 'pending' && 
      (selectedUser === 'all' || pref.userId === selectedUser)
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Get employees (non-admin users)
  const employees = users.filter(user => user.role === 'employee');
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return `${dateStr} (${days[date.getDay()]})`;
  };
  
  // Handle preference approval
  const handleApprove = (preference: typeof shiftPreferences[0]) => {
    // Update preference status
    updateShiftPreferenceStatus(preference.id, 'approved');
    
    // Create a shift based on the preference
    scheduleShift({
      userId: preference.userId,
      date: preference.date,
      startTime: preference.startTime,
      endTime: preference.endTime,
    });
  };
  
  // Handle preference rejection
  const handleReject = (preferenceId: string) => {
    updateShiftPreferenceStatus(preferenceId, 'rejected');
  };
  
  // Get user name by ID
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };
  
  // Get today's shifts
  const todayShifts = getTodayShifts();
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">シフト管理</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'requests' 
              ? 'text-blue-600 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          希望リクエスト
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'schedule' 
              ? 'text-blue-600 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          今日のシフト
        </button>
      </div>
      
      {activeTab === 'requests' && (
        <>
          {/* Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center">
            <label className="mr-3 text-gray-700">スタッフ:</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border rounded-md px-3 py-1"
            >
              <option value="all">全員</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              シフト希望リクエスト
            </h2>
            
            {pendingPreferences.length > 0 ? (
              <div className="space-y-4">
                {pendingPreferences.map(preference => (
                  <div key={preference.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{getUserName(preference.userId)}</div>
                        <div className="text-gray-600 mt-1">{formatDate(preference.date)}</div>
                        <div className="flex items-center mt-2">
                          <Clock className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{preference.startTime} - {preference.endTime}</span>
                        </div>
                        {preference.notes && (
                          <div className="mt-3 text-sm bg-gray-50 p-2 rounded">
                            <span className="font-medium">備考: </span>
                            {preference.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(preference)}
                          className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          承認
                        </button>
                        <button
                          onClick={() => handleReject(preference.id)}
                          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                        >
                          <X className="h-4 w-4 mr-1" />
                          却下
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">保留中のリクエストはありません</p>
            )}
          </div>
        </>
      )}
      
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
            今日のシフト
          </h2>
          
          {todayShifts.length > 0 ? (
            <div className="space-y-4">
              {todayShifts.map(shift => (
                <div key={shift.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{getUserName(shift.userId)}</div>
                    <div className="flex items-center mt-1 text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{shift.startTime} - {shift.endTime}</span>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    shift.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                    shift.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {shift.status === 'scheduled' ? '予定' :
                     shift.status === 'completed' ? '完了' : '欠勤'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p className="text-yellow-700">今日のシフトはありません</p>
            </div>
          )}
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-700">通知を送信</h3>
            <p className="text-sm text-blue-600 mt-1">
              今日のシフトのスタッフに通知を送ることができます。
            </p>
            <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              通知を送信する
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManagement;