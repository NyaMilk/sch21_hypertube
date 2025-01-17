import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';

export const loginOut = () => ({
    type: ActionTypes.LOGIN_OUT
})

export const logOut = () => (dispatch) => {
    dispatch(loginOut());

    return request(`/api/auth/logout`)
        .then(res => res.json());
}

export const loginLoading = () => ({
    type: ActionTypes.LOGIN_LOADING
});

export const setUser = (username) => (dispatch) => {
    return dispatch(({
        type: ActionTypes.LOGIN_USER_ADD,
        username: username
    }))
}

export const loginDataAdd = (info) => ({
    type: ActionTypes.LOGIN_DATA_ADD,
    payload: info
});

export const loginFailed = (msg) => ({
    type: ActionTypes.LOGIN_FAILED,
    payload: msg
});

export const setUserFailed = (msg) => (dispatch) => {
    return dispatch(loginFailed(msg))
}

export const localAuth = (username, password) => (dispatch) => {
    dispatch(loginLoading());

    const data = new URLSearchParams({
        'username': username,
        'password': password
    })

    request(`/api/auth/local`, data, 'POST', 'urlencoded')
        .then(res => res.json())
        .then(result => {
            if (result.success === true) {
                dispatch(loginDataAdd(result.user));
            }
            else {
                dispatch(loginFailed(result.message));
            }
        })
        .catch(error => dispatch(loginFailed(error.message)));
}
