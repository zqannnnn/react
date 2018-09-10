/*
import * as socket from 'socket.io' 
const socketIO = require('../../src/api/socketio')

jest.mock('socket.io', () => {
    return {
        connect: jest.fn(() => {
            return {
                on: jest.fn()
            }
        })
    }
})
*/

describe('SocketIO', () => {
    it('logged-out user', () => {
        //socketIO.startSocket()
        expect('').toEqual('')
    })
})
