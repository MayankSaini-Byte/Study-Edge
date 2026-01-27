import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { PlaceholderPage } from './pages/Placeholder';
import { Welcome } from './pages/Welcome';
import { Dashboard } from './pages/Dashboard';
import { Assignments } from './pages/Assignments';
import { Mess } from './pages/Mess';
import { Todo } from './pages/Todo';
import { Library } from './pages/Library';
import { Grades } from './pages/Grades';
import { Profile } from './pages/Profile';
import { AdminMessMenu } from './pages/AdminMessMenu';
import { Gravity } from './pages/Gravity';

import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen w-full">
        <BrowserRouter>
          <SmoothScroll>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/mess" element={<Mess />} />
                <Route path="/todo" element={<Todo />} />
                <Route path="/library" element={<Library />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/gravity" element={<Gravity />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/mess-menu" element={<AdminMessMenu />} />

                {/* New Routes */}
                <Route path="/fees" element={<PlaceholderPage title="Fee Structure" />} />
                <Route path="/schedule" element={<PlaceholderPage title="Class Schedule" />} />
                <Route path="/attendance" element={<PlaceholderPage title="Attendance Calculator" />} />
                <Route path="/events" element={<PlaceholderPage title="Upcoming Events" />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SmoothScroll>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
