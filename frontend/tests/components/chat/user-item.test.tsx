import * as React from 'react'
import { shallow, mount, render } from 'enzyme'
import { UserItem } from '../../../src/components/chat/user-item'
import * as socketIOClient from 'socket.io-client'

jest.mock('socket.io-client', () => {
  return {
    connect: jest.fn(() => {
      return {
        on: jest.fn(),
        emit: jest.fn()
      }
    })
  }
})

beforeEach(() => {
  //socketIOClient.connect.mockClear()
})

describe('Chat user item ', () => {
  it('render empty chat', () => {
    const socket = socketIOClient.connect(window.location.origin)
    const wrap = shallow(
      <UserItem
        messages={{}}
        userKey="userKey"
        socket={socket}
        ownerUserKey="ownerUserKey"
      />
    )
    expect(wrap.state('value')).toEqual('')
    expect(wrap.state('msgs')).toEqual([])
    expect(wrap.state('messages')).toEqual({})
    expect(wrap.text()).toEqual('<Spin />')
    expect(
      socketIOClient.connect.mock.results[0].value.emit.mock.calls.length
    ).toBe(1)
    expect(
      socketIOClient.connect.mock.results[0].value.emit.mock.calls[0][0]
    ).toBe('get-previous-messages')
  })

  it('render chat with one msg', () => {
    const socket = socketIOClient.connect(window.location.origin)
    const messages = {
      '1': {
        id: '1',
        from: 'userKey',
        to: 'ownerUserKey',
        msg: 'first msg',
        createdAt: '2018-09-11 09:00:37.532+00',
        isNew: false
      }
    }
    const wrap = shallow(
      <UserItem
        messages={messages}
        userKey="userKey"
        socket={socket}
        ownerUserKey="ownerUserKey"
      />
    )
    expect(wrap.state('value')).toEqual('')
    expect(wrap.state('msgs')).toEqual([messages['1']])
    expect(wrap.state('messages')).toEqual(messages)
    expect(wrap.find('.incoming').length).toBe(1)
    expect(wrap.text()).toEqual('<Spin />')
    expect(
      socketIOClient.connect.mock.results[0].value.emit.mock.calls.length
    ).toBe(1)
    expect(
      socketIOClient.connect.mock.results[0].value.emit.mock.calls[0][0]
    ).toBe('get-previous-messages')
  })
})
