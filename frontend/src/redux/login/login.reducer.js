import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: false,
    infoMsg: null,
    isLogged: false,
    me: ""
}

export const LoginReducer = (state = initialState, action) => {

    switch (action.type) {
        case ActionTypes.LOGIN_OUT:
            return { ...initialState };

        case ActionTypes.LOGIN_LOADING:
            return { ...state, isLoading: true, infoMsg: null };

        case ActionTypes.LOGIN_FAILED:
            return { ...state, isLoading: false, infoMsg: action.payload, isLogged: false, me: {} };

        case ActionTypes.LOGIN_USERNAME_ADD:
            return { ...state, isLoading: false, infoMsg: null, isLogged: false, username: action.username };

        case ActionTypes.LOGIN_PASSWORD_ADD:
            return { ...state, isLoading: false, infoMsg: null, isLogged: false, password: action.password };

        case ActionTypes.LOGIN_DATA_ADD:
            return { ...state, isLoading: false, infoMsg: null, isLogged: true, password: null, me: action.payload };

        default:
            return state;
    }
}
