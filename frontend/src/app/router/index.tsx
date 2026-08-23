import { Navigate, Route, Routes } from 'react-router-dom'

import { PublicLayout } from '../../layouts/PublicLayout'
import { ResidentLayout } from '../../layouts/ResidentLayout'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import HomePage from '../../pages/marketing/HomePage'
import LoginPage from '../../pages/auth/LoginPage'
import DashboardPage from '../../pages/resident/DashboardPage'
import ComplaintsPage from '../../pages/resident/ComplaintsPage'
import CreateComplaintPage from '../../pages/resident/CreateComplaintPage'
import MeetingsPage from '../../pages/resident/MeetingsPage'
import MaintenancePage from '../../pages/resident/MaintenancePage'
import CommunityPage from '../../pages/resident/CommunityPage'
import AiHelpPage from '../../pages/resident/AiHelpPage'
import SettingsPage from '../../pages/resident/SettingsPage'
import SignupPage from '../../pages/auth/SignupPage'
import VerifyOtpPage from '../../pages/auth/VerifyOtpPage'
import ForgotPasswordPage from '../../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../../pages/auth/ResetPasswordPage'
import NotificationsPage from '../../pages/resident/NotificationsPage'
import ResidentAnnouncementsPage from '../../pages/ResidentAnnouncementsPage'
import AdminDashboardPage from '../../pages/admin/AdminDashboardPage'
import AdminResidentsPage from '../../pages/admin/AdminResidentsPage'
import AdminComplaintsPage from '../../pages/admin/AdminComplaintsPage'
import AdminMeetingsPage from '../../pages/admin/AdminMeetingsPage'
import AdminAnnouncementsPage from '../../pages/admin/AdminAnnouncementsPage'
import AdminMaintenancePage from '../../pages/admin/AdminMaintenancePage'
import OnboardingChoicePage from '../../pages/onboarding/OnboardingChoicePage'
import SocietyRegistrationPage from '../../pages/onboarding/SocietyRegistrationPage'
import SocietyVerificationPage from '../../pages/onboarding/SocietyVerificationPage'
import SocietyVerificationPendingPage from '../../pages/onboarding/SocietyVerificationPendingPage'
import { RoleRoute } from '../../components/auth/RoleRoute'
import SocietyStructurePage from '../../pages/admin/SocietyStructurePage'
import ResidentInvitationPage from '../../pages/auth/ResidentInvitationPage'
import AccountHomePage from '../../pages/account/AccountHomePage'
import AccountProfilePage from '../../pages/account/AccountProfilePage'
import AccountSettingsPage from '../../pages/account/AccountSettingsPage'

function ResidentDashboard() {
  return (
    <ResidentLayout>
      <DashboardPage />
    </ResidentLayout>
  )
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<AccountHomePage />} />
      </Route>
      <Route
        path="/invite/resident"
        element={<ResidentInvitationPage />}
      />
      <Route
        path="/onboarding"
        element={<OnboardingChoicePage />}
      />
      <Route
        path="/onboarding/society"
        element={<SocietyRegistrationPage />}
      />
      <Route
        path="/onboarding/society/verification"
        element={<SocietyVerificationPage />}
      />
      <Route
        path="/onboarding/society/pending"
        element={<SocietyVerificationPendingPage />}
      />
      {/* Account application */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/account/profile"
          element={<AccountProfilePage />}
        />

        <Route
          path="/account/settings"
          element={<AccountSettingsPage />}
        />

        <Route
          path="/account/societies/new"
          element={<SocietyRegistrationPage />}
        />
      </Route>

      {/* Resident application */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['RESIDENT']} />}>
          <Route path="/app">
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<ResidentDashboard />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route
            path="complaints/new"
            element={<CreateComplaintPage />}
          />
          <Route path="community" element={<CommunityPage />} />
          <Route
            path="announcements"
            element={<ResidentAnnouncementsPage />}
          />
          <Route path="meetings" element={<MeetingsPage />} />
          <Route path="payments" element={<MaintenancePage />} />
          <Route path="ai-help" element={<AiHelpPage />} />
          <Route
            path="notifications"
            element={
              <ResidentLayout>
                <NotificationsPage />
              </ResidentLayout>
            }
          />
          <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

      {/* Admin application */}
      {/* Admin application */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['SOCIETY_ADMIN']} />}>
          <Route path="/admin">
            <Route index element={<AdminDashboardPage />} />
            <Route
              path="society"
              element={<SocietyStructurePage />}
            />
            <Route
              path="residents"
              element={<AdminResidentsPage />}
            />

            <Route
              path="complaints"
              element={<AdminComplaintsPage />}
            />

            <Route
              path="meetings"
              element={<AdminMeetingsPage />}
            />

            <Route
              path="announcements"
              element={<AdminAnnouncementsPage />}
            />

            <Route
              path="maintenance"
              element={<AdminMaintenancePage />}
            />
          </Route>
        </Route>
      </Route>
      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}