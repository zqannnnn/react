import alertConstants from '../constants/alert';

export const actionCreators = {
    success,
    error,
    clear
};

function success(message : string) : Action {
    return {type: alertConstants.SUCCESS, message};
}

function error(message : string) : Action {
    return {type: alertConstants.ERROR, message};
}

function clear() : Action {
    return {type: alertConstants.CLEAR};
}
export type Action = {
    type: string;
    message?: string;
}