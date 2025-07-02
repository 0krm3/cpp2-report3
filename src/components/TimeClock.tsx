import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/dateUtils';
import { Clock, LogIn, LogOut, History, AlertCircle } from 'lucide-react';

const TimeClock: React.FC = () => {
  const { currentUser, clockIn, clockOut, getActiveTimeEntry, timeEntries, correctTimeEntry } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [isClockingOut, setIsClockingOut] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' | null }>({ 
    text: '', 
    type: null 
  });
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [correction, setCorrection] = useState({
    date: '',
    clockInTime: '',
    clockOutTime: '',
    reason: '',
  });
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const activeTimeEntry = currentUser ? getActiveTimeEntry(currentUser.id) : undefined;
  const isClockedIn = !!activeTimeEntry;
  
  const handleClockIn = () => {
    if (!currentUser) return;
    
    setIsClockingIn(true);
    
    setTimeout(() => {
      clockIn(currentUser.id);
      setMessage({ 
        text: `${formatTime(new Date())}に出勤しました`, 
        type: 'success' 
      });
      setIsClockingIn(false);
      
      setTimeout(() => {
        setMessage({ text: '', type: null });
      }, 5000);
    }, 500);
  };
  
  const handleClockOut = () => {
    if (!currentUser) return;
    
    setIsClockingOut(true);
    
    setTimeout(() => {
      clockOut(currentUser.id);
      setMessage({ 
        text: `${formatTime(new Date())}に退勤しました`, 
        type: 'success' 
      });
      setIsClockingOut(false);
      
      setTimeout(() => {
        setMessage({ text: '', type: null });
      }, 5000);
    }, 500);
  };
  
  const handleCorrection = () => {
    if (!selectedEntry || !correction.reason) {
      setMessage({
        text: '修正理由を入力してください',
        type: 'error'
      });
      return;
    }

    const correctionData: Partial<TimeEntry> = {
      correctionReason: correction.reason,
    };

    if (correction.clockInTime) {
      correctionData.clockInTime = new Date(correction.date + 'T' + correction.clockInTime);
    }

    if (correction.clockOutTime) {
      correctionData.clockOutTime = new Date(correction.date + 'T' + correction.clockOutTime);
    }

    correctTimeEntry(selectedEntry, correctionData);
    setShowCorrectionModal(false);
    setMessage({
      text: '打刻時間を修正しました',
      type: 'success'
    });

    setTimeout(() => {
      setMessage({ text: '', type: null });
    }, 5000);
  };
  
  // Get user's time entries for today and past days
  const userTimeEntries = currentUser 
    ? timeEntries
        .filter(entry => entry.userId === currentUser.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">打刻</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Time Clock Card */}
        <div className="bg-white rounded-xl shadow-md p-6 order-2 md:order-1">
          <div className="flex items-center justify-center mb-6">
            <Clock className="h-10 w-10 text-blue-500 mr-3" />
            <h2 className="text-3xl font-semibold text-gray-700">
              {formatTime(currentTime)}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleClockIn}
              disabled={isClockedIn || isClockingIn}
              className={`py-4 rounded-lg flex flex-col items-center justify-center transition-all ${
                isClockedIn 
                  ? 'bg-gray-100 cursor-not-allowed text-gray-400' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <LogIn className={`h-6 w-6 ${isClockedIn ? 'text-gray-400' : 'text-white'} mb-1`} />
              <span className="font-medium">出勤</span>
              {isClockingIn && (
                <span className="text-xs mt-1 text-blue-100">処理中...</span>
              )}
            </button>
            
            <button
              onClick={handleClockOut}
              disabled={!isClockedIn || isClockingOut}
              className={`py-4 rounded-lg flex flex-col items-center justify-center transition-all ${
                !isClockedIn 
                  ? 'bg-gray-100 cursor-not-allowed text-gray-400' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <LogOut className={`h-6 w-6 ${!isClockedIn ? 'text-gray-400' : 'text-white'} mb-1`} />
              <span className="font-medium">退勤</span>
              {isClockingOut && (
                <span className="text-xs mt-1 text-red-100">処理中...</span>
              )}
            </button>
          </div>
          
          {message.text && (
            <div className={`mt-6 p-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' :
              message.type === 'error' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {message.text}
            </div>
          )}
          
          {isClockedIn && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-700">
                {formatTime(activeTimeEntry?.clockInTime || new Date())}から勤務中です
              </p>
            </div>
          )}
        </div>
        
        {/* Recent Time Entries */}
        <div className="bg-white rounded-xl shadow-md p-6 order-1 md:order-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">打刻履歴</h2>
          </div>
          
          {userTimeEntries.length > 0 ? (
            <div className="space-y-4">
              {userTimeEntries.slice(0, 5).map(entry => (
                <div key={entry.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{entry.date}</span>
                      <div className="flex mt-1 text-gray-500">
                        <span className="mr-4">
                          出勤: {entry.clockInTime ? formatTime(entry.clockInTime) : '未打刻'}
                        </span>
                        <span>
                          退勤: {entry.clockOutTime ? formatTime(entry.clockOutTime) : '未打刻'}
                        </span>
                      </div>
                      {entry.corrected && (
                        <div className="mt-1 text-sm text-blue-600">
                          <span className="bg-blue-100 px-2 py-0.5 rounded text-xs">修正済</span>
                          {entry.correctionReason && (
                            <span className="ml-2">{entry.correctionReason}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEntry(entry.id);
                        setCorrection({
                          date: entry.date,
                          clockInTime: entry.clockInTime ? formatTime(entry.clockInTime) : '',
                          clockOutTime: entry.clockOutTime ? formatTime(entry.clockOutTime) : '',
                          reason: '',
                        });
                        setShowCorrectionModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">打刻履歴がありません</p>
          )}
        </div>
      </div>
      
      {/* Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">打刻修正</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">日付</label>
                <input
                  type="date"
                  value={correction.date}
                  onChange={(e) => setCorrection({...correction, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">出勤時間</label>
                  <input
                    type="time"
                    value={correction.clockInTime}
                    onChange={(e) => setCorrection({...correction, clockInTime: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">退勤時間</label>
                  <input
                    type="time"
                    value={correction.clockOutTime}
                    onChange={(e) => setCorrection({...correction, clockOutTime: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">修正理由</label>
                <textarea
                  value={correction.reason}
                  onChange={(e) => setCorrection({...correction, reason: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 h-24"
                  placeholder="修正理由を入力してください"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleCorrection}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                修正する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeClock;