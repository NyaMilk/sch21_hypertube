import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: false,
    infoMsg: null,
    hasNew: false,
    notifications: {}
}

export const NotificationReducer = (state = initialState, action) => {

    switch (action.type) {
        case ActionTypes.NOTIFICATIONS_LOADING:
            return { ...state, isLoading: true, infoMsg: null };

        case ActionTypes.NOTIFICATIONS_ADD:
            return { ...state, isLoading: false, infoMsg: null, notifications: action.payload };

        case ActionTypes.NOTIFICATIONS_FAILED:
            return { ...state, isLoading: false, infoMsg: action.payload, notifications: {} };

        case ActionTypes.NOTIFICATIONS_NEW:
            return { ...state, isLoading: false, infoMsg: null, hasNew: action.status };

        default:
            return state;
    }
}
