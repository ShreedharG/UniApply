import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Login } from './features/auth/Login';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StudentDashboard } from './features/student/StudentDashboard';
import { MyApplications } from './features/student/MyApplications';
import { NewApplication } from './features/student/NewApplication';
import { DocumentsPage } from './features/student/DocumentsPage';
import { ApplicationDetails } from './features/student/ApplicationDetails';
import { SupportPage } from './features/student/SupportPage';
import { PaymentsPage } from './features/student/PaymentsPage';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { ApplicationReview } from './features/admin/ApplicationReview';
import { Role, User } from './types';
import { ThemeProvider } from './components/ThemeProvider';

// Layout wrapper for authenticated pages
const AppLayout = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <Sidebar
        role={user.role}
        onLogout={onLogout}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <Header
        user={user}
        isSidebarCollapsed={isSidebarCollapsed}
        onLogout={onLogout}
      />
      <main
        className={`pt-16 p-6 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'
          }`}
      >
        <Outlet context={{ user }} />
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        return {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        };
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="uniapply-theme">
      <HashRouter>
        <Routes>
          <Route path="/" element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to={user.role === Role.ADMIN ? "/admin/dashboard" : "/student/dashboard"} replace />
            )
          } />

          {user && (
            <Route element={<AppLayout user={user} onLogout={handleLogout} />}>
              {/* Student Routes */}
              {user.role === Role.STUDENT && (
                <>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/apply" element={<NewApplication />} />
                  <Route path="/student/applications" element={<MyApplications />} />
                  <Route path="/student/applications/:id" element={<ApplicationDetails />} />
                  <Route path="/student/documents" element={<DocumentsPage />} />
                  <Route path="/student/support" element={<SupportPage />} />
                  <Route path="/student/payments" element={<PaymentsPage />} />
                </>
              )}

              {/* Admin Routes */}
              {user.role === Role.ADMIN && (
                <>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/review/:id" element={<ApplicationReview />} />
                  <Route path="/admin/applications" element={<div className="p-8 text-center text-slate-500 dark:text-slate-400">Applications List Page</div>} />
                </>
              )}
            </Route>
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}