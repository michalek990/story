import { createBrowserRouter } from 'react-router-dom'

import { AuthLayout }            from '@/app/layouts/auth-layout/auth-layout'
import { TopNavigationLayout }   from '@/app/layouts/top-navigation-layout/top-navigation-layout'
import { ProtectedRoute }        from '@/app/shared/components/protected-route'
import { RoleGuard }             from '@/app/shared/permissions/role-guard'

import { LoginPage }             from '@/app/pages/login-page'
import { ResetPasswordPage }     from '@/app/pages/reset-password-page'
import { SetNewPasswordPage }    from '@/app/pages/set-new-password-page'

import { DashboardPage }         from '@/app/pages/dashboard-page'
import { UsersPage }             from '@/app/pages/users-page'
import { UserDetailPage }        from '@/app/pages/user-detail-page'
import { AddUserPage }           from '@/app/pages/add-user-page'
import { EditUserPage }          from '@/app/pages/edit-user-page'
import { ProfilePage }           from '@/app/pages/profile-page'

import { NotFoundPage }          from '@/app/pages/not-found-page'
import { UnauthorizedPage }      from '@/app/pages/unauthorized-page'

export const router = createBrowserRouter([

  {
    element: <AuthLayout />,
    children: [
      { path: '/login',            element: <LoginPage /> },
      { path: '/reset-password',   element: <ResetPasswordPage /> },
      { path: '/set-new-password', element: <SetNewPasswordPage /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <TopNavigationLayout />,
        children: [
          { path: '/',         element: <DashboardPage /> },
          { path: '/profile',  element: <ProfilePage /> },
          { path: '/unauthorized', element: <UnauthorizedPage /> },

          {
            path: '/users',
            element: (
              <RoleGuard permission="canViewUsers" mode="route">
                <UsersPage />
              </RoleGuard>
            ),
          },
          {
            path: '/users/new',
            element: (
              <RoleGuard permission="canCreateUser" mode="route">
                <AddUserPage />
              </RoleGuard>
            ),
          },
          { path: '/users/:id', element: <UserDetailPage /> },
          {
            path: '/users/:id/edit',
            element: (
              <RoleGuard permission="canEditUser" mode="route">
                <EditUserPage />
              </RoleGuard>
            ),
          },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])