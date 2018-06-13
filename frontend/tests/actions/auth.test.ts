import mockData from '../__mocks__/mockData'
import mockLocalStorage from '../__mocks__/mockLocalStorage'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { actionCreators } from '../../src/actions/auth' 
import fetch from 'jest-fetch-mock'

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

window.localStorage = mockLocalStorage;

describe('Auth actions', () => {
    beforeEach(() => fetch.resetMocks())

    it('login request action', () => {
        const { authResponse, signupData } = mockData.default
        fetch.mockResponseOnce(JSON.stringify(authResponse))
        const store = mockStore({});
        store.dispatch(actionCreators.login('admin@admin.com', 'admin')).then(() => {
            expect(localStorage.get().auth.isAdmin).toEqual(authResponse.isAdmin)
        });
    })
})