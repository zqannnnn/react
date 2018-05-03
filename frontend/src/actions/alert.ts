import { alertConsts } from '../constants';

export const actionCreators = {
    success,
    error,
    warning,
    clear
};

function success(message : string) : Action {
    return {type: alertConsts.SUCCESS, message};
}

function error(message : string) : Action {
    return {type: alertConsts.ERROR, message};
}

function warning(message : string) : Action {
    return {type: alertConsts.WARNING, message};
}

function clear() : Action {
    return {type: alertConsts.CLEAR};
}
export type Action = {
    type: string;
    message?: string;
}