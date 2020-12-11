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

export const setLogin = (nickname) => (dispatch) => {
    dispatch(() => ({
        type: ActionTypes.NICKNAME_ADD,
        nickname: nickname
    }));
};

export const setFirstName = (firstname) => (dispatch) => {
    dispatch(() => ({
        type: ActionTypes.FIRSTNAME_ADD,
        firstname: firstname
    }));
};

export const setLastName = (lastname) => (dispatch) => {
    dispatch(() => ({
        type: ActionTypes.LASTNAME_ADD,
        lastname: lastname
    }));
};

export const setEmail = (email) => (dispatch) => {
    dispatch(() => ({
        type: ActionTypes.EMAIL_ADD,
        email: email
    }));
};

export const setAbout = (about) => (dispatch) => {
    dispatch(() => ({
        type: ActionTypes.ABOUT_ADD,
        about: about
    }));
};

export const editPasswordStatusAdd = (status) => ({
    type: ActionTypes.PASSWORD_STATUS_ADD,
    status: status
});

export const setNewPassword = (pass) => (dispatch) => {
    dispatch(() => ({
        type: ActionTypes.NEWPASSWORD_ADD,
        newpass: newpass
    }));
};

export const initFormEdit = () => (dispatch) => {
    dispatch(editProfileClear());
};

export const fetchEditProfile = (data, login) => (dispatch) => {
    dispatch(editProfileLoading());

    request(`/api/profile/edit/${login}`, data, 'POST')
        .then(response => response.json())
        .then(result => {
            console.log(result);
            dispatch(fetchUpdateLogin(result.nickname))
                .then(() => {
                    dispatch(editProfileStatus(result));
                })
        })
        .catch(error => dispatch(editProfileFailed(error.message)));
};