// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { ConfigProvider } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import './styles/global.css';

const App = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#EBF5FF] to-white">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#2196F3' }} spin />} />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2196F3',
          colorSuccess: '#4CAF50',
          colorWarning: '#FFC107',
          colorError: '#F44336',
          colorInfo: '#2196F3',
          colorTextBase: '#2C3E50',
          colorBgContainer: '#FFFFFF',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;