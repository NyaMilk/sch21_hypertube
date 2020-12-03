import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: true,
    infoMsg: null,
    info: {}
}

export const ProfileReducer = (state = initialState, action) => {

    switch (action.type) {
        case ActionTypes.PROFILE_ADD:
            return { ...state, isLoading: false, infoMsg: null, info: action.payload };

        case ActionTypes.PROFILE_LOADING:
            return { ...state, isLoading: true, infoMsg: null, info: {} };

        case ActionTypes.PROFILE_FAILED:
            return { ...state, isLoading: false, infoMsg: action.payload, info: {} };

        default:
            return state;
    }
}
