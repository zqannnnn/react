import * as React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Chat } from '../../../src/components'
import { State, auth } from '../../../src/reducers/auth'
import { consts } from '../../../src/constants/auth'
import { Action } from '../../../src/actions/auth'
import * as socketIOClient from 'socket.io-client'

//LINK TO SETUP EXPLANATION: https://medium.com/@mateuszsokola/configuring-react-16-jest-enzyme-typescript-7122e1a1e6e8
//LINK TO MOCK EXPLANATION https://stackoverflow.com/questions/40465047/how-can-i-mock-an-es6-module-import-using-jest
//LINK TO MOCK EXPLANATION https://stackoverflow.com/questions/39633919/cannot-mock-a-module-with-jest-and-test-function-calls
//LINK TO MOCK EXPLANATION xhttps://stackoverflow.com/questions/47402005/jest-mock-how-to-mock-es6-class-default-import-using-factory-parameter
//LINK TO SOCKET.IO MOCKING https://medium.freecodecamp.org/testing-socket-io-client-app-using-jest-and-react-testing-library-9cae93c070a3

jest.mock('socket.io-client', () => {
    return {
        connect: jest.fn(() => {
            return {
                on: jest.fn()
            }
        })
    }
})

beforeEach(() => {
    socketIOClient.connect.mockClear()
})

describe('Render chat for', () => {
    it('logged-out user', () => {
        let state = {}
        let action = { type: consts.LOGIN_REQUEST }
        let newState = auth(state, action)
        const wrap = shallow(
            <Chat auth={newState} />
        )
        expect(wrap.text()).toEqual('')
        expect(socketIOClient.connect.mock.calls.length).toBe(1)
        expect(socketIOClient.connect.mock.results[0].value.on.mock.calls.length).toBe(1)
    })

    it('logged-in user', () => {
        let state = {}
        let action = { type: consts.LOGIN_SUCCESS }
        let newState = auth(state, action)
        expect(newState).toEqual({ authInfo: undefined, loggedIn: true })
        const wrap = shallow(
            <Chat auth={newState} />
        )
        expect(wrap.text()).toEqual('')
        expect(socketIOClient.connect.mock.calls.length).toBe(1)
        expect(socketIOClient.connect.mock.results[0].value.on.mock.calls.length).toBe(1)
    })
})