import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { MentorLayout } from './layouts/MentorLayout';
import { DashboardPage } from './pages/mentee/DashboardPage';
import { ChapterViewerPage } from './pages/mentee/ChapterViewerPage';
import { TaskPage } from './pages/mentee/TaskPage';
import { FeedbackPage } from './pages/mentee/FeedbackPage';
import { ResourcePage } from './pages/mentee/ResourcePage';
import { QAPage } from './pages/mentee/QAPage';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ContentManagementPage } from './pages/admin/ContentManagementPage';
import { TaskManagementPage } from './pages/admin/TaskManagementPage';
import { TaskDetailPage } from './pages/admin/TaskDetailPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { CampManagementPage } from './pages/admin/CampManagementPage';
import { CampDetailPage } from './pages/admin/CampDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mentee" element={<MentorLayout />}>
          <Route index element={<Navigate to="/mentee/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="chapter/:chapterId/:sectionId?" element={<ChapterViewerPage />} />
          <Route path="task/:weekId" element={<TaskPage />} />
          <Route path="feedback/:taskId" element={<FeedbackPage />} />
          <Route path="resources" element={<ResourcePage />} />
          <Route path="qa" element={<QAPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="camps" element={<CampManagementPage />} />
          <Route path="camps/:id" element={<CampDetailPage />} />
          <Route path="content" element={<ContentManagementPage />} />
          <Route path="tasks" element={<TaskManagementPage />} />
          <Route path="tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
