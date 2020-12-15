import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: true,
    infoMsg: null,
    favorite: null,
    info: {},
    comments: {}
}

export const MovieReducer = (state = initialState, action) => {

    switch (action.type) {
        case ActionTypes.MOVIE_CLEAR:
            return { ...initialState };

        case ActionTypes.MOVIE_LOADING:
            return { ...state, isLoading: true, infoMsg: null };

        case ActionTypes.MOVIE_FAILED:
            return { ...state, isLoading: false, infoMsg: action.payload };

        case ActionTypes.MOVIE_ADD:
            return { ...state, isLoading: false, infoMsg: null, info: action.payload };

        case ActionTypes.FAVORITE_ADD:
            return { ...state, isLoading: false, infoMsg: null, favorite: action.payload };

        case ActionTypes.FAVORITE_FAILED:
            return { ...state, isLoading: false, infoMsg: action.payload, favorite: null };

        case ActionTypes.COMMENTS_ADD:
            return { ...state, isLoading: false, infoMsg: null, comments: action.payload };

        default:
            return state;
    }
}