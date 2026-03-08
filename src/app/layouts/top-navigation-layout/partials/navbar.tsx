import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '@/app/shared/utils/common.utils'
import { useLogout } from '@/app/features/auth/hooks/use-logout'
import { useAuth } from '@/app/providers/auth-provider'
import { usePermission } from '@/app/shared/permissions/use-permission'

const navLinks = [
  { to: '/',      label: 'Dashboard',    end: true,  permission: null },
  { to: '/users', label: 'Użytkownicy',  end: false, permission: 'canViewUsers' as const },
]

const linkClass = (isActive: boolean) =>
  cn(
    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
    isActive
      ? 'bg-gray-100 text-gray-900'
      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
  )

const Navbar = () => {
  const logout          = useLogout()
  const { user }        = useAuth()
  const navigate        = useNavigate()
  const [open, setOpen] = useState(false)
  const [profileMenu, setProfileMenu] = useState(false)

  const canViewUsers = usePermission('canViewUsers')

  const filteredLinks = navLinks.filter(
    (l) => l.permission === null || canViewUsers,
  )

  return (
    <>
      <header className="h-14 border-b border-gray-200 bg-white flex items-center px-4 md:px-6 gap-4">

        <span className="font-bold text-gray-900 shrink-0">Admin Panel</span>

        {/* linki desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {filteredLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => linkClass(isActive)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">

          {/* avatar + dropdown — desktop */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setProfileMenu((p) => !p)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
              </div>
              <span className="text-sm text-gray-700 max-w-[120px] truncate">{user?.name}</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {profileMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileMenu(false)} />
                <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={() => { navigate('/profile'); setProfileMenu(false) }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Mój profil
                  </button>
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={() => { logout.mutate(); setProfileMenu(false) }}
                    disabled={logout.isPending}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Wyloguj
                  </button>
                </div>
              </>
            )}
          </div>

          {/* hamburger mobile */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>
      </header>

      {/* mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-xl flex flex-col md:hidden">

            <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                </div>
                <span className="text-sm font-medium text-gray-900 truncate max-w-[140px]">{user?.name}</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col p-3 gap-1">
              {filteredLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => cn(linkClass(isActive), 'block w-full')}
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className={({ isActive }) => cn(linkClass(isActive), 'block w-full')}
              >
                Mój profil
              </NavLink>
            </nav>

            <div className="mt-auto p-4 border-t border-gray-200">
              <button
                onClick={() => { logout.mutate(); setOpen(false) }}
                disabled={logout.isPending}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {logout.isPending ? 'Wylogowywanie...' : 'Wyloguj'}
              </button>
            </div>

          </div>
        </>
      )}
    </>
  )
}

export { Navbar }