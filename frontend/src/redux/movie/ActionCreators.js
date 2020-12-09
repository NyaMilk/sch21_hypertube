import * as ActionTypes from './ActionTypes';
import { request } from '../../util/http';


export const movieClear = () => ({
    type: ActionTypes.MOVIE_CLEAR
});

export const initMovie = () => (dispatch) => {
    dispatch(movieClear());
};

export const movieLoading = () => ({
    type: ActionTypes.MOVIE_LOADING
});

export const movieFailed = (msg) => ({
    type: ActionTypes.MOVIE_FAILED,
    payload: msg
});

export const movieAdd = (data) => ({
    type: ActionTypes.MOVIE_ADD,
    payload: data
});

export const fetchMovie = (imdb) => (dispatch) => {
    dispatch(movieLoading());

    return request(`/api/movies/movie/${imdb}`)
        .then(response => response.json())
        .then(result => {
            if (result.success)
                dispatch(movieAdd(result.data))
            else
                dispatch(movieFailed(result.message))
        })
        .catch(error => dispatch(movieFailed(error.message)));
};
