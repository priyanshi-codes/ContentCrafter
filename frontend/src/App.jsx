import { Routes, Route } from 'react-router-dom';
import Login from './module/pages/Login';
import Signup from './module/pages/Signup';
import DashboardPage from './module/pages/Dashbord';
import UserDashboard from './module/pages/Userdashboard';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './module/context/AuthContext';
import { ProtectedRoute, PublicRoute, ConditionalHomeRoute } from './module/components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className="min-h-screen bg-white text-black dark:bg-[#0f0f0f] dark:text-white transition-colors">
          <Routes>
            {/* Default route - redirects based on auth status */}
            <Route path="/" element={<ConditionalHomeRoute />} />

            {/* Auth routes - only accessible if not logged in */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />

            {/* Dashboard - accessible to everyone */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Protected routes - only accessible if logged in */}
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
