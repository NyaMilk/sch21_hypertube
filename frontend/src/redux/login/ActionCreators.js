import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';
import CONFIG from '../../util/const';

export const loginOut = () => ({
    type: ActionTypes.LOGIN_OUT
})

export const logOut = () => (dispatch) => {
    return request(`${CONFIG.API_URL}/api/auth/logout`)
        .then(res => res.json())
        .then(() => dispatch(loginOut()))

}

export const loginLoading = () => ({
    type: ActionTypes.LOGIN_LOADING
});

export const addUser = (username) => ({
    type: ActionTypes.LOGIN_USER_ADD,
    username: username
});

export const setUser = (username) => (dispatch) => {
    return dispatch(addUser(username))
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

    request(`${CONFIG.API_URL}/api/auth/local`, data, 'POST', 'urlencoded')
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

export const fetchUpdateLogin = (username) => (dispatch) => {
    dispatch(loginLoading());

    return request(`/api/user/login/${username}`)
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
