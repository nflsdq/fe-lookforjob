import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout components
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';

// CV pages
import CV from './pages/cv/CV';

// Experience pages
import Experiences from './pages/experience/Experiences';
import AddExperience from './pages/experience/AddExperience';
import EditExperience from './pages/experience/EditExperience';

// Education pages
import Educations from './pages/education/Educations';
import AddEducation from './pages/education/AddEducation';
import EditEducation from './pages/education/EditEducation';

// Skill pages
import Skills from './pages/skill/Skills';
import AddSkill from './pages/skill/AddSkill';
import EditSkill from './pages/skill/EditSkill';

// Error pages
import NotFound from './pages/NotFound';

// New job page
import Jobs from './pages/Jobs';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      </Route>

      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="/jobs" element={<Jobs />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Profile routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          
          {/* CV routes */}
          <Route path="/cv" element={<CV />} />
          
          {/* Experience routes */}
          <Route path="/pengalaman" element={<Experiences />} />
          <Route path="/pengalaman/new" element={<AddExperience />} />
          <Route path="/pengalaman/:id/edit" element={<EditExperience />} />
          
          {/* Education routes */}
          <Route path="/pendidikan" element={<Educations />} />
          <Route path="/pendidikan/new" element={<AddEducation />} />
          <Route path="/pendidikan/:id/edit" element={<EditEducation />} />
          
          {/* Skill routes */}
          <Route path="/skills" element={<Skills />} />
          <Route path="/skills/new" element={<AddSkill />} />
          <Route path="/skills/:id/edit" element={<EditSkill />} />
        </Route>
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;