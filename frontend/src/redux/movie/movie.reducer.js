import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: true,
    infoMsg: null,
    favoriteMsg: null,
    favorite: null,
    info: null,
    comments: {},
    quality: null
}

export const MovieReducer = (state = initialState, action) => {

    switch (action.type) {
        case ActionTypes.MOVIE_CLEAR:
            return { ...initialState };

        case ActionTypes.MOVIE_LOADING:
            return { ...state, isLoading: true, infoMsg: null };

        case ActionTypes.MOVIE_FAILED:
            return { ...initialState, isLoading: false, infoMsg: action.payload };

        case ActionTypes.MOVIE_ADD:
            return { ...state, isLoading: false, infoMsg: null, info: action.payload };

        case ActionTypes.FAVORITE_ADD:
            return { ...state, isLoading: false, favoriteMsg: null, favorite: action.payload };

        case ActionTypes.FAVORITE_FAILED:
            return { ...state, isLoading: false, favoriteMsg: action.payload, favorite: null };

        case ActionTypes.COMMENTS_ADD:
            return { ...state, isLoading: false, comments: action.payload };

        case ActionTypes.QUALITY_ADD:
            return { ...state, isLoading: false, quality: action.quality };

        default:
            return state;
    }
}