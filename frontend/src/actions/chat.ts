import { transactionConsts, adminConsts, chatConsts } from '../constants'
import { transService } from '../services'
import { chatService } from '../services'
import { alertActionCreators } from '.'
import { history } from '../helpers/history'
import * as auth from '../helpers/auth'
import { Transaction, User } from '../models'
import { Dispatch } from 'react-redux'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'
import { ListOptions, Comment } from '../models'

export type Action = {
    type: string
    error?: string
    users?: Array<User>
}

type Thunk = ThunkAction<void, RootState, void>

const getAll: ActionCreator<Thunk> = () => {
    console.log('getAll')
    return (dispatch: Dispatch<RootState>): void => {
        dispatch(request())
        chatService.getAll().then(
            (result: { users: Array<User> }) =>
                dispatch(success(result.users)),
            (error: string) => {
                dispatch(failure(error))
                dispatch(alertActionCreators.error(error))
            }
        )
    }

    function request(): Action {
        return { type: chatConsts.GETALL_REQUEST }
    }
    function success(users: Array<User>): Action {
        return { type: chatConsts.GETALL_SUCCESS, users }
    }
    function failure(error: string): Action {
        return { type: chatConsts.GETALL_FAILURE, error }
    }

}

export const actionCreators = {
    getAll,
}
