import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { PageLoader } from './components/ui.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { About, Contact, Terms, Privacy, NotFound } from './pages/Static.jsx';

import StudentHome from './pages/student/StudentHome.jsx';
import Classes from './pages/student/Classes.jsx';
import ClassDetail from './pages/student/ClassDetail.jsx';
import MyClasses from './pages/student/MyClasses.jsx';
import Subscription from './pages/student/Subscription.jsx';
import Profile from './pages/student/Profile.jsx';

import Dashboard from './pages/admin/Dashboard.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import AdminUserDetail from './pages/admin/UserDetail.jsx';
import AdminPlans from './pages/admin/Plans.jsx';
import AdminClasses from './pages/admin/Classes.jsx';
import AdminPayments from './pages/admin/Payments.jsx';
import AdminSubscriptions from './pages/admin/Subscriptions.jsx';
import DeletionRequests from './pages/admin/DeletionRequests.jsx';
import AdminProfile from './pages/admin/AdminProfile.jsx';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}

function RequireStudent({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const loc = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function GuestOnly({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  return children;
}

// "/" → landing for guests, student home for students, dashboard for admins
function HomeRoute() {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Landing />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <StudentHome />;
}

function ProfileRoute() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Navigate to="/admin/profile" replace /> : <Profile />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/classes/:id" element={<ClassDetail />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
        <Route path="/my-classes" element={<RequireStudent><MyClasses /></RequireStudent>} />
        <Route path="/profile" element={<RequireAuth><ProfileRoute /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<AdminUserDetail />} />
        <Route path="plans" element={<AdminPlans />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="deletion-requests" element={<DeletionRequests />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
}
