import { describe, it, expect } from 'vitest'
import {
  mockUsers,
  mockInstitutions,
  mockFacilities,
  getMockFacilitiesByInstitution,
  getMockUserById,
} from './mock-data'

describe('mock-data', () => {

  describe('mockUsers', () => {
    it('zawiera użytkowników', () => {
      expect(mockUsers.length).toBeGreaterThan(0)
    })

    it('każdy user ma wymagane pola', () => {
      mockUsers.forEach((user) => {
        expect(user.id).toBeTruthy()
        expect(user.email).toContain('@')
        expect(user.firstName).toBeTruthy()
        expect(user.lastName).toBeTruthy()
        expect(['active', 'inactive']).toContain(user.status)
        expect(['admin', 'system_admin', 'coordinator', 'user']).toContain(user.role)
      })
    })

    it('IDs są unikalne', () => {
      const ids = mockUsers.map((u) => u.id)
      const unique = new Set(ids)
      expect(unique.size).toBe(ids.length)
    })
  })

  describe('mockInstitutions', () => {
    it('zawiera instytucje', () => {
      expect(mockInstitutions.length).toBeGreaterThan(0)
    })

    it('każda instytucja ma id i name', () => {
      mockInstitutions.forEach((inst) => {
        expect(inst.id).toBeTruthy()
        expect(inst.name).toBeTruthy()
      })
    })
  })

  describe('getMockFacilitiesByInstitution', () => {
    it('zwraca zakłady dla danej instytucji', () => {
      const facilities = getMockFacilitiesByInstitution('inst-1')
      expect(facilities.length).toBeGreaterThan(0)
      facilities.forEach((f) => expect(f.institutionId).toBe('inst-1'))
    })

    it('zwraca pustą tablicę dla nieistniejącej instytucji', () => {
      const facilities = getMockFacilitiesByInstitution('nieistniejaca')
      expect(facilities).toHaveLength(0)
    })
  })

  describe('getMockUserById', () => {
    it('zwraca usera po ID', () => {
      const user = getMockUserById('user-1')
      expect(user).toBeDefined()
      expect(user?.id).toBe('user-1')
    })

    it('zwraca undefined dla nieistniejącego ID', () => {
      const user = getMockUserById('nieistniejacy')
      expect(user).toBeUndefined()
    })
  })
})
