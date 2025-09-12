import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { JobSearch } from './pages/JobSearch';
import { JobDetail } from './pages/JobDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { EnhancedDashboard } from './pages/EnhancedDashboard';
import { SavedJobs } from './pages/SavedJobs';
import { Admin } from './pages/Admin';
import ContentAdmin from './pages/ContentAdmin';
import { EditProfile } from './pages/EditProfile';
import { About } from './pages/About';
import { SearchWidget } from './pages/widgets/SearchWidget';
import { ListingsWidget } from './pages/widgets/ListingsWidget';
import { LoginWidget } from './pages/widgets/LoginWidget';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router basename={import.meta.env.PROD ? '/one-talent-demo' : ''}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Widget Routes (for iframe embedding) */}
            <Route path="/widget/search" element={<SearchWidget />} />
            <Route path="/widget/listings" element={<ListingsWidget />} />
            <Route path="/widget/login" element={<LoginWidget />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <EnhancedDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/classic" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Placeholder Routes */}
            {/* <Route path="/companies" element={
              <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Companies page coming soon...</p>
              </div>
            } /> */}
            <Route path="/about" element={<About />} />
            <Route path="/saved-jobs" element={
              <ProtectedRoute>
                <SavedJobs />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                  <p className="text-gray-500">Applications page coming soon...</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/admin/content" element={
              <ProtectedRoute>
                <ContentAdmin />
              </ProtectedRoute>
            } />
            <Route path="/forgot-password" element={
              <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Forgot password page coming soon...</p>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  </ToastProvider>
  </ThemeProvider>
  );
}

export default App;