import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import LearnHierarchies from './pages/LearnHierarchies';
import AssemblyHierarchy from './pages/AssemblyHierarchy';
import CourtHierarchy from './pages/CourtHierarchy';
import CivicKnowledge from './pages/CivicKnowledge';
import ExploreDistricts from './pages/ExploreDistricts';
import QuizPage from './pages/QuizPage';
import SectionDetail from './pages/SectionDetail';
import PlatformDashboard from './pages/PlatformDashboard';
import SchoolDashboard from './pages/SchoolDashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="learn-hierarchies" element={<LearnHierarchies />} />
        <Route path="learn-hierarchies/assembly" element={<AssemblyHierarchy />} />
        <Route path="learn-hierarchies/court" element={<CourtHierarchy />} />
        <Route path="know-ap" element={<CivicKnowledge />} />
        <Route path="explore-districts" element={<ExploreDistricts />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="hierarchy" element={<Navigate to="/learn-hierarchies" replace />} />
        <Route path="section/:slug" element={<SectionDetail />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={['platform_admin']}>
              <PlatformDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="school-admin"
          element={
            <ProtectedRoute roles={['school_admin']}>
              <SchoolDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
