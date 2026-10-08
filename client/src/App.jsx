import StudentRequestsPage from './pages/student/StudentRequestsPage.jsx';
import CreateRequestPage from './pages/student/CreateRequestPage.jsx';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import StaffDashboardPage from './pages/staff/StaffDashboardPage.jsx';
import StaffRequestDetailPage from './pages/staff/StaffRequestDetailPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route
            path="/student/requests"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/requests/new"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CreateRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/requests"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/requests/:id"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffRequestDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
