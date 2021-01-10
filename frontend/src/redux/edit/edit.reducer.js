import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: false,
    errMsg: null,
    username: null,
    firstname: null,
    lastname: null,
    email: null,
    about: null,
    newpass: null,
    passwordStatus: false,
    status: null
};

export const EditProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.EDIT_PROFILE_STATUS_ADD:
            return { ...state, isLoading: false, errProfile: null, status: action.payload };

        case ActionTypes.PROFILE_EDIT_LOADING:
            return { ...state, isLoading: true, errProfile: null, status: null };

        case ActionTypes.PROFILE_EDIT_FAILED:
            return { ...state, isLoading: false, errProfile: action.payload, status: null };

        case ActionTypes.PROFILE_EDIT_CLEAR:
            return { ...initialState };

        case ActionTypes.USERNAME_ADD:
            return { ...state, isLoading: false, errProfile: null, username: action.username };

        case ActionTypes.FIRSTNAME_ADD:
            return { ...state, isLoading: false, errProfile: null, firstname: action.firstname };

        case ActionTypes.LASTNAME_ADD:
            return { ...state, isLoading: false, errProfile: null, lastname: action.lastname };

        case ActionTypes.EMAIL_ADD:
            return { ...state, isLoading: false, errProfile: null, email: action.email };

        case ActionTypes.ABOUT_ADD:
            return { ...state, isLoading: false, errProfile: null, about: action.about };

        case ActionTypes.NEWPASSWORD_ADD:
            return { ...state, isLoading: false, errProfile: null, newpass: action.newpass };

        case ActionTypes.PASSWORD_STATUS_ADD:
            return { ...state, isLoading: false, errProfile: null, passwordStatus: action.passwordStatus };

        default:
            return state;
    }
}