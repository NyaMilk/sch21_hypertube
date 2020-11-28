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

export const formLogin = (login) => ({
    type: ActionTypes.USER_FORM_USERNAME_ADD,
    userName: login
});

export const setLogin = (login) => (dispatch) => {
    dispatch(formLogin(login));
};

export const formFirstName = (firstName) => ({
    type: ActionTypes.USER_FORM_FIRSTNAME_ADD,
    firstName: firstName
});

export const setFirstName = (firstName) => (dispatch) => {
    dispatch(formFirstName(firstName));
};

export const formLastName = (lastName) => ({
    type: ActionTypes.USER_FORM_LASTNAME_ADD,
    lastName: lastName
});

export const setLastName = (lastName) => (dispatch) => {
    dispatch(formLastName(lastName));
};

export const formEmail = (email) => ({
    type: ActionTypes.USER_FORM_EMAIL_ADD,
    email: email
});

export const setEmail = (email) => (dispatch) => {
    dispatch(formEmail(email));
};

export const formPassword = (pass) => ({
    type: ActionTypes.USER_FORM_PASSWORD_ADD,
    password: pass
});

export const setPassword = (pass) => (dispatch) => {
    dispatch(formPassword(pass));
};

export const formRepassword = (pass) => ({
    type: ActionTypes.USER_FORM_REPASSWORD_ADD,
    repassword: pass
});

export const setRepassword = (pass) => (dispatch) => {
    dispatch(formRepassword(pass));
};

export const fetchRegister = (data) => (dispatch) => {
    dispatch(formLoading());

    return request('/api/register', data, 'POST')
        .then(res => res.json())
        .then(result => {
            if (result.success === true) {
                const login = result.login;
                console.log(result, login);
                request('https://extreme-ip-lookup.com/json/')
                    .then(res => res.json())
                    .then((result) => {
                        const data = {
                            country: result.country,
                            city: result.city,
                            longitude: result.lon,
                            latitude: result.lat
                        }
                        request(`/api/register/location/${login}`, data, 'POST')
                            .then(res => res.json())
                            .then(result => {
                                console.log(result);
                                if (result.success)
                                    dispatch(formSubmit());
                                else
                                    dispatch(formFailed(result.message))
                            })
                            .catch(error => dispatch(formFailed(error.message)));
                    })
            }
            else {
                dispatch(formFailed(result.message))
            }
        })
        .catch(error => dispatch(formFailed(error.message)));
}
