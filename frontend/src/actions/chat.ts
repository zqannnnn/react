import { chatConsts } from '../constants'
import { chatService } from '../services'
import { alertActionCreators } from '.'
import { User } from '../models'
import { Dispatch } from 'react-redux'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'

export type Action = {
    type: string
    ids?: Array<string> 
    error?: string
    users?: Array<User>
}

type Thunk = ThunkAction<void, RootState, void>

const getAll: ActionCreator<Thunk> = () => {
    return (dispatch: Dispatch<RootState>): void => {
        dispatch(request())
        chatService.getAll().then(
            (result: { users: Array<User>, ids: Array<string> }) =>
                dispatch(success(result.users, result.ids)),
            (error: string) => {
                dispatch(failure(error))
                dispatch(alertActionCreators.error(error))
            }
        )
    }

    function request(): Action {
        return { type: chatConsts.GETALL_REQUEST }
    }
    function success(users: Array<User>, ids: Array<string> ): Action {
        return { type: chatConsts.GETALL_SUCCESS, users, ids }
    }
    function failure(error: string): Action {
        return { type: chatConsts.GETALL_FAILURE, error }
    }

}

export const actionCreators = {
    getAll,
}
