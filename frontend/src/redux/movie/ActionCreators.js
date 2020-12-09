import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';


export const MovieClear = () => ({
    type: ActionTypes.MOVIE_CLEAR
});

export const initMOVIE = () => (dispatch) => {
    dispatch(MovieClear());
};

export const MovieLoading = () => ({
    type: ActionTypes.MOVIE_LOADING
});

export const MovieFailed = (msg) => ({
    type: ActionTypes.MOVIE_FAILED,
    payload: msg
});

export const MovieAdd = (data) => ({
    type: ActionTypes.MOVIE_ADD,
    payload: data
});

export const fetchMovie = (imdb) => (dispatch) => {
    dispatch(MovieLoading());

    return request(`/api/movies/movie/${imdb}`)
        .then(response => response.json())
        .then(result => {
            if (result.success)
                dispatch(MovieAdd(result.data))
            else
                dispatch(MovieFailed(result.message))
        })
        .catch(error => dispatch(MovieFailed(error.message)));
};
