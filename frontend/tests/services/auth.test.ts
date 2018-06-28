import mockData from '../__mocks__/mockData'
import mockLocalStorage from '../__mocks__/mockLocalStorage'
import { authService } from '../../src/services/auth'
import fetch from 'jest-fetch-mock'

window.localStorage = mockLocalStorage

describe('Auth Services', () => {
  beforeEach(() => fetch.resetMocks())

  it('login', () => {
    const { authResponse, signupData } = mockData.default
    fetch.mockResponseOnce(JSON.stringify(authResponse))
    authService.login('admin@admin.com', 'admin').then(() => {
      expect(localStorage.get().auth.isAdmin).toEqual(authResponse.isAdmin)
    })
  })
})
