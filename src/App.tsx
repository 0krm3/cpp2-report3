import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './components/Login';
import TimeClock from './components/TimeClock';
import MyShifts from './components/MyShifts';
import AllShifts from './components/AllShifts';
import ShiftManagement from './components/ShiftManagement';
import TodaySchedule from './components/TodaySchedule';

const AppRoutes: React.FC = () => {
  const { currentUser } = useApp();
  
  // If not logged in, show login screen
  if (!currentUser) {
    return <Login />;
  }
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TimeClock />} />
        <Route path="/my-shifts" element={<MyShifts />} />
        <Route path="/all-shifts" element={<AllShifts />} />
        <Route path="/manage" element={<ShiftManagement />} />
      </Routes>
      <TodaySchedule />
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;