import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';
import { fetchUpdateLogin } from '../login/ActionCreators';

export const editProfileStatus = (status) => ({
    type: ActionTypes.EDIT_PROFILE_STATUS_ADD,
    payload: status.result
});

export const editProfileLoading = () => ({
    type: ActionTypes.PROFILE_EDIT_LOADING
});

export const editProfileClear = () => ({
    type: ActionTypes.PROFILE_EDIT_CLEAR
});

export const editProfileFailed = (msg) => ({
    type: ActionTypes.PROFILE_EDIT_FAILED,
    payload: msg
});

export const setLogin = (username) => (dispatch) => {
    return dispatch(({
        type: ActionTypes.USERNAME_ADD,
        username: username
    }));
};

export const setFirstName = (firstname) => (dispatch) => {
    return dispatch(({
        type: ActionTypes.FIRSTNAME_ADD,
        firstname: firstname
    }));
};

export const setLastName = (lastname) => (dispatch) => {
    return dispatch(({
        type: ActionTypes.LASTNAME_ADD,
        lastname: lastname
    }));
};

export const setEmail = (email) => (dispatch) => {
    return dispatch(({
        type: ActionTypes.EMAIL_ADD,
        email: email
    }));
};

export const setAbout = (about) => (dispatch) => {
    return dispatch(({
        type: ActionTypes.ABOUT_ADD,
        about: about
    }));
};

export const editPasswordStatusAdd = (status) => ({
    type: ActionTypes.PASSWORD_STATUS_ADD,
    status: status
});

export const setNewPassword = (pass) => (dispatch) => {
    return dispatch(({
        type: ActionTypes.NEWPASSWORD_ADD,
        newpass: pass
    }));
};

export const initFormEdit = () => (dispatch) => {
    dispatch(editProfileClear());
};

export const fetchEditProfile = (data, login) => (dispatch) => {
    dispatch(editProfileLoading());

    return request(`/api/user/profile/edit/${login}`, data, 'POST')
        .then(response => response.json())
        .then(result => {
            console.log(result);
            dispatch(fetchUpdateLogin(result.username))
                .then(() => {
                    dispatch(editProfileStatus(result));
                })
        })
        .catch(error => dispatch(editProfileFailed(error.message)));
};