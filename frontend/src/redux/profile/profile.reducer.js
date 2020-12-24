import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: true,
    infoMsg: null,
    info: {},
    views: [],
    comments: [],
}

export const ProfileReducer = (state = initialState, action) => {

    switch (action.type) {
        case ActionTypes.PROFILE_ADD:
            return { ...state, isLoading: false, infoMsg: null, info: action.payload };

        case ActionTypes.PROFILE_LOADING:
            return { ...state, isLoading: true, infoMsg: null, info: {} };

        case ActionTypes.PROFILE_FAILED:
            return { ...state, isLoading: false, infoMsg: action.payload, info: {} };

        case ActionTypes.VIEWS_ADD:
            return { ...state, isLoading: false, infoMsg: null, views: action.payload };

        case ActionTypes.VIEWS_LOADING:
            return { ...state, isLoading: true, infoMsg: null, views: [] };

        case ActionTypes.VIEWS_FAILED:
            return { ...state, isLoading: false, infoMsg: action.payload, views: [] };

        case ActionTypes.COMMENTS_ADD:
            return { ...state, isLoading: false, infoMsg: null, comments: action.payload };

        case ActionTypes.COMMENTS_LOADING:
            return { ...state, isLoading: true, infoMsg: null, comments: [] };

        case ActionTypes.COMMENTS_FAILED:
            return { ...state, isLoading: false, infoMsg: action.payload, comments: [] };

        default:
            return state;
    }
}
