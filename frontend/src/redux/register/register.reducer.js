import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: false,
    infoMsg: null,
    success: null,
    userName: null,
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    repassword: null
}

export const RegisterReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.USER_FORM_LOADING:
            return { ...state, isLoading: true, infoMsg: action.message };

        case ActionTypes.USER_FORM_FAILED:
            return { ...state, isLoading: false, infoMsg: action.payload };

        case ActionTypes.USER_FORM_USERNAME_ADD:
            return { ...state, isLoading: false, infoMsg: null, userName: action.userName };

        case ActionTypes.USER_FORM_FIRSTNAME_ADD:
            return { ...state, isLoading: false, infoMsg: null, firstName: action.firstName };

        case ActionTypes.USER_FORM_LASTNAME_ADD:
            return { ...state, isLoading: false, infoMsg: null, lastName: action.lastName };

        case ActionTypes.USER_FORM_EMAIL_ADD:
            return { ...state, isLoading: false, infoMsg: null, email: action.email };

        case ActionTypes.USER_FORM_PASSWORD_ADD:
            return { ...state, isLoading: false, infoMsg: null, password: action.password };

        case ActionTypes.USER_FORM_REPASSWORD_ADD:
            return { ...state, isLoading: false, infoMsg: null, repassword: action.repassword };

        case ActionTypes.USER_FORM_SUBMIT:
            return { ...initialState, success: action.payload };

        default:
            return state;
    }
}
