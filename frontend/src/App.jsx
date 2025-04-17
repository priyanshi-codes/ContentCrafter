import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import DashboardPage from './pages/Dashbord';
import UserDashboard from './pages/Userdashboard';
import { ThemeProvider } from './components/theme-provider';
import { ModeToggle } from "@/components/mode-toggle"
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    setIsAuthenticated(!!userEmail);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-white text-black dark:bg-[#0f0f0f] dark:text-white transition-colors">
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Auth routes */}
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/user-dashboard"
        element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />}
      />
    </Routes>
    </div>
    </ThemeProvider>
  );
}

export default App;
