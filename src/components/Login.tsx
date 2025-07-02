import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCircle, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = () => {
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    
    const success = login(email, password);
    if (!success) {
      setError('メールアドレスまたはパスワードが正しくありません');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">勤怠管理システム</h1>
          <p className="text-gray-600">勤怠・シフト管理アプリへようこそ</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@company.com"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ログイン
          </button>
        </div>
        
        <div className="mt-6 border-t pt-6">
          <p className="text-sm text-gray-600 mb-3">テストアカウント:</p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>管理者: tanaka@example.com / admin123</p>
            <p>スタッフ: sato@example.com / employee123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;