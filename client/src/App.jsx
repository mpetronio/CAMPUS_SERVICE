import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function StudentRequestsPlaceholder() {
  return <h1>My Requests</h1>;
}

function CreateRequestPlaceholder() {
  return <h1>New Request</h1>;
}

function StaffDashboardPlaceholder() {
  return <h1>Staff Dashboard</h1>;
}

function StaffRequestDetailPlaceholder() {
  return <h1>Request Details</h1>;
}

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
                {/* STU-FE-03 replaces this placeholder with StudentRequestsPage. */}
                <StudentRequestsPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/requests/new"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                {/* STU-FE-02 replaces this placeholder with CreateRequestPage. */}
                <CreateRequestPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/requests"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                {/* STAFF-FE-01 replaces this placeholder with StaffDashboardPage. */}
                <StaffDashboardPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/requests/:id"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                {/* STAFF-FE-04 replaces this with StaffRequestDetailPage. */}
                <StaffRequestDetailPlaceholder />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
