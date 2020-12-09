import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: true,
    infoMsg: null,
    info: {}
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

        default:
            return state;
    }
}