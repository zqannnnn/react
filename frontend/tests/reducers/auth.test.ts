import { State, auth } from '../../src/reducers/auth'
import { Action } from '../../src/actions/auth'
import { consts } from '../../src/constants/auth'

it('login request action', () => {
  let state: State = {}
  let action: Action = { type: consts.LOGIN_REQUEST }
  let newState = auth(state, action)
  expect(newState).toEqual({ authInfo: undefined, processing: true })
})
