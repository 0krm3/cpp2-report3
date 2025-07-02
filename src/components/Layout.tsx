import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Calendar, CalendarDays, User, LogOut, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const location = useLocation();
  
  if (!currentUser) {
    return <>{children}</>;
  }
  
  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'bg-blue-700 text-white' 
      : 'text-white hover:bg-blue-700/50';
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">勤怠管理システム</h1>
          <div className="flex items-center space-x-3 mb-8 p-3 bg-blue-700/30 rounded-lg">
            <UserCircle className="h-8 w-8" />
            <div>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-sm opacity-80">
                {currentUser.role === 'admin' ? '管理者' : 'スタッフ'}
              </p>
            </div>
          </div>
        </div>
        
        <nav className="mt-2">
          <Link to="/" className={`flex items-center px-4 py-3 ${isActive('/')}`}>
            <Clock className="mr-3 h-5 w-5" />
            <span>打刻</span>
          </Link>
          
          <Link to="/my-shifts" className={`flex items-center px-4 py-3 ${isActive('/my-shifts')}`}>
            <Calendar className="mr-3 h-5 w-5" />
            <span>自分のシフト</span>
          </Link>
          
          <Link to="/all-shifts" className={`flex items-center px-4 py-3 ${isActive('/all-shifts')}`}>
            <CalendarDays className="mr-3 h-5 w-5" />
            <span>全体シフト表</span>
          </Link>
          
          {currentUser.role === 'admin' && (
            <Link to="/manage" className={`flex items-center px-4 py-3 ${isActive('/manage')}`}>
              <User className="mr-3 h-5 w-5" />
              <span>シフト管理</span>
            </Link>
          )}
        </nav>
        
        <div className="absolute bottom-0 w-64 border-t border-blue-500">
          <button 
            onClick={logout}
            className="flex items-center px-4 py-3 w-full text-white hover:bg-blue-700/50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>ログアウト</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;