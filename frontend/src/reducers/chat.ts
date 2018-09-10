import { transactionConsts, chatConsts } from '../constants'
import { TransactionAction, ChatAction } from '../actions'
import { Transaction, Comment, User } from '../models'
import { cloneDeep } from 'lodash'
export type State = {
    processing?: boolean
    users?: Array<User>
    ids?: Array<string>
    error?: string
}
export function chat(
    state: State = {},
    action: ChatAction
): State {
    switch (action.type) {
        case chatConsts.GETALL_REQUEST:
            return { processing: true }
        case chatConsts.GETALL_SUCCESS:
            return { processing: false, users: action.users, ids: action.ids }
        case chatConsts.GETALL_FAILURE:
            return { processing: false, error: action.error }
        default:
            return state
    }
}
