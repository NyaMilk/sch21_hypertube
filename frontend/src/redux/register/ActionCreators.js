import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';

export const formLoading = () => ({
    type: ActionTypes.USER_FORM_LOADING
});

export const formFailed = (message) => ({
    type: ActionTypes.USER_FORM_FAILED,
    payload: message
});

export const formSubmit = (res) => ({
    type: ActionTypes.USER_FORM_SUBMIT,
    payload: res
});

export const setLogin = (login) => (dispatch) => {
    dispatch(({
        type: ActionTypes.USER_FORM_USERNAME_ADD,
        userName: login
    }));
};

export const setFirstName = (firstName) => (dispatch) => {
    dispatch(({
        type: ActionTypes.USER_FORM_FIRSTNAME_ADD,
        firstName: firstName
    }));
};

export const setLastName = (lastName) => (dispatch) => {
    dispatch(({
        type: ActionTypes.USER_FORM_LASTNAME_ADD,
        lastName: lastName
    }));
};

export const setEmail = (email) => (dispatch) => {
    dispatch(({
        type: ActionTypes.USER_FORM_EMAIL_ADD,
        email: email
    }));
};

export const setPassword = (pass) => (dispatch) => {
    dispatch(({
        type: ActionTypes.USER_FORM_PASSWORD_ADD,
        password: pass
    }));
};

export const setRepassword = (pass) => (dispatch) => {
    dispatch(({
        type: ActionTypes.USER_FORM_REPASSWORD_ADD,
        repassword: pass
    }));
};

export const fetchRegister = (data) => (dispatch) => {
    dispatch(formLoading());

    return request('/api/register', data, 'POST')
        .then(res => res.json())
        .then(result => {
            (result.success === true) ? dispatch(formSubmit()) : dispatch(formFailed(result.message));
        })
        .catch(error => dispatch(formFailed(error.message)));
}