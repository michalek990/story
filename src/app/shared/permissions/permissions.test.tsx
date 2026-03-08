import { describe, it, expect } from 'vitest'
import { hasPermission, ROLE_PERMISSIONS } from './permissions'

describe('hasPermission', () => {

  describe('canViewUsers', () => {
    it('admin może widzieć użytkowników', () => {
      expect(hasPermission('admin', 'canViewUsers')).toBe(true)
    })
    it('system_admin może widzieć użytkowników', () => {
      expect(hasPermission('system_admin', 'canViewUsers')).toBe(true)
    })
    it('coordinator może widzieć użytkowników', () => {
      expect(hasPermission('coordinator', 'canViewUsers')).toBe(true)
    })
    it('user NIE może widzieć użytkowników', () => {
      expect(hasPermission('user', 'canViewUsers')).toBe(false)
    })
  })

  describe('canCreateUser', () => {
    it('admin może tworzyć użytkowników', () => {
      expect(hasPermission('admin', 'canCreateUser')).toBe(true)
    })
    it('system_admin może tworzyć użytkowników', () => {
      expect(hasPermission('system_admin', 'canCreateUser')).toBe(true)
    })
    it('coordinator NIE może tworzyć użytkowników', () => {
      expect(hasPermission('coordinator', 'canCreateUser')).toBe(false)
    })
    it('user NIE może tworzyć użytkowników', () => {
      expect(hasPermission('user', 'canCreateUser')).toBe(false)
    })
  })

  describe('canDeleteUser', () => {
    it('admin może usuwać użytkowników', () => {
      expect(hasPermission('admin', 'canDeleteUser')).toBe(true)
    })
    it('coordinator NIE może usuwać użytkowników', () => {
      expect(hasPermission('coordinator', 'canDeleteUser')).toBe(false)
    })
    it('user NIE może usuwać użytkowników', () => {
      expect(hasPermission('user', 'canDeleteUser')).toBe(false)
    })
  })

  describe('nieznana rola', () => {
    it('nieznana rola nie ma żadnych uprawnień', () => {
      expect(hasPermission('superuser', 'canViewUsers')).toBe(false)
      expect(hasPermission('', 'canCreateUser')).toBe(false)
    })
  })

  describe('struktura ROLE_PERMISSIONS', () => {
    it('każde uprawnienie ma tablicę ról', () => {
      Object.values(ROLE_PERMISSIONS).forEach((roles) => {
        expect(Array.isArray(roles)).toBe(true)
        expect(roles.length).toBeGreaterThan(0)
      })
    })
  })
})