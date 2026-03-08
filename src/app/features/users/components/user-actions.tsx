import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '@/app/services/users.service'
import { useDeleteUser } from '@/app/features/users/hooks/use-delete-user'
import { useActivateUser } from '@/app/features/users/hooks/use-activate-user'
import { useResetUserPassword } from '@/app/features/users/hooks/use-reset-user-password'
import { cn } from '@/app/shared/utils/common.utils'

type UserActionsProps = {
  user: User
}

type ConfirmState = {
  open: boolean
  action: 'delete' | 'reset' | null
}

const UserActions = ({ user }: UserActionsProps) => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen]   = useState(false)
  const [confirm, setConfirm]     = useState<ConfirmState>({ open: false, action: null })
  const [menuPos, setMenuPos]     = useState({ top: 0, right: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)

  const deleteUser    = useDeleteUser()
  const activateUser  = useActivateUser(user.id)
  const resetPassword = useResetUserPassword()

  const isActive = user.status === 'active'

  // oblicz pozycję dropdownu relative do viewport
  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuPos({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      })
    }
    setMenuOpen(true)
  }

  // zamknij menu przy scrollu
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('scroll', close, true)
    return () => window.removeEventListener('scroll', close, true)
  }, [menuOpen])

  const handleConfirm = () => {
    if (confirm.action === 'delete') deleteUser.mutate(user.id)
    else if (confirm.action === 'reset') resetPassword.mutate(user.id)
    setConfirm({ open: false, action: null })
  }

  const menuItems = [
    {
      label: 'Edytuj',
      onClick: () => navigate(`/users/${user.id}/edit`),
    },
    {
      label: isActive ? 'Dezaktywuj' : 'Aktywuj',
      onClick: () => activateUser.mutate(user.status),
    },
    {
      label: 'Resetuj hasło',
      onClick: () => { setMenuOpen(false); setConfirm({ open: true, action: 'reset' }) },
    },
    {
      label: 'Usuń',
      danger: true,
      onClick: () => { setMenuOpen(false); setConfirm({ open: true, action: 'delete' }) },
    },
  ]

  return (
    <div className="relative">

      {/* przycisk */}
      <button
        ref={btnRef}
        onClick={(e) => { e.stopPropagation(); openMenu() }}
        className="rounded-md px-2 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
      >
        ···
      </button>

      {/* dropdown — fixed żeby nie był przycinany przez overflow */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="fixed z-50 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={(e) => { e.stopPropagation(); item.onClick(); setMenuOpen(false) }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm transition-colors',
                  item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* dialog potwierdzenia */}
      {confirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="font-semibold text-gray-900">
              {confirm.action === 'delete' ? 'Usuń użytkownika' : 'Resetuj hasło'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {confirm.action === 'delete'
                ? `Czy na pewno chcesz usunąć użytkownika ${user.firstName} ${user.lastName}? Tej operacji nie można cofnąć.`
                : `Czy na pewno chcesz zresetować hasło użytkownika ${user.firstName} ${user.lastName}? Link zostanie wysłany na adres ${user.email}.`}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirm({ open: false, action: null })}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleConfirm}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
                  confirm.action === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-900 hover:bg-gray-700',
                )}
              >
                {confirm.action === 'delete' ? 'Usuń' : 'Resetuj'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export { UserActions }