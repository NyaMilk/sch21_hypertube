import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: true,
    infoMsg: null,
    infoMsgViews: null,
    infoMsgComments: null,
    infoMsgFriends: null,
    info: {},
    views: [],
    comments: [],
    friends: []
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
            return { ...state, isLoading: false, infoMsgViews: null, views: action.payload };

        case ActionTypes.VIEWS_FAILED:
            return { ...state, isLoading: false, infoMsgViews: action.payload, views: [] };

        case ActionTypes.COMMENTS_ADD:
            return { ...state, isLoading: false, infoMsgComments: null, comments: action.payload };

        case ActionTypes.COMMENTS_FAILED:
            return { ...state, isLoading: false, infoMsgComments: action.payload, comments: [] };

        case ActionTypes.FRIENDS_ADD:
            return { ...state, isLoading: false, infoMsgFriends: null, friends: action.payload };

        case ActionTypes.FRIENDS_FAILED:
            return { ...state, isLoading: false, infoMsgFriends: action.payload, friends: [] };

        default:
            return state;
    }
}
