import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';

export const loginOut = () => ({
    type: ActionTypes.LOGIN_OUT
})

export const logOut = () => (dispatch) => {
    return dispatch(loginOut());
}

export const loginLoading = () => ({
    type: ActionTypes.LOGIN_LOADING
});

export const loginDataAdd = (info) => ({
    type: ActionTypes.LOGIN_DATA_ADD,
    payload: info
});

export const loginFailed = (msg) => ({
    type: ActionTypes.LOGIN_FAILED,
    payload: msg
});

export const loginUsernameAdd = (login) => ({
    type: ActionTypes.LOGIN_USERNAME_ADD,
    username: login
});

export const setLogin = (login) => (dispatch) => {
    return dispatch(loginUsernameAdd(login));
}

export const loginPasswordAdd = (password) => ({
    type: ActionTypes.LOGIN_PASSWORD_ADD,
    password: password
});

export const setPassword = (password) => (dispatch) => {
    return dispatch(loginPasswordAdd(password));
}

export const fetchLogin = (login, password) => (dispatch) => {
    dispatch(loginLoading());

    const data = {
        login: login,
        password: password
    }

    return request('/api/user/login', data, 'POST')
        .then(res => res.json())
        .then(result => {
            if (result.success === true) {
                dispatch(loginDataAdd(result.profile));
            }
            else {
                dispatch(loginFailed(result.message));
            }
        })
        .catch(error => dispatch(loginFailed(error.message)));
}

export const fetchUpdateLogin = (login) => (dispatch) => {
    dispatch(loginLoading());

    return request(`/api/user/login/${login}`)
        .then(res => res.json())
        .then(result => {
            if (result.success === true) {
                console.log(result);
                dispatch(loginDataAdd(result.profile));
            }
            else {
                dispatch(loginFailed(result.message));
            }
        })
        .catch(error => dispatch(loginFailed(error.message)));
}
